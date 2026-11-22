<?php

namespace App\Models;

use App\Models\Concerns\TracksTakenAt;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultipleIdea extends Model
{
    use HasFactory;
    use TracksTakenAt;

    public function idea()
    {
        return $this->belongsTo(Idea::class, 'idea_id');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'idea_id',
        'status',
        'status_user',
        'status_user_id',
        'status_guest_token',
        'choice',
        'paid_price',
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

    protected $casts = [
        'paid_price' => 'float',
        'taken_at' => 'datetime',
    ];
}
