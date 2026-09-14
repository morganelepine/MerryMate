<?php

namespace Tests\Feature;

use App\Models\FollowedList;
use App\Models\GiftList;
use App\Models\Idea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IdeaTest extends TestCase
{
    use RefreshDatabase;

    private const DEFAULT_GUEST_NAME = 'Anonyme';

    public function test_idea_can_be_deleted(): void
    {
        $user = User::factory()->create();
        $giftList = GiftList::factory()->create([
            'user_id' => $user->id,
            'user_name' => $user->name,
        ]);
        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $user->id,
            'user_name' => $user->name,
        ]);

        $response = $this
            ->actingAs($user)
            ->delete("/ideas/{$idea->id}");

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertNull($idea->fresh());
    }

    public function test_guest_can_reserve_idea_after_unlocking_list_with_private_code(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner([
            'private_code' => '1234',
            'isPrivate' => false,
        ]);
        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'status' => 'available',
            'status_user' => '',
            'status_user_id' => null,
        ]);

        $this->post("/lists/{$giftList->id}/guest-access", ['private_code' => '1234']);

        $response = $this->patch("/ideas/{$idea->id}/reserve", ['userName' => self::DEFAULT_GUEST_NAME]);

        $response->assertSessionHasNoErrors()->assertRedirect();

        $idea->refresh();
        $this->assertEquals('reserved', $idea->status);
        $this->assertEquals(self::DEFAULT_GUEST_NAME, $idea->status_user);
        $this->assertNull($idea->status_user_id);
    }

    public function test_guest_cannot_reserve_idea_without_unlocking_list(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner([
            'private_code' => '1234',
            'isPrivate' => false,
        ]);
        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'status' => 'available',
            'status_user' => '',
            'status_user_id' => null,
        ]);

        $response = $this->patch("/ideas/{$idea->id}/reserve", ['userName' => self::DEFAULT_GUEST_NAME]);

        $response->assertForbidden();

        $idea->refresh();
        $this->assertEquals('available', $idea->status);
    }

    public function test_only_the_reserver_can_cancel_their_reservation(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner([
            'private_code' => '1234',
            'isPrivate' => false,
        ]);
        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'status' => 'available',
            'status_user' => '',
            'status_user_id' => null,
        ]);

        $reserver = User::factory()->create();
        $otherFollower = User::factory()->create();

        foreach ([$reserver, $otherFollower] as $follower) {
            FollowedList::create([
                'user_id' => $follower->id,
                'gift_list_id' => $giftList->id,
                'private_code' => '1234',
            ]);
        }

        $this->actingAs($reserver)->patch("/ideas/{$idea->id}/reserve", ['userName' => $reserver->name]);

        // Another follower, with access to the list but not to this reservation,
        // must not be able to cancel it.
        $response = $this->actingAs($otherFollower)->patch("/ideas/{$idea->id}/cancel");

        $response->assertForbidden();
        $idea->refresh();
        $this->assertEquals('reserved', $idea->status);

        // The reserver themselves can.
        $response = $this->actingAs($reserver)->patch("/ideas/{$idea->id}/cancel");

        $response->assertSessionHasNoErrors()->assertRedirect();
        $idea->refresh();
        $this->assertEquals('available', $idea->status);
        $this->assertNull($idea->status_user_id);
    }

    public function test_a_different_guest_cannot_cancel_someone_elses_reservation(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner([
            'private_code' => '1234',
            'isPrivate' => false,
        ]);
        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'status' => 'available',
            'status_user' => '',
            'status_user_id' => null,
        ]);

        $this->post("/lists/{$giftList->id}/guest-access", ['private_code' => '1234']);
        $this->patch("/ideas/{$idea->id}/reserve", ['userName' => self::DEFAULT_GUEST_NAME]);

        // A different guest, who also unlocked the list but made no reservation of their own,
        // must not be able to cancel this one.
        $response = $this->withSession([
            "guest_access.{$giftList->id}" => true,
            'guest_identity' => 'a-different-guest-token',
        ])->patch("/ideas/{$idea->id}/cancel");

        $response->assertForbidden();
        $idea->refresh();
        $this->assertEquals('reserved', $idea->status);
    }
}
