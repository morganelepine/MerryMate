<?php

namespace App\Http\Controllers;

use App\Models\BrandNote;
use App\Models\FollowedList;
use App\Models\GiftList;
use App\Models\Idea;
use App\Models\User;
use App\Notifications\NotifyListFollowed;
use App\Repositories\GiftListRepository;
use App\Repositories\IdeaRepository;
use App\Services\GiftListService;
use App\Support\GuestListAccess;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class GiftListController extends Controller
{
    protected $ideaRepository;

    protected $giftListService;

    protected $giftListRepository;

    public function __construct(IdeaRepository $ideaRepository, GiftListService $giftListService, GiftListRepository $giftListRepository)
    {
        $this->ideaRepository = $ideaRepository;
        $this->giftListService = $giftListService;
        $this->giftListRepository = $giftListRepository;
    }

    /**
     * Display the specified resource.
     *
     * This route is public: an authenticated owner/follower sees their list as usual,
     * while anyone else (including a signed-out visitor) only gets the list's ideas
     * once they have unlocked it with its private code.
     * A private list only exists for its owner.
     */
    public function show(Request $request, $id): Response
    {
        // Get list id from url
        $list = GiftList::find($id);
        abort_unless($list, 404);

        $isOwner = Auth::check() && Auth::id() === $list->user_id;

        if ($list->isPrivate && ! $isOwner) {
            // The visitor may be the owner, signed out.
            throw_unless(Auth::check(), AuthenticationException::class);
            abort(404);
        }

        $isFollower = Auth::check()
            && FollowedList::where('user_id', Auth::id())->where('gift_list_id', $list->id)->exists();
        $isGuestWithAccess = ! Auth::check() && GuestListAccess::has($list);
        $hasAccess = $isOwner || $isFollower || $isGuestWithAccess;

        if ($hasAccess) {
            $user = User::find($list->user_id);
            $list->user_lastname = $user ? $user->last_name : null;
        }

        if ($isOwner) {
            // The owner needs the plaintext code for the share button
            $list->revealPrivateCode();
        }

        if (! $hasAccess) {
            return Inertia::render('GiftList/Show', [
                'list' => $list,
                'ideas' => [],
                'ideas_available' => [],
                'ideas_reserved' => [],
                'ideas_purchased' => [],
                'followedLists' => [],
                'brandNotes' => (object) [],
                'guestAccessGranted' => false,
            ]);
        }

        $ideas = $this->ideaRepository->getIdeasByStatus($id, ['available', 'reserved', 'purchased']);
        $ideas_available = $this->ideaRepository->getIdeasByStatus($id, ['available']);
        $ideas_reserved = $this->ideaRepository->getUnavailableIdeasByStatus($id, 'reserved');
        $ideas_purchased = $this->ideaRepository->getUnavailableIdeasByStatus($id, 'purchased');

        // Get lists followed by auth user
        $followedLists = Auth::check() ? FollowedList::where('user_id', Auth::id())->get() : collect();

        // Brand notes belong to the list owner and apply to all their lists. Cast so an empty map is sent as {}, not [].
        $brandNotes = (object) BrandNote::where('user_id', $list->user_id)->pluck('content', 'brand')->all();

        // Long absence reminders are only pulled where they are displayed: the owner's shared lists.
        // The archive one waits for a list with something to archive.
        $isOwnSharedList = $isOwner && ! $list->isPrivate;
        $hasSomethingToArchive = $ideas_reserved->isNotEmpty() || $ideas_purchased->isNotEmpty();
        $canArchive = $isOwnSharedList && $hasSomethingToArchive;
        $showArchiveReminder = $canArchive && session()->pull('archive_reminder_pending', false);
        $resetMutedReminders = $isOwnSharedList && session()->pull('few_ideas_reset_pending', false);

        $followers = $isOwnSharedList ? $this->giftListRepository->getFollowers($list) : [];

        return Inertia::render('GiftList/Show', [
            'list' => $list,
            'ideas' => $ideas,
            'ideas_available' => $ideas_available,
            'ideas_reserved' => $ideas_reserved,
            'ideas_purchased' => $ideas_purchased,
            'followedLists' => $followedLists,
            'brandNotes' => $brandNotes,
            'guestAccessGranted' => $isGuestWithAccess,
            'canArchive' => $canArchive,
            'showArchiveReminder' => $showArchiveReminder,
            'resetMutedReminders' => $resetMutedReminders,
            'followers' => $followers,
        ]);
    }

    /**
     * Display a listing of the gift lists.
     */
    public function index(): Response
    {
        // Get PUBLIC lists CREATED by auth user
        $mySharedLists = $this->giftListService->getFormattedUserLists(false);

        // Get PRIVATE lists CREATED by auth user
        $myPrivateLists = $this->giftListService->getFormattedUserLists(true);

        // Get lists FOLLOWED by auth user
        $followedLists = $this->giftListService->getFollowedLists();

        return Inertia::render('GiftList/Index', [
            'mySharedLists' => $mySharedLists,
            'myPrivateLists' => $myPrivateLists,
            'followedLists' => $followedLists,
        ]);
    }

    /**
     * Search for the specified resource in storage.
     */
    public function search(Request $request): JsonResponse
    {
        $key = trim($request->get('search'));

        $followedListIds = $this->giftListRepository->getFollowedListsIds();

        $listsToFollow = GiftList::query()
            ->where('user_id', '!=', Auth::id())
            ->where('isPrivate', 0)
            ->whereNotIn('gift_lists.id', $followedListIds)
            ->join('users', 'gift_lists.user_id', '=', 'users.id')
            ->where(function ($query) use ($key) {
                $keywords = explode(' ', $key);
                foreach ($keywords as $word) {
                    $query->orWhere('users.name', 'like', "%{$word}%")
                        ->orWhere('users.last_name', 'like', "%{$word}%")
                        ->orWhere('gift_lists.name', 'like', "%{$word}%");
                }
            })
            ->select('gift_lists.*')
            ->latest()
            ->get();

        $listsToFollow = $this->giftListService->formatEachLists($listsToFollow);

        if ($listsToFollow->isEmpty()) {
            return response()->json(['errorMessage' => 'Oops, aucun résultat ne correspond à ta recherche... Essaie un autre nom !'], 404);
        }

        return response()->json(['listsToFollow' => $listsToFollow]);
    }

    /**
     * Display a listing of the gift lists TO FOLLOW.
     */
    public function listsToFollow(): Response
    {
        $listsToFollow = $this->giftListService->getListsToFollow();

        return Inertia::render('GiftList/ListsToFollow', [
            'listsToFollow' => $listsToFollow,
        ]);
    }

    /**
     * Display a listing of the FOLLOWED gift lists.
     */
    public function followedLists(): Response
    {
        $followedLists = $this->giftListService->getFollowedLists();

        return Inertia::render('GiftList/FollowedLists', [
            'followedLists' => $followedLists,
        ]);
    }

    /**
     * Display a listing of the auth user's gift lists.
     */
    public function authLists(): Response
    {
        $privateLists = $this->giftListService->getFormattedUserLists(true);

        $publicLists = $this->giftListService->getFormattedUserLists(false);

        return Inertia::render('GiftList/AuthLists', [
            'publicLists' => $publicLists,
            'privateLists' => $privateLists,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('GiftList/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $string = 'required|string|max:255';

        $rules = [
            'user_name' => $string,
            'name' => $string,
            'isPrivate' => 'required|boolean',
            'private_code' => 'required|string|max:65535',
        ];

        $validated = $request->validate($rules);

        $validated['private_code'] = Crypt::encrypt($validated['private_code']);

        $request->user()->gift_lists()->create($validated);

        return redirect(route('lists.authLists'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GiftList $list): RedirectResponse
    {
        // Only the auth user can update the list
        $this->authorize('update', $list);

        $string = 'nullable|string|max:255';

        $validated = $request->validate([
            'user_name' => $string,
            'name' => $string,
            'isPrivate' => 'boolean',
            // A list turning shared needs a real code to hand out to relatives
            'private_code' => 'required_if:isPrivate,false|string|max:65535',
        ]);

        if (isset($validated['private_code'])) {
            $validated['private_code'] = Crypt::encrypt($validated['private_code']);
        }

        $list->update($validated);

        // return redirect(route('lists.authLists'));
        return redirect()->route('lists.show', $list->id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function archive(GiftList $list): RedirectResponse
    {
        $this->authorize('update', $list);

        Idea::where('list_id', $list->id)
            ->where(fn ($query) => $query
                ->whereIn('status', ['reserved', 'purchased'])
                ->orWhere(fn ($query) => $query->where('is_multiple', true)->has('multipleIdeas')))
            ->update(['status' => 'archived']);

        return redirect(route('lists.show', $list->id));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GiftList $list): RedirectResponse
    {
        //Only the auth user can delete the list
        $this->authorize('delete', $list);

        $list->delete();

        return redirect(route('lists.authLists'));
    }

    /**
     * Follow a list
     */
    public function followList(Request $request, GiftList $list): RedirectResponse
    {
        abort_if($list->isPrivate, 404);

        $privateCode = (string) $request->input('private_code');

        if ($this->isCorrectPrivateCode($list, $privateCode)) {
            $user = $request->user();
            $followedList = $user->followed_lists()->createOrFirst(
                ['gift_list_id' => $list->id],
                ['private_code' => Crypt::encrypt($privateCode)],
            );

            // Notify only on a new follow, so that a resubmitted form does not notify the owner twice.
            if ($followedList->wasRecentlyCreated) {
                $list->user->notify(new NotifyListFollowed($user->name, $list->name));
            }

            return redirect(route('lists.followedLists'));

        } else {
            return redirect()->back()->withErrors(
                ['private_code' => 'Ce code est incorrect pour la liste demandée.']
            );
        }
    }

    /**
     * Remove someone from the followers of a list. Their reservations and purchases are kept.
     */
    public function removeFollower(GiftList $list, User $follower): RedirectResponse
    {
        $this->authorize('update', $list);

        $list->followers()->detach($follower->id);

        return redirect()->route('lists.show', $list->id);
    }

    /**
     * Grant a signed-out guest access to a list,
     * once they have provided its private code.
     */
    public function guestAccess(Request $request, GiftList $list): RedirectResponse
    {
        abort_if($list->isPrivate, 404);

        $validated = $request->validate([
            'private_code' => 'required|string',
        ]);

        if ($this->isCorrectPrivateCode($list, $validated['private_code'])) {
            GuestListAccess::grant($list);

            return redirect()->route('lists.show', $list->id);
        }

        return redirect()->back()->withErrors(
            ['private_code' => 'Ce code est incorrect pour la liste demandée.']
        );
    }

    /**
     * Compare a submitted code to the list's private code, case- and whitespace-insensitively.
     */
    private function isCorrectPrivateCode(GiftList $list, string $submittedCode): bool
    {
        $decryptedCorrectPrivateCode = GiftList::decryptPrivateCode($list->private_code);

        return strcasecmp(trim($submittedCode), trim($decryptedCorrectPrivateCode)) === 0;
    }
}
