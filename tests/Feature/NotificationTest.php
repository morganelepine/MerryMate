<?php

namespace Tests\Feature;

use App\Models\GiftList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\DatabaseNotification;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    private const ACCEPTED_RESPONSE = 'accepté';

    /**
     * Sends an access request from $requester to $owner for $giftList.
     * @param User $requester The user requesting access.
     * @param User $owner The owner of the gift list.
     * @param GiftList $giftList The gift list to follow.
     * @return DatabaseNotification The notification created for the owner.
     */
    private function requestAccess(User $requester, User $owner, GiftList $giftList): DatabaseNotification
    {
        $this->actingAs($requester)
            ->post("/notifications/request-access/{$owner->id}/{$giftList->id}");

        return $owner->fresh()->notifications()->first();
    }

    public function test_unread_notifications_can_be_listed(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $follower = User::factory()->create();

        $this->requestAccess($follower, $owner, $giftList);

        $response = $this->actingAs($owner)->get('/notifications/unread');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('unread_notifications'));
        $this->assertSame(
            'request-access',
            $response->json('unread_notifications.0.type')
        );
    }

    public function test_all_notifications_can_be_listed_and_marks_them_as_read(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $follower = User::factory()->create();

        $this->requestAccess($follower, $owner, $giftList);

        $response = $this->actingAs($owner)->get('/notifications/all');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('notifications'));

        // Consulting /notifications/all marks everything as read as a
        // side effect (NotificationController::index calls
        // markAllNotifications() before listing) — worth pinning down
        // since it's easy to break unknowingly.
        $this->assertSame(0, $owner->fresh()->unreadNotifications()->count());
    }

    public function test_access_request_can_be_accepted(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner([
            'private_code' => '1234',
        ]);
        $requester = User::factory()->create();

        $notification = $this->requestAccess($requester, $owner, $giftList);

        $response = $this->actingAs($owner)->post(
            "/notifications/respond-access/{$notification->id}/{$giftList->id}",
            ['response' => self::ACCEPTED_RESPONSE]
        );

        $response
            ->assertStatus(200)
            ->assertExactJson(['message' => 'Réponse envoyée avec succès.']);

        $this->assertDatabaseHas('followed_lists', [
            'user_id' => $requester->id,
            'gift_list_id' => $giftList->id,
        ]);

        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'data' => json_encode([
                'requestingUser' => $requester->name,
                'requestingUserId' => $requester->id,
                'listToFollow' => $giftList->name,
                'listId' => $giftList->id,
                'response' => self::ACCEPTED_RESPONSE,
            ]),
        ]);
        $this->assertNotNull($notification->fresh()->read_at);

        $this->assertDatabaseHas('notifications', [
            'type' => 'response-to-request',
            'notifiable_id' => $requester->id,
            'data' => json_encode([
                'response' => self::ACCEPTED_RESPONSE,
                'listOwner' => $owner->name,
                'list' => $giftList->name,
                'listId' => $giftList->id,
            ]),
        ]);
    }

    public function test_access_request_can_be_declined_without_creating_a_follow(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $requester = User::factory()->create();

        $notification = $this->requestAccess($requester, $owner, $giftList);

        $response = $this->actingAs($owner)->post(
            "/notifications/respond-access/{$notification->id}/{$giftList->id}",
            ['response' => 'décliné']
        );

        $response->assertStatus(200);

        $this->assertDatabaseMissing('followed_lists', [
            'user_id' => $requester->id,
            'gift_list_id' => $giftList->id,
        ]);

        $this->assertDatabaseHas('notifications', [
            'type' => 'response-to-request',
            'notifiable_id' => $requester->id,
        ]);
    }

    public function test_only_the_list_owner_can_respond_to_an_access_request(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $requester = User::factory()->create();
        $stranger = User::factory()->create();

        $notification = $this->requestAccess($requester, $owner, $giftList);

        $response = $this->actingAs($stranger)->post(
            "/notifications/respond-access/{$notification->id}/{$giftList->id}",
            ['response' => self::ACCEPTED_RESPONSE]
        );

        $response->assertStatus(403);
        $this->assertDatabaseMissing('followed_lists', [
            'user_id' => $requester->id,
            'gift_list_id' => $giftList->id,
        ]);
    }
}
