<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasRoles, HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'phone',
        'role'
    ];

    public function canAccessFilament(): bool
    {
        return in_array($this->role, ['admin', 'moderator', 'guide']);
    }

    public function tours(){
        return $this -> hasMany(Tour::class, 'user_id');
    }

    public function bookings(){
        return $this->hasMany(Booking::class);
    }

    public function bookingHotels(){
        return $this->hasMany(BookingHotel::class);
    }

    public function reviews(){
        return $this->hasMany(Review::class);
    }

    public function posts(){
        return $this->hasMany(Post::class);
    }

    public function comments(){
        return $this->hasMany(Comment::class);
    }

    public function favoriteTours(){
        return $this->belongsToMany(Tour::class, 'favorite_tours', 'user_id', 'tour_id');
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function paymentsTours(){
        return $this->hasMany(PaymentTour::class);
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isModerator(): bool
    {
        return $this->role === 'moderator';
    }

    public function isGuide(): bool
    {
        return $this->role === 'guide';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }


    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
