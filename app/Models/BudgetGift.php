<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetGift extends Model
{
    use HasFactory;

    public const STATUSES = ['idea', 'purchased'];

    protected $fillable = [
        'budget_recipient_id',
        'year',
        'title',
        'price',
        'status',
        'occasion',
    ];

    // A decimal column is read as a string: cast it so the front can add prices up.
    protected $casts = [
        'year' => 'integer',
        'price' => 'float',
    ];

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(BudgetRecipient::class, 'budget_recipient_id');
    }
}
