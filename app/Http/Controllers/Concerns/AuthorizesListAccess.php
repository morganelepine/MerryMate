<?php

namespace App\Http\Controllers\Concerns;

use App\Models\FollowedList;
use App\Models\GiftList;
use App\Models\Idea;
use App\Models\MultipleIdea;
use App\Support\GuestIdentity;
use Illuminate\Support\Facades\Auth;

trait AuthorizesListAccess
{
    /**
     * Ensure the current visitor can act on list $listId:
     * either an authenticated owner/follower of it,
     * or a guest who has unlocked it with its private code.
     */
    protected function authorizeListAccess(int $listId): void
    {
        $userId = Auth::id();
        $hasAuthenticatedAccess = $userId !== null && (
            GiftList::where('id', $listId)->where('user_id', $userId)->exists()
            || FollowedList::where('user_id', $userId)->where('gift_list_id', $listId)->exists()
        );

        $hasGuestAccess = session()->get("guest_access.{$listId}", false);

        abort_unless($hasAuthenticatedAccess || $hasGuestAccess, 403);
    }

    /**
     * Ensure the current visitor is the one who reserved/purchased $reservable.
     */
    protected function authorizeStatusOwner(Idea|MultipleIdea $reservable): void
    {
        abort_unless(GuestIdentity::owns($reservable), 403);
    }
}
