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

    /**
     * Unlock $list as a signed-out guest, the way a real browser would:
     * submit the private code, then carry the resulting cookie forward on
     * every subsequent request this test makes. Unlike the session, this
     * cookie is never shared across sequential calls automatically — it
     * has to be forwarded explicitly.
     *
     * @return $this
     */
    protected function actingAsGuestWithAccessTo(GiftList $list, string $privateCode = '1234'): static
    {
        $response = $this->post("/lists/{$list->id}/guest-access", [
            'private_code' => $privateCode,
        ]);

        $cookieName = "list_access_{$list->id}";
        $cookie = collect($response->headers->getCookies())
            ->first(fn ($cookie) => $cookie->getName() === $cookieName);

        $this->assertNotNull($cookie, "Expected a {$cookieName} cookie to have been set.");

        return $this->withUnencryptedCookie($cookieName, $cookie->getValue());
    }
}
