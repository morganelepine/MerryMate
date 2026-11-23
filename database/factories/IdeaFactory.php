<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\GiftList;
use Illuminate\Database\Eloquent\Factories\Factory;
// use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Idea>
 */
class IdeaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::inRandomOrder()->first();
        $statusUser = User::where('id', '!=', $user->id)->inRandomOrder()->first();
        $status = $statusUser !== null ? fake()->randomElement(['available', 'reserved', 'purchased']) : 'available';
        $statusUserName = $status === 'available' ? '' : $statusUser->name;

        return [
            'user_id' => $user->id,
            'list_id' => fn (array $attributes) => GiftList::where('user_id', $attributes['user_id'])->inRandomOrder()->value('id')
                ?? GiftList::factory()->create([
                    'user_id' => $attributes['user_id'],
                    'user_name' => $attributes['user_name'],
                ])->id,
            'user_name' => $user->name,
            'idea' => fake()->words(3, true),
            'brand' => fake()->word(),
            'link' => fake()->url(),
            'details' => fake()->word(),
            'price' => fake()->randomFloat(2, 5, 300),
            'favorite' => fake()->boolean(),
            'is_multiple' => fake()->boolean(),
            'promo' => fake()->boolean(),
            'promo_price' => null,
            'promo_end_date' => null,
            'status' => $status,
            'status_user' => $statusUserName,
            'status_user_id' => $statusUser !== null ? $statusUser->id : null,
        ];
    }
}
