<?php

namespace App\Services;

use App\Models\GiftList;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use App\Repositories\GiftListRepository;

class GiftListService
{
    protected $giftListRepository;

    public function __construct(GiftListRepository $giftListRepository)
    {
        $this->giftListRepository = $giftListRepository;
    }

    /**
     * Shape lists for the list cards, sending only the fields the front uses.
     * Owner and idea stats are loaded in 3 queries total, whatever the number of lists.
     */
    public function formatEachLists(Collection $lists, bool $withPrivateCode = false, string $dateFormat = 'd/m/Y')
    {
        $lists->load('user:id,last_name')
            ->loadCount('ideas')
            ->loadMax('ideas', 'created_at');

        return $lists
            ->sortByDesc('ideas_max_created_at')
            ->values()
            ->map(fn (GiftList $list) => [
                'id' => $list->id,
                'user_id' => $list->user_id,
                'user_name' => $list->user_name,
                'user_lastname' => $list->user?->last_name,
                'name' => $list->name,
                'isPrivate' => $list->isPrivate,
                'isEmpty' => $list->ideas_count === 0,
                'formatted_created_at' => Carbon::parse($list->created_at)->format($dateFormat),
                'formatted_updated_at' => Carbon::parse($list->ideas_max_created_at)->format($dateFormat),
                ...($withPrivateCode ? ['private_code' => GiftList::decryptPrivateCode($list->private_code)] : []),
            ]);
    }

    public function getFormattedUserLists(bool $isPrivate)
    {
        return $this->formatEachLists($this->giftListRepository->getUserLists($isPrivate), true);
    }

    public function getFollowedLists()
    {
        return $this->formatEachLists(Auth::user()->followedLists()->where('isPrivate', false)->get());
    }

    public function getListsToFollow()
    {
        return $this->formatEachLists($this->giftListRepository->getListsToFollow());
    }
}
