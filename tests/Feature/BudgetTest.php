<?php

namespace Tests\Feature;

use App\Models\BudgetGift;
use App\Models\BudgetRecipient;
use App\Models\FollowedList;
use App\Models\Idea;
use App\Models\MultipleIdea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BudgetTest extends TestCase
{
    use RefreshDatabase;

    private const BUDGET_RECIPIENTS_URL = '/budget-recipients';

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

        $buyer = User::factory()->create();
        FollowedList::create([
            'user_id' => $buyer->id,
            'gift_list_id' => $giftList->id,
            'private_code' => '1234',
        ]);

        $this->actingAs($buyer)->patch("/ideas/{$single->id}/purchase", ['userName' => $buyer->name]);
        $this->actingAs($buyer)->patch("/ideas/{$reserved->id}/reserve", ['userName' => $buyer->name]);
        $this->actingAs($buyer)->patch("/multiple-ideas/{$multiple->id}/reserve", ['userName' => $buyer->name]);
        $this->actingAs($buyer)->patch("/multiple-ideas/{$multiple->id}/reserve", ['userName' => $buyer->name]);
        $reservation = MultipleIdea::where('idea_id', $multiple->id)->firstOrFail();
        $this->actingAs($buyer)->patch("/multiple-ideas/{$reservation->id}/confirm-purchase", ['userName' => $buyer->name]);
        $this->actingAs($buyer)->patch("/multiple-ideas/{$multiple->id}/purchase", ['userName' => $buyer->name]);

        // The promo ending afterwards must not change what was paid.
        $multiple->update(['promo' => false]);

        $this->actingAs($buyer)
            ->get('/profile/budget')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Profile/Budget')
                ->has('ideas', 5)
                // Totals are summed on the front, from paid_price when set.
                ->where('ideas', fn ($ideas) => round(collect($ideas)->sum(fn ($idea) => $idea['paid_price'] ?? $idea['price']), 2) === 134.98));
    }

    public function test_user_can_add_a_recipient(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(self::BUDGET_RECIPIENTS_URL, ['name' => '  Maman '])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertDatabaseHas('budget_recipients', ['user_id' => $user->id, 'name' => 'Maman']);
    }

    public function test_recipient_names_are_unique_per_user_only(): void
    {
        $recipient = BudgetRecipient::factory()->create(['name' => 'Papa']);

        $this->actingAs($recipient->user)
            ->post(self::BUDGET_RECIPIENTS_URL, ['name' => 'Papa'])
            ->assertSessionHasErrors('name');

        $this->actingAs(User::factory()->create())
            ->post(self::BUDGET_RECIPIENTS_URL, ['name' => 'Papa'])
            ->assertSessionHasNoErrors();
    }

    public function test_deleting_a_recipient_deletes_their_gifts(): void
    {
        $gift = BudgetGift::factory()->create();
        $recipient = $gift->recipient;

        $this->actingAs($recipient->user)
            ->delete("/budget-recipients/{$recipient->id}")
            ->assertSessionHasNoErrors();

        $this->assertNull($recipient->fresh());
        $this->assertNull($gift->fresh());
    }

    public function test_user_can_add_a_gift_with_a_french_price(): void
    {
        $recipient = BudgetRecipient::factory()->create();

        $this->actingAs($recipient->user)
            ->post('/budget-gifts', [
                'budget_recipient_id' => $recipient->id,
                'year' => 2025,
                'title' => 'Parfum',
                'price' => '37,80',
                'status' => 'purchased',
                'occasion' => 'birthday',
            ])
            ->assertSessionHasNoErrors();

        $gift = BudgetGift::sole();
        $this->assertSame(37.8, $gift->price);
        $this->assertSame(2025, $gift->year);
        $this->assertSame('purchased', $gift->status);
        $this->assertSame('birthday', $gift->occasion);
    }

    public function test_user_cannot_add_a_gift_to_someone_elses_recipient(): void
    {
        $otherRecipient = BudgetRecipient::factory()->create();

        $this->actingAs(User::factory()->create())
            ->post('/budget-gifts', [
                'budget_recipient_id' => $otherRecipient->id,
                'year' => 2025,
                'title' => 'Parfum',
                'status' => 'idea',
            ])
            ->assertSessionHasErrors('budget_recipient_id');

        $this->assertSame(0, BudgetGift::count());
    }

    public function test_user_can_toggle_the_status_of_a_gift(): void
    {
        $gift = BudgetGift::factory()->create(['status' => 'idea']);
        $owner = $gift->recipient->user;

        $this->actingAs($owner)->patch("/budget-gifts/{$gift->id}/status")->assertRedirect();
        $this->assertSame('purchased', $gift->fresh()->status);

        $this->actingAs($owner)->patch("/budget-gifts/{$gift->id}/status");
        $this->assertSame('idea', $gift->fresh()->status);
    }

    public function test_gifts_of_another_user_cannot_be_changed(): void
    {
        $gift = BudgetGift::factory()->create(['title' => 'Original', 'status' => 'idea']);
        $intruder = User::factory()->create();

        $this->actingAs($intruder)->patch("/budget-gifts/{$gift->id}/status")->assertForbidden();
        $this->actingAs($intruder)
            ->patch("/budget-gifts/{$gift->id}", ['title' => 'Piraté', 'status' => 'idea'])
            ->assertForbidden();
        $this->actingAs($intruder)->delete("/budget-gifts/{$gift->id}")->assertForbidden();
        $this->actingAs($intruder)->delete("/budget-recipients/{$gift->budget_recipient_id}")->assertForbidden();

        $this->assertSame('Original', $gift->fresh()->title);
        $this->assertSame('idea', $gift->fresh()->status);
    }

    public function test_budget_page_shows_the_selected_year_only(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        // Created first: the idea factory picks a random user who must own a list.
        $idea2025 = Idea::factory()->create(['list_id' => $giftList->id, 'user_id' => $owner->id]);
        $idea2024 = Idea::factory()->create(['list_id' => $giftList->id, 'user_id' => $owner->id]);
        $buyer = User::factory()->create();
        FollowedList::create(['user_id' => $buyer->id, 'gift_list_id' => $giftList->id, 'private_code' => '1234']);
        $this->markPurchasedBy($idea2025, $buyer, '2025-12-10 10:00:00');
        $this->markPurchasedBy($idea2024, $buyer, '2024-12-10 10:00:00');

        $recipient = BudgetRecipient::factory()->create(['user_id' => $buyer->id, 'name' => 'Roxane']);
        BudgetGift::factory()->create(['budget_recipient_id' => $recipient->id, 'year' => 2025, 'title' => 'Parfum']);
        BudgetGift::factory()->create(['budget_recipient_id' => $recipient->id, 'year' => 2023]);

        $this->actingAs($buyer)
            ->get('/profile/budget?year=2025')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Profile/Budget')
                ->where('year', 2025)
                ->has('ideas', 1)
                ->where('ideas.0.key', "idea-{$idea2025->id}")
                ->has('recipients', 1)
                ->has('recipients.0.gifts', 1)
                ->where('recipients.0.gifts.0.title', 'Parfum')
                ->where('years', fn ($years) => collect($years)->intersect([2025, 2024, 2023])->count() === 3));
    }

    public function test_purchasing_an_idea_dates_it_and_cancelling_clears_the_date(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $idea = Idea::factory()->create([
            'list_id' => $giftList->id,
            'user_id' => $owner->id,
            'user_name' => $owner->name,
            'is_multiple' => false,
            'status' => 'available',
            'status_user' => '',
            'status_user_id' => null,
        ]);
        $buyer = User::factory()->create();
        FollowedList::create(['user_id' => $buyer->id, 'gift_list_id' => $giftList->id, 'private_code' => '1234']);

        $this->actingAs($buyer)
            ->patch("/ideas/{$idea->id}/purchase", ['userName' => $buyer->name])
            ->assertSessionHasNoErrors();
        $this->assertNotNull($idea->fresh()->taken_at);
        $this->actingAs($buyer)->patch("/ideas/{$idea->id}/budget-occasion", ['occasion' => 'other']);

        $this->actingAs($buyer)->patch("/ideas/{$idea->id}/cancel")->assertSessionHasNoErrors();
        $this->assertNull($idea->fresh()->taken_at);
        // The next buyer starts from the guess again.
        $this->assertNull($idea->fresh()->budget_occasion);
    }

    public function test_gift_occasion_must_be_a_known_one(): void
    {
        $recipient = BudgetRecipient::factory()->create();

        $this->actingAs($recipient->user)
            ->post('/budget-gifts', [
                'budget_recipient_id' => $recipient->id,
                'year' => 2025,
                'title' => 'Parfum',
                'status' => 'idea',
                'occasion' => 'easter',
            ])
            ->assertSessionHasErrors('occasion');
    }

    public function test_merrymate_purchases_get_an_occasion_guessed_from_their_date_unless_corrected(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $december = Idea::factory()->create(['list_id' => $giftList->id, 'user_id' => $owner->id]);
        $may = Idea::factory()->create(['list_id' => $giftList->id, 'user_id' => $owner->id]);
        $corrected = Idea::factory()->create(['list_id' => $giftList->id, 'user_id' => $owner->id]);
        $buyer = User::factory()->create();
        $this->markPurchasedBy($december, $buyer, '2025-12-02 10:00:00');
        $this->markPurchasedBy($may, $buyer, '2025-05-12 10:00:00');
        $this->markPurchasedBy($corrected, $buyer, '2025-12-20 10:00:00', ['budget_occasion' => 'other']);

        $this->actingAs($buyer)
            ->get('/profile/budget?year=2025')
            ->assertInertia(function (Assert $page) use ($december, $may, $corrected) {
                $occasions = collect($page->toArray()['props']['ideas'])->pluck('occasion', 'id');
                $this->assertSame('christmas', $occasions[$december->id]);
                $this->assertSame('birthday', $occasions[$may->id]);
                $this->assertSame('other', $occasions[$corrected->id]);
            });
    }

    public function test_only_the_buyer_can_correct_the_occasion_of_a_merrymate_purchase(): void
    {
        [$owner, $giftList] = $this->createGiftListWithOwner();
        $idea = Idea::factory()->create(['list_id' => $giftList->id, 'user_id' => $owner->id]);
        $buyer = User::factory()->create();
        $this->markPurchasedBy($idea, $buyer, now());

        $this->actingAs(User::factory()->create())
            ->patch("/ideas/{$idea->id}/budget-occasion", ['occasion' => 'other'])
            ->assertForbidden();
        $this->actingAs($buyer)
            ->patch("/ideas/{$idea->id}/budget-occasion", ['occasion' => 'easter'])
            ->assertSessionHasErrors('occasion');
        $this->actingAs($buyer)
            ->patch("/ideas/{$idea->id}/budget-occasion", ['occasion' => 'other'])
            ->assertSessionHasNoErrors();

        $this->assertSame('other', $idea->fresh()->budget_occasion);
    }

    /**
     * Purchase made straight in the database, dated as given (taken_at isn't fillable from routes).
     */
    private function markPurchasedBy(Idea $idea, User $buyer, $takenAt, array $extra = []): void
    {
        $idea->forceFill([
            'is_multiple' => false,
            'status' => 'purchased',
            'status_user' => $buyer->name,
            'status_user_id' => $buyer->id,
            'taken_at' => $takenAt,
            ...$extra,
        ])->save();
    }
}
