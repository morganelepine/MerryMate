<?php

namespace Tests\Feature;

use App\Models\FollowedList;
use App\Models\GiftList;
use App\Models\Idea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class GiftListTest extends TestCase
{
    use RefreshDatabase;

    public function test_giftlist_creation_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/lists/create');

        $response->assertOk();
    }

    public function test_private_giftlist_can_be_created(): void
    {
        $user = User::factory()->create();

        $listData = [
            'user_name' => $user->name,
            'name' => 'Anniversaire',
            'private_code' => '_private',
            'isPrivate' => true,
        ];

        $this->actingAs($user);

        $response = $this->post('/lists', $listData);
        $response->assertStatus(302);

        $createdList = GiftList::where('user_id', $user->id)->first();
        $this->assertNotNull($createdList);

        $decryptedPrivateCode = Crypt::decrypt($createdList->private_code);

        $this->assertEquals('_private', $decryptedPrivateCode);
        $this->assertEquals($user->id, $createdList->user_id);
        $this->assertEquals('Anniversaire', $createdList->name);
        $this->assertTrue((bool) $createdList->isPrivate);
    }

    public function test_public_giftlist_can_be_created(): void
    {
        $user = User::factory()->create();

        $listData = [
            'user_name' => $user->name,
            'name' => 'Anniversaire',
            'private_code' => '1234',
            'isPrivate' => false,
        ];

        $this->actingAs($user);

        $response = $this->post('/lists', $listData);
        $response->assertStatus(302);

        $createdList = GiftList::where('user_id', $user->id)->first();
        $this->assertNotNull($createdList);

        $decryptedPrivateCode = Crypt::decrypt($createdList->private_code);

        $this->assertEquals('1234', $decryptedPrivateCode);
        $this->assertEquals($user->id, $createdList->user_id);
        $this->assertEquals('Anniversaire', $createdList->name);
        $this->assertFalse((bool) $createdList->isPrivate);
    }

    public function test_giftlist_name_can_be_updated(): void
    {
        [$user, $giftList] = $this->createGiftListWithOwner([
            'name' => 'Mariage',
            'private_code' => '1234',
            'isPrivate' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->patch("/lists/{$giftList->id}", [
                'name' => 'Wedding',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect("/lists/{$giftList->id}");

        $giftList->refresh();

        $this->assertSame('Wedding', $giftList->name);
    }

    public function test_private_giftlist_can_be_made_public_with_a_code(): void
    {
        [$user, $giftList] = $this->createGiftListWithOwner([
            'private_code' => '_private',
            'isPrivate' => true,
        ]);

        $this->actingAs($user)
            ->patch("/lists/{$giftList->id}", ['isPrivate' => false])
            ->assertSessionHasErrors('private_code');

        $this->assertTrue((bool) $giftList->refresh()->isPrivate);

        $this->actingAs($user)
            ->patch("/lists/{$giftList->id}", ['isPrivate' => false, 'private_code' => 'ab12'])
            ->assertSessionHasNoErrors()
            ->assertRedirect("/lists/{$giftList->id}");

        $giftList->refresh();
        $this->assertFalse((bool) $giftList->isPrivate);
        $this->assertSame('ab12', GiftList::decryptPrivateCode($giftList->private_code));
    }

    public function test_giftlist_can_be_deleted(): void
    {
        [$user, $giftList] = $this->createGiftListWithOwner([
            'name' => 'Mariage',
            'private_code' => '1234',
            'isPrivate' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->delete("/lists/{$giftList->id}");

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/lists/created');

        $this->assertNull($giftList->fresh());
    }

    public function test_correct_private_code_must_be_provided_to_follow_giftlist(): void
    {
        [, $giftList] = $this->createGiftListWithOwner([
            'name' => 'Mariage',
            'private_code' => Crypt::encrypt('1234'),
            'isPrivate' => false,
        ]);
        $follower = User::factory()->create();

        $response = $this
            ->actingAs($follower)
            ->post("/lists/{$giftList->id}/follow", [
                'private_code' => 'wrong-code',
            ]);

        $response
            ->assertSessionHasErrors('private_code')
            ->assertRedirect();

        $this->assertDatabaseMissing('followed_lists', [
            'user_id' => $follower->id,
            'gift_list_id' => $giftList->id,
        ]);
    }

    public function test_following_a_giftlist_twice_creates_one_follow_and_one_notification(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner([
            'private_code' => Crypt::encrypt('1234'),
        ]);
        $follower = User::factory()->create();

        foreach ([1, 2] as $attempt) {
            $this->actingAs($follower)->post("/lists/{$giftList->id}/follow", [
                'private_code' => '1234',
            ])->assertRedirect(route('lists.followedLists'));
        }

        $this->assertSame(1, $follower->followed_lists()->count());
        $this->assertSame(1, $owner->notifications()->count());
    }

    public function test_following_ignores_list_and_user_ids_sent_in_the_body(): void
    {
        [, $giftList] = $this->createGiftListWithOwner([
            'private_code' => Crypt::encrypt('1234'),
        ]);
        [, $otherList] = $this->createGiftListWithOwner([
            'private_code' => Crypt::encrypt('9999'),
        ]);
        $follower = User::factory()->create();
        $victim = User::factory()->create();

        $this->actingAs($follower)->post("/lists/{$giftList->id}/follow", [
            'user_id' => $victim->id,
            'gift_list_id' => $otherList->id,
            'private_code' => '1234',
        ]);

        $this->assertDatabaseHas('followed_lists', [
            'user_id' => $follower->id,
            'gift_list_id' => $giftList->id,
        ]);
        $this->assertDatabaseMissing('followed_lists', ['gift_list_id' => $otherList->id]);
        $this->assertDatabaseMissing('followed_lists', ['user_id' => $victim->id]);
    }

    public function test_request_can_be_sent_to_follow_giftlist(): void
    {
        [$user, $giftList] = $this->createGiftListWithOwner([
            'name' => 'Mariage',
            'private_code' => '1234',
            'isPrivate' => false,
        ]);
        $follower = User::factory()->create();

        $response = $this
            ->actingAs($follower)
            ->post("/notifications/request-access/{$user->id}/{$giftList->id}");

        $response
            ->assertSessionHasNoErrors()
            ->assertStatus(200)
            ->assertExactJson(['message' => 'Demande envoyée avec succès.']);

        $this->assertDatabaseHas('notifications', [
            'type' => 'request-access',
            'notifiable_type' => 'App\Models\User',
            'notifiable_id' => $user->id,
            'data' => json_encode([
                'requestingUser' => $follower->name,
                'requestingUserId' => $follower->id,
                'listToFollow' => $giftList->name,
                'listId' => $giftList->id,
            ]),
        ]);
    }

    public function test_decrypt_private_code_or_use_plain_text(): void
    {
        // Legacy codes were stored in plaintext
        $this->assertSame('plain_text_code', GiftList::decryptPrivateCode('plain_text_code'));

        $this->assertSame(
            'encrypted_text_code',
            GiftList::decryptPrivateCode(Crypt::encrypt('encrypted_text_code'))
        );
    }

    public function test_updated_private_code_is_stored_encrypted(): void
    {
        [$user, $giftList] = $this->createGiftListWithOwner([
            'private_code' => Crypt::encrypt('1234'),
            'isPrivate' => false,
        ]);

        $this->actingAs($user)
            ->patch("/lists/{$giftList->id}", ['private_code' => 'new-code'])
            ->assertSessionHasNoErrors();

        $storedCode = $giftList->fresh()->private_code;

        $this->assertNotSame('new-code', $storedCode);
        $this->assertSame('new-code', Crypt::decrypt($storedCode));
    }

    public function test_private_code_is_only_sent_to_the_list_owner(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner([
            'name' => 'Mariage',
            'private_code' => Crypt::encrypt('1234'),
            'isPrivate' => false,
        ]);
        $follower = User::factory()->create();
        FollowedList::create([
            'user_id' => $follower->id,
            'gift_list_id' => $giftList->id,
            'private_code' => Crypt::encrypt('1234'),
        ]);
        $stranger = User::factory()->create();

        $this->actingAs($owner)->get('/lists')->assertInertia(fn ($page) => $page
            ->where('mySharedLists.0.private_code', '1234')
        );

        $this->actingAs($follower)->get('/lists')->assertInertia(fn ($page) => $page
            ->has('followedLists.0')
            ->missing('followedLists.0.private_code')
        );

        $this->actingAs($follower)->get("/lists/{$giftList->id}")->assertInertia(fn ($page) => $page
            ->missing('list.private_code')
            ->missing('followedLists.0.private_code')
        );

        $this->actingAs($stranger)->get('/lists/to-follow')->assertInertia(fn ($page) => $page
            ->has('listsToFollow.0')
            ->missing('listsToFollow.0.private_code')
        );

        $this->actingAs($stranger)->getJson('/lists/search?search=Mariage')
            ->assertOk()
            ->assertJsonMissingPath('listsToFollow.0.private_code');
    }

    public function test_followers_are_only_sent_to_the_list_owner(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner(['isPrivate' => false]);
        $follower = $this->createFollower($giftList);

        $this->actingAs($owner)->get("/lists/{$giftList->id}")->assertInertia(fn ($page) => $page
            ->has('followers', 1)
            ->where('followers.0', $follower->only('id', 'name', 'last_name'))
        );

        $this->actingAs($follower)->get("/lists/{$giftList->id}")->assertInertia(fn ($page) => $page
            ->has('followers', 0)
        );
    }

    public function test_owner_can_remove_a_follower_who_then_loses_access(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner(['isPrivate' => false]);
        [, $otherList] = $this->createGiftListWithOwner(['isPrivate' => false]);
        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'status' => 'reserved',
            'status_user' => 'Follower',
        ]);
        $follower = $this->createFollower($giftList);
        $remainingFollower = $this->createFollower($giftList);
        $follower->followed_lists()->create(['gift_list_id' => $otherList->id, 'private_code' => '1234']);
        $idea->update(['status_user_id' => $follower->id]);

        $this->actingAs($owner)
            ->delete("/lists/{$giftList->id}/followers/{$follower->id}")
            ->assertRedirect("/lists/{$giftList->id}");

        $this->assertSame([$remainingFollower->id], $giftList->followers()->pluck('users.id')->all());
        $this->assertSame([$otherList->id], $follower->followedLists()->pluck('gift_lists.id')->all());
        $this->assertSame('reserved', $idea->refresh()->status);
        $this->assertSame($follower->id, $idea->status_user_id);

        $this->actingAs($follower)->get("/lists/{$giftList->id}")->assertInertia(fn ($page) => $page
            ->has('ideas', 0)
            ->has('followedLists', 0)
        );
    }

    public function test_only_the_owner_can_remove_a_follower(): void
    {
        [, $giftList] = $this->createGiftListWithOwner(['isPrivate' => false]);
        $follower = $this->createFollower($giftList);
        $otherFollower = $this->createFollower($giftList);
        $url = "/lists/{$giftList->id}/followers/{$follower->id}";

        $this->delete($url)->assertRedirect('/login');
        $this->actingAs($otherFollower)->delete($url)->assertForbidden();

        $this->assertSame(2, $giftList->followers()->count());
    }

    public function test_list_cards_only_carry_the_fields_the_front_uses(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner(['isPrivate' => false]);
        $follower = User::factory()->create();
        FollowedList::create([
            'user_id' => $follower->id,
            'gift_list_id' => $giftList->id,
            'private_code' => Crypt::encrypt('1234'),
        ]);

        $this->actingAs($follower)->get('/lists')->assertInertia(fn ($page) => $page
            ->missing('auth.user.email')
            ->missing('auth.user.last_login_at')
            ->where('followedLists.0.id', $giftList->id)
            ->where('followedLists.0.user_lastname', $owner->last_name)
            ->where('followedLists.0.isEmpty', true)
            ->missing('followedLists.0.pivot')
            ->missing('followedLists.0.created_at')
        );
    }

    public function test_long_absence_reminders_apply_once_per_login(): void
    {
        [$owner, $emptyList] = $this->createGiftListWithOwner(['isPrivate' => false]);
        $listToArchive = GiftList::factory()->create([
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'isPrivate' => false,
        ]);
        Idea::factory()->create([
            'list_id' => $listToArchive->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'status' => 'reserved',
            'status_user' => 'Buyer',
        ]);
        // [showArchiveReminder, resetMutedReminders]
        $reminders = function (GiftList $list) {
            $props = $this->get("/lists/{$list->id}")->viewData('page')['props'];

            return [$props['showArchiveReminder'], $props['resetMutedReminders']];
        };
        $logIn = function (int $daysAway) use ($owner) {
            $this->post('/logout');
            $owner->update(['last_login_at' => now()->subDays($daysAway)]);
            $this->post('/login', ['email' => $owner->email, 'password' => 'Password+1']);
        };

        $logIn(31);
        // Nothing to archive: the archive reminder waits, muted reminders are reset.
        $this->assertSame([false, true], $reminders($emptyList));
        $this->assertSame([true, false], $reminders($listToArchive));
        $this->assertSame([false, false], $reminders($listToArchive));

        $logIn(5);
        $this->assertSame([false, false], $reminders($listToArchive));

        $logIn(40);
        $this->assertSame([true, true], $reminders($listToArchive));
    }

    public function test_list_index_query_count_does_not_grow_with_the_number_of_lists(): void
    {
        $user = User::factory()->create();
        $countQueries = function () use ($user) {
            DB::flushQueryLog();
            DB::enableQueryLog();
            $this->actingAs($user)->get('/lists')->assertOk();

            return count(DB::getQueryLog());
        };

        GiftList::create(['user_id' => $user->id, 'user_name' => $user->name, 'name' => 'A', 'private_code' => '1234', 'isPrivate' => false]);
        $withOneList = $countQueries();

        foreach (range(1, 5) as $i) {
            GiftList::create(['user_id' => $user->id, 'user_name' => $user->name, 'name' => "L{$i}", 'private_code' => '1234', 'isPrivate' => false]);
        }

        $this->assertSame($withOneList, $countQueries());
    }

    public function test_guest_cannot_view_list_without_unlocking_it(): void
    {
        [, $giftList] = $this->createGiftListWithOwner([
            'name' => 'Mariage',
            'private_code' => '1234',
            'isPrivate' => false,
        ]);

        $response = $this->get("/lists/{$giftList->id}");

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('GiftList/Show')
            ->where('guestAccessGranted', false)
            ->where('ideas_available', [])
            ->missing('list.private_code')
            ->missing('list.user_lastname')
        );
    }

    public function test_guest_can_unlock_list_with_correct_private_code(): void
    {
        [, $giftList] = $this->createGiftListWithOwner([
            'name' => 'Mariage',
            'private_code' => '1234',
            'isPrivate' => false,
        ]);

        $response = $this->post("/lists/{$giftList->id}/guest-access", [
            'private_code' => '1234',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect("/lists/{$giftList->id}");

        // Unlike the session, this cookie isn't carried over to the next
        // call automatically — a real browser would resend it, so the test
        // has to forward it explicitly.
        $cookie = collect($response->headers->getCookies())
            ->first(fn ($cookie) => $cookie->getName() === "list_access_{$giftList->id}");

        $this->withUnencryptedCookie($cookie->getName(), $cookie->getValue())
            ->get("/lists/{$giftList->id}")
            ->assertInertia(fn ($page) => $page->where('guestAccessGranted', true));
    }

    public function test_guest_access_is_remembered_for_about_two_months(): void
    {
        [, $giftList] = $this->createGiftListWithOwner([
            'name' => 'Mariage',
            'private_code' => '1234',
            'isPrivate' => false,
        ]);

        $response = $this->post("/lists/{$giftList->id}/guest-access", [
            'private_code' => '1234',
        ]);

        $cookie = collect($response->headers->getCookies())
            ->first(fn ($cookie) => $cookie->getName() === "list_access_{$giftList->id}");

        $this->assertNotNull($cookie);
        $this->assertGreaterThan(now()->addDays(56)->timestamp, $cookie->getExpiresTime());
    }

    public function test_guest_cannot_unlock_list_with_wrong_private_code(): void
    {
        [, $giftList] = $this->createGiftListWithOwner([
            'name' => 'Mariage',
            'private_code' => '1234',
            'isPrivate' => false,
        ]);

        $response = $this->post("/lists/{$giftList->id}/guest-access", [
            'private_code' => 'wrong-code',
        ]);

        $response
            ->assertSessionHasErrors('private_code')
            ->assertRedirect();

        $this->get("/lists/{$giftList->id}")->assertInertia(fn ($page) => $page
            ->where('guestAccessGranted', false)
        );
    }

    public function test_private_list_is_only_accessible_to_its_owner(): void
    {
        [$owner, $privateList] = $this->createGiftListWithOwner([
            'private_code' => Crypt::encrypt('_private'),
            'isPrivate' => true,
        ]);
        $idea = Idea::factory()->create([
            'list_id' => $privateList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'status' => 'available',
        ]);
        $url = "/lists/{$privateList->id}";

        $this->get($url)->assertRedirect('/login');
        $this->post("{$url}/guest-access", ['private_code' => '_private'])->assertNotFound();

        // Followed while the private code still opened private lists.
        $follower = $this->createFollower($privateList);
        $this->actingAs($follower)->get($url)->assertNotFound();
        $this->actingAs($follower)->patch("/ideas/{$idea->id}/purchase", ['userName' => 'X'])->assertForbidden();
        $this->actingAs($follower)->get('/lists')->assertInertia(fn ($page) => $page->has('followedLists', 0));

        $stranger = User::factory()->create();
        $this->actingAs($stranger)->post("{$url}/follow", ['private_code' => '_private'])->assertNotFound();
        $this->actingAs($stranger)
            ->post("/notifications/request-access/{$owner->id}/{$privateList->id}")
            ->assertNotFound();
        $this->assertSame(0, $stranger->followed_lists()->count());

        $this->actingAs($owner)->get($url)->assertOk();
    }

    public function test_guest_access_is_revoked_when_the_code_changes(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $isGranted = fn () => $this->get("/lists/{$giftList->id}")->viewData('page')['props']['guestAccessGranted'];

        $this->actingAsGuestWithAccessTo($giftList);
        $this->assertTrue($isGranted());

        $giftList->update(['private_code' => Crypt::encrypt('new-code')]);
        $this->assertFalse($isGranted());
    }

    public function test_removed_follower_cannot_act_through_an_old_guest_access(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'status' => 'available',
        ]);
        $removedFollower = User::factory()->create();

        $this->actingAsGuestWithAccessTo($giftList);
        $this->actingAs($removedFollower)
            ->patch("/ideas/{$idea->id}/purchase", ['userName' => 'X'])
            ->assertForbidden();
    }

    public function test_list_can_only_be_archived_once_an_idea_is_taken(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'is_multiple' => false,
            'status' => 'available',
        ]);
        $canArchive = fn () => $this->actingAs($owner)->get("/lists/{$giftList->id}")->viewData('page')['props']['canArchive'];

        $this->assertFalse($canArchive());

        foreach (['reserved', 'purchased'] as $status) {
            $idea->update(['status' => $status]);
            $this->assertTrue($canArchive());
        }

        $this->patch("/lists/{$giftList->id}/archive");
        $this->assertFalse($canArchive());
    }

    private function createFollower(GiftList $giftList): User
    {
        $follower = User::factory()->create();
        $follower->followed_lists()->create([
            'gift_list_id' => $giftList->id,
            'private_code' => Crypt::encrypt('1234'),
        ]);

        return $follower;
    }
}
