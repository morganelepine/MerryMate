<?php

namespace App\Http\Controllers;

use App\Models\FollowedList;
use App\Models\GiftList;
use App\Models\Idea;
use App\Models\User;
use App\Notifications\NotifyListFollowed;
use App\Repositories\GiftListRepository;
use App\Repositories\IdeaRepository;
use App\Services\GiftListService;
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
     */
    public function show(Request $request, $id): Response
    {
        // Get list id from url
        $list = GiftList::find($id);
        abort_unless($list, 404);

        $isOwner = Auth::check() && Auth::id() === $list->user_id;
        $isFollower = Auth::check()
            && FollowedList::where('user_id', Auth::id())->where('gift_list_id', $list->id)->exists();
        $isGuestWithAccess = ! Auth::check() && $this->hasGuestAccess($list->id);
        $hasAccess = $isOwner || $isFollower || $isGuestWithAccess;

        if ($hasAccess) {
            $user = User::find($list->user_id);
            $list->user_lastname = $user ? $user->last_name : null;
        }

        if ($isOwner) {
            // The owner may need the plaintext code (e.g. for the share button)
            $list->private_code = $this->decryptPrivateCode($list->private_code);
        } else {
            // Nobody else should ever receive the (even encrypted) private code
            $list->makeHidden('private_code');
        }

        if (! $hasAccess) {
            return Inertia::render('GiftList/Show', [
                'list' => $list,
                'ideas' => [],
                'ideas_available' => [],
                'ideas_reserved' => [],
                'ideas_purchased' => [],
                'followedLists' => [],
                'guestAccessGranted' => false,
            ]);
        }

        $ideas = $this->ideaRepository->getIdeasByStatus($id, ['available', 'reserved', 'purchased']);
        $ideas_available = $this->ideaRepository->getIdeasByStatus($id, ['available']);
        $ideas_reserved = $this->ideaRepository->getUnavailableIdeasByStatus($id, 'reserved');
        $ideas_purchased = $this->ideaRepository->getUnavailableIdeasByStatus($id, 'purchased');

        // Get lists followed by auth user
        $followedLists = Auth::check() ? FollowedList::where('user_id', Auth::id())->get() : collect();

        return Inertia::render('GiftList/Show', [
            'list' => $list,
            'ideas' => $ideas,
            'ideas_available' => $ideas_available,
            'ideas_reserved' => $ideas_reserved,
            'ideas_purchased' => $ideas_purchased,
            'followedLists' => $followedLists,
            'guestAccessGranted' => $isGuestWithAccess,
        ]);
    }

    /**
     * Display a listing of the gift lists.
     */
    public function index(): Response
    {
        // Get all users except auth user
        $users = User::where('id', '!=', Auth::id())->get();

        // Get PUBLIC lists CREATED by auth user
        $mySharedLists = $this->giftListService->getFormattedUserLists(false);

        // Get PRIVATE lists CREATED by auth user
        $myPrivateLists = $this->giftListService->getFormattedUserLists(true);

        // Get lists FOLLOWED by auth user
        $followedLists = $this->giftListService->getFollowedLists();

        return Inertia::render('GiftList/Index', [
            'users' => $users,
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
            return response()->json(['errorMessage' => 'Oops, aucun résultat ne correspond à votre recherche... Essayez un autre nom !'], 404);
        }

        return response()->json(['listsToFollow' => $listsToFollow]);
    }

    /**
     * Display a listing of the gift lists TO FOLLOW.
     */
    public function listsToFollow(): Response
    {
        $listsToFollow = $this->giftListRepository->getListsToFollow();

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
        foreach ($publicLists as &$publicList) {
            if (strlen($publicList['private_code']) > 20) {
                $publicList['private_code'] = Crypt::decrypt($publicList['private_code']);
            }
        }

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
            'private_code' => 'string|max:65535',
        ]);

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

        Idea::where('list_id', $list->id)->where('status', 'reserved')->update(['status' => 'archived']);
        Idea::where('list_id', $list->id)->where('status', 'purchased')->update(['status' => 'archived']);

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
        $privateCode = (string) $request->input('private_code');

        if ($this->isCorrectPrivateCode($list, $privateCode)) {
            $user = $request->user();
            $validated = $request->validate([
                'user_id' => 'required|integer',
                'gift_list_id' => 'required|integer',
                'private_code' => 'required|string',
            ]);
            $validated['private_code'] = Crypt::encrypt($validated['private_code']);
            $user->followed_lists()->create($validated);

            // Search for user whose list has been followed and notify her⸱him
            $giftList = GiftList::find($validated['gift_list_id']);
            $listOwner = $giftList->user;
            $listOwner->notify(new NotifyListFollowed($user->name, $giftList->name));

            return redirect(route('lists.followedLists'));

        } else {
            return redirect()->back()->withErrors(
                ['private_code' => 'Ce code est incorrect pour la liste demandée.']
            );
        }
    }

    /**
     * Grant a signed-out guest access to a list for this browser session,
     * once they have provided its private code.
     */
    public function guestAccess(Request $request, GiftList $list): RedirectResponse
    {
        $validated = $request->validate([
            'private_code' => 'required|string',
        ]);

        if ($this->isCorrectPrivateCode($list, $validated['private_code'])) {
            $request->session()->put("guest_access.{$list->id}", true);

            return redirect()->route('lists.show', $list->id);
        }

        return redirect()->back()->withErrors(
            ['private_code' => 'Ce code est incorrect pour la liste demandée.']
        );
    }

    /**
     * Whether a signed-out guest has already unlocked this list
     * in the current browser session.
     */
    private function hasGuestAccess(int $listId): bool
    {
        return (bool) session()->get("guest_access.{$listId}", false);
    }

    /**
     * Decrypt a list's private code, accounting for legacy plaintext codes.
     */
    private function decryptPrivateCode(string $privateCode): string
    {
        return strlen($privateCode) > 20 ? Crypt::decrypt($privateCode) : $privateCode;
    }

    /**
     * Compare a submitted code to the list's private code, case- and whitespace-insensitively.
     */
    private function isCorrectPrivateCode(GiftList $list, string $submittedCode): bool
    {
        $decryptedCorrectPrivateCode = $this->decryptPrivateCode($list->private_code);

        return strcasecmp(trim($submittedCode), trim($decryptedCorrectPrivateCode)) === 0;
    }
}
