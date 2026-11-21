<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Idea;
use App\Models\MultipleIdea;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'profile' => $request->user()->only('name', 'last_name', 'email', 'email_verified_at'),
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Display the user's purchases.
     */
    public function purchase(): Response
    {
        // Reservations count too: buyers often never confirm them once the gift is bought.
        $ideas = Idea::where('status_user_id', Auth::id())->get()->map(fn (Idea $idea) => [
            ...$idea->toArray(),
            'key' => "idea-{$idea->id}",
        ]);

        // Each reservation or purchase of a multiple idea is its own row, shaped like an idea.
        $multiplePurchases = MultipleIdea::with('idea')
            ->where('status_user_id', Auth::id())
            ->get()
            ->map(fn (MultipleIdea $purchase) => [
                ...$purchase->idea->only(['idea', 'brand', 'details', 'link', 'price', 'user_name']),
                'key' => "multiple-{$purchase->id}",
                'status' => $purchase->status,
                'choice' => $purchase->choice,
                'paid_price' => $purchase->paid_price,
            ]);

        $ideas = $ideas->concat($multiplePurchases)->values();
        $totalPrice = round($ideas->sum(fn (array $idea) => $idea['paid_price'] ?? $idea['price']), 2);

        return Inertia::render('Profile/Budget', [
            'ideas' => $ideas,
            'totalPrice' => $totalPrice
        ]);
    }

    /**
     * Display the gifts received by the user.
     */
    public function gifts(): Response
    {
        $ideas = Idea::where('user_id', Auth::id())->where('status', 'archived')->orderByDesc('updated_at')->get();

        return Inertia::render('Profile/Gifts', [
            'ideas' => $ideas,
        ]);
    }

    /**
     * Display the user's notifications.
     */
    public function notifications(): Response
    {
        return Inertia::render('Profile/Notifications');
    }
}
