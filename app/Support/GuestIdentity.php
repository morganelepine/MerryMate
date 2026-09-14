<?php

namespace App\Support;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

/**
 * Identifies a signed-out guest across requests within the same browser session,
 * so a reservation/purchase they made can later be recognised as theirs.
 */
class GuestIdentity
{
    private const SESSION_KEY = 'guest_identity';

    /**
     * The current guest's identifier, generating and storing one on first use.
     */
    public static function current(): ?string
    {
        if (Auth::check()) {
            return null;
        }

        $token = session(self::SESSION_KEY);

        if (! is_string($token)) {
            $token = (string) Str::uuid();
            session([self::SESSION_KEY => $token]);
        }

        return $token;
    }

    /**
     * The guest identifier already stored in this session, if any.
     */
    public static function existing(): ?string
    {
        return Auth::check() ? null : session(self::SESSION_KEY);
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
