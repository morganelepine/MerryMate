<?php

namespace App\Http\Controllers;

use App\Models\BudgetGift;
use App\Models\BudgetRecipient;
use App\Support\BudgetOccasion;
use App\Support\Price;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class BudgetGiftController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        Price::normalize($request);

        $validated = $request->validate([
            'budget_recipient_id' => [
                'required',
                'integer',
                Rule::exists('budget_recipients', 'id')->where('user_id', Auth::id()),
            ],
            'year' => 'required|integer|between:2000,2100',
            ...$this->giftRules(),
        ]);

        BudgetGift::create($validated);

        return back();
    }

    public function update(Request $request, BudgetGift $budgetGift): RedirectResponse
    {
        $this->authorizeOwner($budgetGift);
        Price::normalize($request);

        $budgetGift->update($request->validate($this->giftRules()));

        return back();
    }

    public function toggleStatus(BudgetGift $budgetGift): RedirectResponse
    {
        $this->authorizeOwner($budgetGift);

        $budgetGift->update([
            'status' => $budgetGift->status === 'purchased' ? 'idea' : 'purchased',
        ]);

        return back();
    }

    public function destroy(BudgetGift $budgetGift): RedirectResponse
    {
        $this->authorizeOwner($budgetGift);

        $budgetGift->delete();

        return back();
    }

    private function giftRules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'price' => Price::RULE,
            'status' => ['required', Rule::in(BudgetGift::STATUSES)],
            'occasion' => ['required', Rule::in(BudgetOccasion::VALUES)],
        ];
    }

    private function authorizeOwner(BudgetGift $gift): void
    {
        abort_unless(
            BudgetRecipient::whereKey($gift->budget_recipient_id)->where('user_id', Auth::id())->exists(),
            403,
        );
    }
}
