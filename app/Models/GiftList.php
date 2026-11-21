<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Crypt;

class GiftList extends Model
{
    use HasFactory;

    // A list can only belong to one user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // A list can contain several ideas
    public function ideas(): HasMany
    {
        return $this->hasMany(Idea::class, 'list_id');
    }

    // Each list can be followed by several users and each user can follow several lists
    public function followers()
    {
        return $this->belongsToMany(User::class, 'followed_lists')->withPivot('private_code');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'user_name',
        'name',
        'private_code',
        'isPrivate',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'private_code',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        // @TODO create a custom cast class for encrypting private code (or apply a new function to hash the private code)
    ];

    // Legacy codes were stored in plaintext; encrypted ones are much longer.
    public static function decryptPrivateCode(string $privateCode): string
    {
        return strlen($privateCode) > 20 ? Crypt::decrypt($privateCode) : $privateCode;
    }

    // Only call this for the list owner: the code is hidden from serialization otherwise.
    public function revealPrivateCode(): static
    {
        $this->private_code = self::decryptPrivateCode($this->private_code);

        return $this->makeVisible('private_code');
    }
}
