<?php

namespace Tests;

use App\Models\GiftList;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Creates a user and a gift list owned by that user.
     *
     * @param array $listOverrides The attributes to override for the gift list.
     * @return array{0: User, 1: GiftList}
     */
    protected function createGiftListWithOwner(array $listOverrides = []): array
    {
        $owner = User::factory()->create();

        $giftList = GiftList::factory()->create(array_merge([
            'user_id' => $owner->id,
            'user_name' => $owner->name,
        ], $listOverrides));

        return [$owner, $giftList];
    }
}
