<?php

namespace App\Models;

use Filament\Tables\Columns\Summarizers\Concerns\BelongsToColumn;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tour extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_kz',
        'name_en',
        'description_kz',
        'description_en',
        'user_id',
        'location_id',
        'price',
        'volume',
        'date',
        'image',
        'featured'
    ];

    public function location(){
        return $this->belongsTo(Location::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function bookingTours()
    {
        return $this->hasMany(BookingTour::class);
    }

    public function images()
    {
        return $this->hasMany(TourImage::class);
    }

    public function favoriteTours(){
        return $this->belongsToMany(User::class, 'favorite_tours', 'tour_id', 'user_id');
    }

    public function decreaseVolume(int $seats): void
    {
        if ($this->volume < $seats) {
            throw new \Exception('Недостаточно мест для уменьшения.');
        }

        $this->volume -= $seats;
        $this->save();
    }

    public function increaseVolume(int $seats): void
    {
        $this->volume += $seats;
        $this->save();
    }

    public function reviews(){
        return $this->hasMany(Review::class);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }


}
