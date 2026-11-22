<?php

namespace App\Support;

use Carbon\CarbonInterface;

class BudgetOccasion
{
    public const VALUES = ['christmas', 'birthday', 'other'];

    /**
     * MerryMate purchases carry no occasion: Christmas shopping starts in the autumn,
     * the rest of the year is mostly birthdays. The buyer can correct it in the budget.
     */
    public static function resolve(?string $override, ?CarbonInterface $takenAt): string
    {
        return $override ?? ($takenAt && $takenAt->month >= 10 ? 'christmas' : 'birthday');
    }
}
