<?php

namespace Database\Factories;

use App\Models\BudgetRecipient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BudgetGift>
 */
class BudgetGiftFactory extends Factory
{
    public function definition(): array
    {
        return [
            'budget_recipient_id' => BudgetRecipient::factory(),
            'year' => (int) now()->year,
            'title' => fake()->words(2, true),
            'price' => fake()->randomFloat(2, 2, 80),
            'status' => fake()->randomElement(['idea', 'purchased']),
            'occasion' => 'christmas',
        ];
    }
}
