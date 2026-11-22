<?php

namespace Tests\Feature;

use App\Models\FollowedList;
use App\Models\GiftList;
use App\Models\Idea;
use App\Models\MultipleIdea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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

    public function test_archiving_a_list_archives_taken_multiple_ideas_like_single_ones(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $ideaDefaults = [
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'is_multiple' => true,
            'status' => 'available',
        ];
        $idea = Idea::factory()->create($ideaDefaults);
        $untouched = Idea::factory()->create($ideaDefaults);
        $multipleIdea = MultipleIdea::create([
            'idea_id' => $idea->id,
            'status_user' => 'Buyer',
            'status' => 'purchased',
        ]);

        $this->actingAs($owner)->delete("/ideas/{$idea->id}")->assertSessionHasErrors();
        $this->assertNotNull($idea->fresh());

        $this->actingAs($owner)->patch("/lists/{$giftList->id}/archive")->assertRedirect();
        $this->assertEquals('archived', $idea->fresh()->status);
        $this->assertEquals('available', $untouched->fresh()->status);
        $this->assertEquals('purchased', $multipleIdea->fresh()->status);

        $this->actingAs($owner)
            ->get('/profile/gifts')
            ->assertInertia(fn (Assert $page) => $page
                ->has('ideas', 1)
                ->where('ideas.0.key', "multiple-{$multipleIdea->id}")
                ->where('ideas.0.status_user', 'Buyer'));

        $this->actingAs($owner)->delete("/ideas/{$idea->id}")->assertSessionHasNoErrors();
        $this->assertNull($idea->fresh());
        $this->assertNull($multipleIdea->fresh());
    }

    public function test_purchasing_a_multiple_idea_never_touches_a_reservation_sharing_its_id(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'is_multiple' => true,
        ]);
        $buyer = User::factory()->create();
        FollowedList::create(['user_id' => $buyer->id, 'gift_list_id' => $giftList->id, 'private_code' => '1234']);
        // A reservation whose id equals the idea id, held by someone else.
        $reservation = MultipleIdea::forceCreate([
            'id' => $idea->id,
            'idea_id' => $idea->id,
            'status_user' => 'Someone',
            'status' => 'reserved',
        ]);

        $this->actingAs($buyer)
            ->patch("/multiple-ideas/{$idea->id}/purchase", ['userName' => $buyer->name])
            ->assertSessionHasNoErrors();

        $this->assertEquals('reserved', $reservation->fresh()->status);
        $this->assertDatabaseHas('multiple_ideas', ['idea_id' => $idea->id, 'status_user_id' => $buyer->id, 'status' => 'purchased']);
    }

    public function test_guest_can_purchase_idea_after_unlocking_list_with_private_code(): void
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

        $response = $this
            ->actingAsGuestWithAccessTo($giftList)
            ->patch("/ideas/{$idea->id}/purchase", ['userName' => self::DEFAULT_GUEST_NAME]);

        $response->assertSessionHasNoErrors()->assertRedirect();

        $idea->refresh();
        $this->assertEquals('purchased', $idea->status);
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

    public function test_guest_cannot_reserve_idea_even_with_list_access(): void
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

        $response = $this
            ->actingAsGuestWithAccessTo($giftList)
            ->patch("/ideas/{$idea->id}/reserve", ['userName' => self::DEFAULT_GUEST_NAME]);

        $response->assertForbidden();

        $idea->refresh();
        $this->assertEquals('available', $idea->status);
    }

    public function test_guest_cannot_reserve_multiple_idea_even_with_list_access(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner([
            'private_code' => '1234',
            'isPrivate' => false,
        ]);
        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'is_multiple' => true,
        ]);

        $response = $this
            ->actingAsGuestWithAccessTo($giftList)
            ->patch("/multiple-ideas/{$idea->id}/reserve", ['userName' => self::DEFAULT_GUEST_NAME]);

        $response->assertForbidden();

        $this->assertDatabaseMissing('multiple_ideas', ['idea_id' => $idea->id]);
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

    public function test_reserving_or_purchasing_requires_a_user_name(): void
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

        $follower = User::factory()->create();
        FollowedList::create([
            'user_id' => $follower->id,
            'gift_list_id' => $giftList->id,
            'private_code' => '1234',
        ]);

        // A missing name used to crash the request (500) instead of failing validation.
        foreach (['reserve', 'purchase'] as $action) {
            $this->actingAs($follower)
                ->patch("/ideas/{$idea->id}/{$action}")
                ->assertSessionHasErrors('userName');
        }

        $this->assertEquals('available', $idea->fresh()->status);
    }

    public function test_a_different_guest_cannot_cancel_someone_elses_purchase(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner([
            'private_code' => '1234',
            'isPrivate' => false,
        ]);

        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'status' => 'purchased',
            'status_user' => self::DEFAULT_GUEST_NAME,
            'status_user_id' => null,
            'status_guest_token' => 'the-original-guests-token',
        ]);

        // A different guest, who also unlocked the list but made no purchase of their own,
        // must not be able to cancel this one.
        $response = $this
            ->withCookie("list_access_{$giftList->id}", '1')
            ->withCookie('guest_identity', 'a-different-guest-token')
            ->patch("/ideas/{$idea->id}/cancel");

        $response->assertForbidden();
        $idea->refresh();
        $this->assertEquals('purchased', $idea->status);
    }

    public function test_price_accepts_decimals_typed_with_a_comma(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();

        $this->actingAs($owner)
            ->post('/ideas', [
                'list_id' => $giftList->id,
                'user_name' => $owner->name,
                'idea' => 'Puzzle',
                'price' => '34,99',
            ])
            ->assertSessionHasNoErrors();

        $idea = Idea::where('list_id', $giftList->id)->firstOrFail();
        $this->assertSame(34.99, $idea->price);

        $this->actingAs($owner)
            ->patch("/ideas/{$idea->id}", ['price' => '12.5'])
            ->assertSessionHasNoErrors();

        $this->assertSame(12.5, $idea->fresh()->price);
    }

    public function test_price_rejects_more_than_two_decimals(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();

        $this->actingAs($owner)
            ->post('/ideas', [
                'list_id' => $giftList->id,
                'user_name' => $owner->name,
                'idea' => 'Puzzle',
                'price' => '34,999',
            ])
            ->assertSessionHasErrors('price');
    }

    public function test_purchase_records_the_promo_price_only_while_the_promo_runs(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner([
            'private_code' => '1234',
            'isPrivate' => false,
        ]);
        $promo = ['price' => 40, 'promo' => true, 'promo_price' => 29.99];
        $cases = [
            [today('Europe/Paris')->toDateString(), 29.99],
            [today('Europe/Paris')->subDay()->toDateString(), 40.0],
            [null, 29.99],
        ];

        foreach ($cases as [$endDate, $expectedPaid]) {
            $idea = Idea::factory()->create([
                'list_id' => $giftList->id,
                'user_id' => $owner->id,
                'user_name' => $owner->name,
                'status' => 'available',
                'status_user' => '',
                'status_user_id' => null,
                ...$promo,
                'promo_end_date' => $endDate,
            ]);

            $this->actingAsGuestWithAccessTo($giftList)
                ->patch("/ideas/{$idea->id}/purchase", ['userName' => self::DEFAULT_GUEST_NAME])
                ->assertSessionHasNoErrors();

            $this->assertSame($expectedPaid, $idea->fresh()->paid_price, "End date: {$endDate}");
        }
    }
}
