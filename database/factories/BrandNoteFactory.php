<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BrandNote>
 */
class BrandNoteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'brand' => fake()->unique()->word(),
            'content' => fake()->randomElement([
                'Code PARRAIN15 : -15% sur la première commande',
                '-25% sur tout le site en ce moment',
                '5€ offerts en s\'inscrivant à la newsletter',
            ]),
        ];
    }
}
