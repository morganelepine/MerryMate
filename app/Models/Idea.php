<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Idea extends Model
{
    use HasFactory;

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
        'promo_details',
        'membership',
        'membership_reduction',
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
}
