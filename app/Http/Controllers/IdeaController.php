<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use App\Models\MultipleIdea;
use App\Models\GiftList;
use App\Models\FollowedList;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Repositories\IdeaRepository;

class IdeaController extends Controller
{
    protected $ideaRepository;

    public function __construct(IdeaRepository $ideaRepository)
    {
        $this->ideaRepository = $ideaRepository;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, $id): Response
    {
        // Get list id from url
        $list = GiftList::find($id);

        return Inertia::render('Ideas/Create', [
            'list' => $list,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $string = 'nullable|string|max:255';

        $validated = $request->validate([
            'list_id' => 'required|integer',
            'user_name' => 'required|string|max:255',
            'idea' => 'required_without:link|nullable|string|max:550',
            'brand' => $string,
            'link' => 'required_without:idea|nullable|string|max:255',
            'details' => $string,
            'price' => 'nullable|integer',
            'favorite' => 'boolean',
            'is_multiple' => 'boolean',
            'promo' => 'boolean',
            'promo_details' => $string,
            'membership' => $string,
            'membership_reduction' => $string,
            'status' => $string,
            'status_user' => $string,
            'status_user_id' => 'nullable|integer',
        ]);

        $request->user()->ideas()->create($validated);

        return redirect()->route('lists.show', ['list' => $validated['list_id']]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Idea $idea): RedirectResponse
    {
        $this->authorize('update', $idea);

        $string = 'nullable|string|max:255';

        $validated = $request->validate([
            'idea' => $string,
            'brand' => $string,
            'link' => 'nullable|string|max:550',
            'details' => $string,
            'price' => 'nullable|integer',
            'favorite' => 'boolean',
            'is_multiple' => 'boolean',
            'promo' => 'boolean',
            'promo_details' => $string,
            'membership' => $string,
            'membership_reduction' => $string,
            'status' => $string,
            'status_user' => $string,
            'status_user_id' => 'nullable|integer',
        ]);

        $idea->update($validated);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Idea $idea): RedirectResponse
    {
        // Check if idea is already reserved or purchased and not archived
        $isReserved = Idea::where('id', $idea->id)->where('status', 'reserved')->exists();
        $isReservedMultiple = MultipleIdea::where('idea_id', $idea->id)->where('status', 'reserved')->exists();
        $isPurchased = Idea::where('id', $idea->id)->where('status', 'purchased')->exists();
        $isPurchasedMultiple = MultipleIdea::where('idea_id', $idea->id)->where('status', 'purchased')->exists();

        // Only the auth user can delete the idea
        $this->authorize('delete', $idea);

        if ($isReserved || $isReservedMultiple|| $isPurchased || $isPurchasedMultiple) {
            return redirect()->back()->withErrors(['error' => 'Oops, cette idée a déjà été réservée ou achetée...']);
        } else {
            $idea->delete();
            return back();
        }
    }

    /**
     * Reserve an idea.
     */
    public function reserveIdea(Request $request, $ideaId): RedirectResponse
    {
        $this->authorizeListAccess($ideaId);
        $this->ideaRepository->updateIdeaStatus($ideaId, 'reserved', $request->get('userName'));
        return back();
    }

    /**
     * Purchase an idea.
     */
    public function purchaseIdea(Request $request, $ideaId): RedirectResponse
    {
        $this->authorizeListAccess($ideaId);
        $this->ideaRepository->updateIdeaStatus($ideaId, 'purchased', $request->get('userName'));
        return back();
    }

    /**
     * Cancel reservation or purchase of an idea.
     */
    public function cancelReservationOrPurchase(Request $request, $ideaId): RedirectResponse
    {
        $this->authorizeListAccess($ideaId);
        $this->ideaRepository->updateIdeaStatus($ideaId, 'available', '');
        return back();
    }

    private function authorizeListAccess(int $ideaId): void
    {
        $multipleIdea = MultipleIdea::find($ideaId);
        $listId = $multipleIdea
            ? $multipleIdea->idea->list_id
            : optional(Idea::find($ideaId))->list_id;

        abort_unless($listId !== null, 404);

        $userId = Auth::id();
        $hasAccess = GiftList::where('id', $listId)->where('user_id', $userId)->exists()
            || FollowedList::where('user_id', $userId)->where('gift_list_id', $listId)->exists();

        abort_unless($hasAccess, 403);
    }
}
