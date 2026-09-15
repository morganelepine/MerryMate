<?php

namespace App\Support;

use Illuminate\Support\Facades\Cookie;

/**
 * Tracks which lists a signed-out guest has unlocked with their private code.
 * Stored in a dedicated cookie per list, not the session, so it survives
 * well past the app's session idle timeout (SESSION_LIFETIME, a couple of hours). */
class GuestListAccess
{
    private const COOKIE_PREFIX = 'list_access_';

    // Keep in sync with GuestIdentity::LIFETIME_IN_MINUTES.
    private const LIFETIME_IN_MINUTES = 60 * 24 * 60; // ~ 2 months

    /**
     * Remember, for about two months, that the current visitor has unlocked this list.
     */
    public static function grant(int $listId): void
    {
        Cookie::queue(self::cookieName($listId), '1', self::LIFETIME_IN_MINUTES);
    }

    /**
     * Whether the current visitor has already unlocked this list.
     */
    public static function has(int $listId): bool
    {
        return request()->cookie(self::cookieName($listId)) !== null;
    }

    private static function cookieName(int $listId): string
    {
        return self::COOKIE_PREFIX.$listId;
    }
}
