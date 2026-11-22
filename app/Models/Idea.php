<?php

namespace App\Models;

use App\Models\Concerns\TracksTakenAt;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Idea extends Model
{
    use HasFactory;
    use TracksTakenAt;

    // Une idée ne peut avoir été créée que par un user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Une idée ne peut être que dans une liste
    public function giftList(): BelongsTo
    {
        return $this->belongsTo(GiftList::class);
    }

    public function multipleIdeas(): HasMany
    {
        return $this->hasMany(MultipleIdea::class, 'idea_id');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'list_id',
        'user_id',
        'user_name',
        'idea',
        'brand',
        'link',
        'details',
        'price',
        'favorite',
        'is_multiple',
        'promo',
        'promo_price',
        'promo_end_date',
        'status',
        'status_user',
        'status_user_id',
        'status_guest_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * status_guest_token is a server-side-only secret used to recognise a guest's own reservation/purchase.
     * It must never reach the browser, or any guest could read another's token and impersonate them.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'status_guest_token',
    ];

    // A decimal column is read as a string: cast it so the front can add prices up.
    protected $casts = [
        'price' => 'float',
        'promo_price' => 'float',
        'paid_price' => 'float',
        'taken_at' => 'datetime',
    ];

    // Promo end dates are typed by French users: the last day ends at midnight Paris time.
    private const PROMO_TIMEZONE = 'Europe/Paris';

    /**
     * The price a buyer pays today: the promo price while the promo runs, the regular price otherwise.
     */
    public function currentPrice(): ?float
    {
        $promoRuns = $this->promo
            && $this->promo_price > 0
            && (! $this->promo_end_date || $this->promo_end_date >= today(self::PROMO_TIMEZONE)->toDateString());

        return $promoRuns ? $this->promo_price : $this->price;
    }
}
