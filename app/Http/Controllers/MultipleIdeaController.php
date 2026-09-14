<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AuthorizesListAccess;
use App\Models\Idea;
use App\Models\MultipleIdea;
use App\Repositories\IdeaRepository;
use App\Support\GuestIdentity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MultipleIdeaController extends Controller
{
    use AuthorizesListAccess;

    protected $ideaRepository;

    public function __construct(IdeaRepository $ideaRepository)
    {
        $this->ideaRepository = $ideaRepository;
    }

    /**
     * Reserve a multiple idea.
     */
    public function reserveMultipleIdea(Request $request, $ideaId): RedirectResponse
    {
        $idea = Idea::findOrFail($ideaId);
        $this->authorizeListAccess($idea->list_id);

        MultipleIdea::create([
            'idea_id' => $idea->id,
            'status_user' => $request->get('userName'),
            'status_user_id' => Auth::id(),
            'status_guest_token' => GuestIdentity::current(),
            'status' => 'reserved',
            'choice' => $request->get('choice'),
        ]);

        return back();
    }

    /**
     * Purchase a multiple idea.
     */
    public function purchaseMultipleIdea(Request $request, $ideaId): RedirectResponse
    {
        $multipleIdea = MultipleIdea::find($ideaId);
        $choice = $request->get('choice');

        if ($multipleIdea) {
            $this->authorizeListAccess($multipleIdea->idea->list_id);

            // Confirming the purchase of an idea already reserved by someone is only theirs to do.
            $this->authorizeStatusOwner($multipleIdea);

            $this->ideaRepository->updateMultipleIdea($multipleIdea, 'purchased', $choice);

            return back();
        } else {
            $idea = Idea::findOrFail($ideaId);
            $this->authorizeListAccess($idea->list_id);

            MultipleIdea::create([
                'idea_id' => $idea->id,
                'status_user' => $request->get('userName'),
                'status_user_id' => Auth::id(),
                'status_guest_token' => GuestIdentity::current(),
                'status' => 'purchased',
                'choice' => $choice,
            ]);

            return back();
        }
    }

    /**
     * Cancel reservation or purchase of a multiple idea.
     */
    public function cancelMultipleIdea(Request $request, $ideaId): RedirectResponse
    {
        $multipleIdea = MultipleIdea::findOrFail($ideaId);
        $this->authorizeListAccess($multipleIdea->idea->list_id);
        $this->authorizeStatusOwner($multipleIdea);

        $multipleIdea->delete();

        return back();
    }
}
