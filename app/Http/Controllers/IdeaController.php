<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AuthorizesListAccess;
use App\Models\GiftList;
use App\Models\Idea;
use App\Repositories\IdeaRepository;
use App\Support\Price;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IdeaController extends Controller
{
    use AuthorizesListAccess;

    private const PROMO_RULES = [
        'promo_price' => Price::RULE,
        'promo_end_date' => 'nullable|date_format:Y-m-d',
    ];

    protected $ideaRepository;

    public function __construct(IdeaRepository $ideaRepository)
    {
        $this->ideaRepository = $ideaRepository;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(GiftList $list): Response
    {
        $this->authorize('update', $list);

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
        Price::normalize($request, ['price', 'promo_price']);

        $validated = $request->validate([
            'list_id' => 'required|integer',
            'user_name' => 'required|string|max:255',
            'idea' => 'required_without:link|nullable|string|max:550',
            'brand' => $string,
            'link' => 'required_without:idea|nullable|string|max:255',
            'details' => $string,
            'price' => Price::RULE,
            'favorite' => 'boolean',
            'is_multiple' => 'boolean',
            'promo' => 'boolean',
            ...self::PROMO_RULES,
        ]);

        $this->authorize('update', GiftList::findOrFail($validated['list_id']));

        $request->user()->ideas()->create($this->withoutStalePromo($validated));

        return redirect()->route('lists.show', ['list' => $validated['list_id']]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Idea $idea): RedirectResponse
    {
        $this->authorize('update', $idea);

        $string = 'nullable|string|max:255';
        Price::normalize($request, ['price', 'promo_price']);

        $validated = $request->validate([
            'idea' => $string,
            'brand' => $string,
            'link' => 'nullable|string|max:550',
            'details' => $string,
            'price' => Price::RULE,
            'favorite' => 'boolean',
            'is_multiple' => 'boolean',
            'promo' => 'boolean',
            ...self::PROMO_RULES,
        ]);

        $idea->update($this->withoutStalePromo($validated));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Idea $idea): RedirectResponse
    {
        $this->authorize('delete', $idea);

        $isTaken = in_array($idea->status, ['reserved', 'purchased'], true)
            || ($idea->status !== 'archived' && $idea->multipleIdeas()->exists());

        if ($isTaken) {
            return back()->withErrors(['error' => 'Oops, cette idée a déjà été réservée ou achetée...']);
        }

        $idea->delete();

        return back();
    }

    /**
     * Reserve an idea.
     */
    public function reserveIdea(Request $request, $ideaId): RedirectResponse
    {
        $this->authorizeAuthenticated();

        $idea = Idea::findOrFail($ideaId);
        $this->authorizeListAccess($idea->list_id);

        $this->ideaRepository->updateIdea($idea, 'reserved', $this->validatedUserName($request));

        return back();
    }

    /**
     * Purchase an idea.
     */
    public function purchaseIdea(Request $request, $ideaId): RedirectResponse
    {
        $idea = Idea::findOrFail($ideaId);
        $this->authorizeListAccess($idea->list_id);

        // Buying a still-available idea is open to anyone with list access,
        // but confirming the purchase of an idea already reserved by someone
        // is only theirs to do.
        if ($idea->status === 'reserved') {
            $this->authorizeStatusOwner($idea);
        }

        $this->ideaRepository->updateIdea($idea, 'purchased', $this->validatedUserName($request));

        return back();
    }

    /**
     * Cancel reservation or purchase of an idea.
     */
    public function cancelReservationOrPurchase(Request $request, $ideaId): RedirectResponse
    {
        $idea = Idea::findOrFail($ideaId);
        $this->authorizeListAccess($idea->list_id);
        $this->authorizeStatusOwner($idea);

        $this->ideaRepository->updateIdea($idea, 'available', '');

        return back();
    }

    /**
     * Unticking "promo" hides its fields in the form but still sends them: don't keep them.
     */
    private function withoutStalePromo(array $validated): array
    {
        if (array_key_exists('promo', $validated) && ! $validated['promo']) {
            $validated['promo_price'] = null;
            $validated['promo_end_date'] = null;
        }

        return $validated;
    }
}
