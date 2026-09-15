<?php

namespace Tests\Feature;

use App\Models\GiftList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
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
        // Private code not crypted (old)
        [, $plainCodeList] = $this->createGiftListWithOwner([
            'private_code' => 'plain_text_code',
        ]);

        $decryptedPrivateCode = strlen($plainCodeList->private_code) > 20
            ? Crypt::decrypt($plainCodeList->private_code)
            : $plainCodeList->private_code;

        $this->assertEquals('plain_text_code', $decryptedPrivateCode);

        // Private code crypted (new)
        $encryptedCode = Crypt::encrypt('encrypted_text_code');
        [, $encryptedCodeList] = $this->createGiftListWithOwner([
            'private_code' => $encryptedCode,
        ]);

        $decryptedPrivateCode = strlen($encryptedCodeList->private_code) > 50
            ? Crypt::decrypt($encryptedCodeList->private_code)
            : $encryptedCodeList->private_code;

        $this->assertEquals('encrypted_text_code', $decryptedPrivateCode);
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
}
