<?php

namespace App\Support;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

/**
 * Identifies a signed-out guest across visits, so a purchase they made
 * can later be recognised as theirs.
 */
class GuestIdentity
{
    private const COOKIE_NAME = 'guest_identity';

    // Keep in sync with GuestListAccess::LIFETIME_IN_MINUTES.
    private const LIFETIME_IN_MINUTES = 60 * 24 * 60; // ~2 months

    /**
     * The current guest's identifier, generating and storing one on first use.
     */
    public static function current(): ?string
    {
        if (Auth::check()) {
            return null;
        }

        $token = self::existing();

        if ($token === null) {
            $token = (string) Str::uuid();
            Cookie::queue(self::COOKIE_NAME, $token, self::LIFETIME_IN_MINUTES);
        }

        return $token;
    }

    /**
     * The guest identifier already stored for this visitor, if any.
     */
    public static function existing(): ?string
    {
        if (Auth::check()) {
            return null;
        }

        $token = request()->cookie(self::COOKIE_NAME);

        return is_string($token) ? $token : null;
    }

    /**
     * Whether the current visitor (authenticated user or guest)
     * is the one who reserved/purchased $reservable (an Idea or MultipleIdea).
     */
    public static function owns($reservable): bool
    {
        $userId = Auth::id();

        if ($userId !== null) {
            return $reservable->status_user_id === $userId;
        }

        $guestToken = self::existing();

        return $guestToken !== null && $reservable->status_guest_token === $guestToken;
    }
}
