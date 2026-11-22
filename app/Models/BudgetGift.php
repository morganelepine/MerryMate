<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetGift extends Model
{
    use HasFactory;

    public const STATUSES = ['idea', 'purchased'];

    // Sanity bounds for the budget's year, typed in URLs and forms.
    public const MIN_YEAR = 2000;
    public const MAX_YEAR = 2100;

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
