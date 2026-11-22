<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AuthorizesListAccess;
use App\Models\Idea;
use App\Models\MultipleIdea;
use App\Support\BudgetOccasion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Lets buyers correct the occasion guessed for their MerryMate purchases.
 */
class BudgetOccasionController extends Controller
{
    use AuthorizesListAccess;

    public function updateIdea(Request $request, Idea $idea): RedirectResponse
    {
        return $this->updateOccasion($request, $idea);
    }

    public function updateMultipleIdea(Request $request, MultipleIdea $multipleIdea): RedirectResponse
    {
        return $this->updateOccasion($request, $multipleIdea);
    }

    private function updateOccasion(Request $request, Idea|MultipleIdea $purchase): RedirectResponse
    {
        $this->authorizeStatusOwner($purchase);

        $validated = $request->validate([
            'occasion' => ['required', Rule::in(BudgetOccasion::VALUES)],
        ]);

        $purchase->budget_occasion = $validated['occasion'];
        $purchase->save();

        return back();
    }
}
