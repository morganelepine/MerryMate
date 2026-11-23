<?php

namespace App\Repositories;

use App\Models\GiftList;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GiftListRepository
{
    public function getUserLists(bool $isPrivate)
    {
        return GiftList::where('user_id', Auth::id())
            ->where('isPrivate', $isPrivate)
            ->latest()
            ->get();
    }

    public function getFollowedListsIds()
    {
        return Auth::user()->followedLists()->pluck('gift_lists.id')->all();
    }

    public function getFollowers(GiftList $list)
    {
        // Identity only: the pivot carries the private code, which must not reach the front.
        return $list->followers()
            ->orderBy('users.name')
            ->orderBy('users.last_name')
            ->get(['users.id', 'users.name', 'users.last_name'])
            ->map(fn (User $follower) => $follower->only('id', 'name', 'last_name'));
    }

    public function getListsToFollow()
    {
        $followedListIds = $this->getFollowedListsIds();
        return GiftList::whereNot('user_id', Auth::id())
            ->where('isPrivate', 0)
            ->whereNotIn('id', $followedListIds)
            ->latest()
            ->get();
    }
}
