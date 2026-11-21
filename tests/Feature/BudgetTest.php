<?php

namespace Tests\Feature;

use App\Models\FollowedList;
use App\Models\Idea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BudgetTest extends TestCase
{
    use RefreshDatabase;

    public function test_budget_counts_purchases_at_their_paid_price_and_reservations(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $ideaDefaults = [
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'status' => 'available',
            'status_user' => '',
            'status_user_id' => null,
            'promo' => false,
        ];
        $single = Idea::factory()->create([...$ideaDefaults, 'price' => 20, 'is_multiple' => false]);
        $reserved = Idea::factory()->create([...$ideaDefaults, 'price' => 15, 'is_multiple' => false]);
        $multiple = Idea::factory()->create([
            ...$ideaDefaults,
            'price' => 40,
            'is_multiple' => true,
            'promo' => true,
            'promo_price' => 29.99,
        ]);

        // Created after the ideas: IdeaFactory picks a random user, who must own a list.
        $buyer = User::factory()->create();
        FollowedList::create([
            'user_id' => $buyer->id,
            'gift_list_id' => $giftList->id,
            'private_code' => '1234',
        ]);

        $this->actingAs($buyer)->patch("/ideas/{$single->id}/purchase", ['userName' => $buyer->name]);
        $this->actingAs($buyer)->patch("/ideas/{$reserved->id}/reserve", ['userName' => $buyer->name]);
        $this->actingAs($buyer)->patch("/multiple-ideas/{$multiple->id}/reserve", ['userName' => $buyer->name]);
        $this->actingAs($buyer)->patch("/multiple-ideas/{$multiple->id}/purchase", ['userName' => $buyer->name]);
        $this->actingAs($buyer)->patch("/multiple-ideas/{$multiple->id}/purchase", ['userName' => $buyer->name]);

        // The promo ending afterwards must not change what was paid.
        $multiple->update(['promo' => false]);

        $this->actingAs($buyer)
            ->get('/profile/budget')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Profile/Budget')
                ->has('ideas', 5)
                ->where('totalPrice', 134.98));
    }
}
