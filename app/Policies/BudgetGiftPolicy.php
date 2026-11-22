<?php

namespace App\Policies;

use App\Models\BudgetGift;
use App\Models\User;

// A gift belongs to whoever owns its recipient.
class BudgetGiftPolicy
{
    public function update(User $user, BudgetGift $gift): bool
    {
        return $gift->recipient->user()->is($user);
    }

    public function delete(User $user, BudgetGift $gift): bool
    {
        return $this->update($user, $gift);
    }
}
