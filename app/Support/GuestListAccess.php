<?php

namespace App\Support;

use App\Models\GiftList;
use Illuminate\Support\Facades\Cookie;

/**
 * Tracks which lists a signed-out guest has unlocked with their private code.
 * Stored in a dedicated cookie per list, not the session, so it survives
 * well past the app's session idle timeout (SESSION_LIFETIME, a couple of hours).
 * It carries a fingerprint of the code, so that changing the code revokes the access.
 */
class GuestListAccess
{
    private const COOKIE_PREFIX = 'list_access_';

    // Keep in sync with GuestIdentity::LIFETIME_IN_MINUTES.
    private const LIFETIME_IN_MINUTES = 60 * 24 * 60; // ~ 2 months

    /**
     * Remember, for about two months, that the current visitor has unlocked this list.
     */
    public static function grant(GiftList $list): void
    {
        Cookie::queue(self::cookieName($list->id), self::fingerprint($list), self::LIFETIME_IN_MINUTES);
    }

    /**
     * Whether the current visitor has already unlocked this list.
     */
    public static function has(GiftList $list): bool
    {
        $cookie = request()->cookie(self::cookieName($list->id));

        return is_string($cookie) && hash_equals(self::fingerprint($list), $cookie);
    }

    private static function fingerprint(GiftList $list): string
    {
        $privateCode = GiftList::decryptPrivateCode($list->private_code);

        return hash_hmac('sha256', mb_strtolower(trim($privateCode)), config('app.key'));
    }

    private static function cookieName(int $listId): string
    {
        return self::COOKIE_PREFIX.$listId;
    }
}
