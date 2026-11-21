<?php

namespace Tests\Feature;

use App\Models\BrandNote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandNoteTest extends TestCase
{
    use RefreshDatabase;

    private const BRAND_NOTES_ENDPOINT = '/brand-notes';

    public function test_user_can_create_a_brand_note(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->put(self::BRAND_NOTES_ENDPOINT, ['brand' => 'Fleux', 'content' => '-25% sur tout le site'])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertDatabaseHas('brand_notes', [
            'user_id' => $user->id,
            'brand' => 'Fleux',
            'content' => '-25% sur tout le site',
        ]);
    }

    public function test_user_can_update_their_brand_note(): void
    {
        $note = BrandNote::factory()->create(['brand' => 'Fleux']);

        $this->actingAs($note->user)
            ->put(self::BRAND_NOTES_ENDPOINT, ['brand' => 'Fleux', 'content' => 'Code PARRAIN'])
            ->assertSessionHasNoErrors();

        $this->assertSame('Code PARRAIN', $note->fresh()->content);
        $this->assertSame(1, BrandNote::count());
    }

    public function test_empty_content_deletes_the_brand_note(): void
    {
        $note = BrandNote::factory()->create(['brand' => 'Fleux']);

        $this->actingAs($note->user)
            ->put(self::BRAND_NOTES_ENDPOINT, ['brand' => 'Fleux', 'content' => '   '])
            ->assertSessionHasNoErrors();

        $this->assertNull($note->fresh());
    }

    public function test_brand_notes_are_isolated_per_user(): void
    {
        $otherNote = BrandNote::factory()->create(['brand' => 'Fleux', 'content' => 'Original']);
        $user = User::factory()->create();

        $this->actingAs($user)
            ->put(self::BRAND_NOTES_ENDPOINT, ['brand' => 'Fleux', 'content' => '']);
        $this->actingAs($user)
            ->put(self::BRAND_NOTES_ENDPOINT, ['brand' => 'Fleux', 'content' => 'Le mien']);

        $this->assertSame('Original', $otherNote->fresh()->content);
        $this->assertSame(2, BrandNote::count());
    }

    public function test_guest_cannot_save_a_brand_note(): void
    {
        $this->put(self::BRAND_NOTES_ENDPOINT, ['brand' => 'Fleux', 'content' => 'Test'])
            ->assertRedirect('/login');

        $this->assertSame(0, BrandNote::count());
    }
}
