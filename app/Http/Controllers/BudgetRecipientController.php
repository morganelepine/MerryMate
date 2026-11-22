<?php

namespace App\Http\Controllers;

use App\Models\BudgetRecipient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class BudgetRecipientController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->user()->budgetRecipients()->create($this->validated($request));

        return back();
    }

    public function update(Request $request, BudgetRecipient $budgetRecipient): RedirectResponse
    {
        abort_unless($budgetRecipient->user_id === Auth::id(), 403);

        $budgetRecipient->update($this->validated($request, $budgetRecipient));

        return back();
    }

    /**
     * Also deletes their gifts of every year.
     */
    public function destroy(BudgetRecipient $budgetRecipient): RedirectResponse
    {
        abort_unless($budgetRecipient->user_id === Auth::id(), 403);

        $budgetRecipient->delete();

        return back();
    }

    private function validated(Request $request, ?BudgetRecipient $recipient = null): array
    {
        $request->merge(['name' => trim((string) $request->input('name'))]);

        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('budget_recipients')
                    ->where('user_id', Auth::id())
                    ->ignore($recipient),
            ],
        ], [
            // The generic message reads "Cet name existe déjà".
            'name.unique' => 'Cette personne est déjà dans ton budget.',
        ]);
    }
}
