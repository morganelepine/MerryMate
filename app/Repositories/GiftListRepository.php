<?php

namespace App\Repositories;

use App\Models\GiftList;
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
