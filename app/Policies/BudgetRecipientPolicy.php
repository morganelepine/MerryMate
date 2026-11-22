<?php

namespace App\Policies;

use App\Models\BudgetRecipient;
use App\Models\User;

class BudgetRecipientPolicy
{
    public function update(User $user, BudgetRecipient $recipient): bool
    {
        return $recipient->user()->is($user);
    }

    public function delete(User $user, BudgetRecipient $recipient): bool
    {
        return $this->update($user, $recipient);
    }
}
