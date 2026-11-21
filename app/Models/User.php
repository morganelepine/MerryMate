<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Passwords\CanResetPassword;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, CanResetPassword;

    // Un user peut créer plusieurs listes
    public function gift_lists(): HasMany
    {
        return $this->hasMany(GiftList::class);
    }

    // Un user peut créer plusieurs idées
    public function ideas(): HasMany
    {
        return $this->hasMany(Idea::class);
    }

    public function brandNotes(): HasMany
    {
        return $this->hasMany(BrandNote::class);
    }

    // Un user peut suivre plusieurs listes
    public function followed_lists(): HasMany
    {
        return $this->hasMany(FollowedList::class);
    }

    // Each user can follow several lists
    // and each list can be followed by several users
    public function followedLists()
    {
        return $this->belongsToMany(GiftList::class, 'followed_lists');
    }

    /**
     * The attributes that are mass assignable.
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Send a password reset notification to the user.
     * @param  string  $token
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token, $this));
    }
}
