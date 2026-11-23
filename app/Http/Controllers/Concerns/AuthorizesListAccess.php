<?php

namespace App\Http\Controllers\Concerns;

use App\Models\FollowedList;
use App\Models\GiftList;
use App\Models\Idea;
use App\Models\MultipleIdea;
use App\Support\GuestIdentity;
use App\Support\GuestListAccess;
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
        $list = GiftList::findOrFail($listId);
        $userId = Auth::id();

        if ($userId !== null && $userId === $list->user_id) {
            return;
        }

        // The guest cookie is ignored once signed in, or a removed follower could still act through it.
        $hasAccess = $userId !== null
            ? FollowedList::where('user_id', $userId)->where('gift_list_id', $list->id)->exists()
            : GuestListAccess::has($list);

        abort_if($list->isPrivate || ! $hasAccess, 403);
    }

    /**
     * Ensure the current visitor is the one who reserved/purchased $reservable.
     */
    protected function authorizeStatusOwner(Idea|MultipleIdea $reservable): void
    {
        abort_unless(GuestIdentity::owns($reservable), 403);
    }

    /**
     * Ensure the current visitor is signed in.
     * Reserving an idea is restricted to authenticated users.
     */
    protected function authorizeAuthenticated(): void
    {
        abort_unless(Auth::check(), 403);
    }
}
