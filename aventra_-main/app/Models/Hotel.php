<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'category',
        'address_kz',
        'address_en',
        'city_id',
        'country',
        'description_kz',
        'description_en',
        'stars',
        'rating',
        'price_per_night',
        'phone',
        'email',
        'website',
        'image',
        'is_active',
    ];

    /**
     * Атрибуты, которые должны быть приведены к определенным типам.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'stars' => 'integer',
        'rating' => 'decimal:1',
        'price_per_night' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function amenities(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Amenity::class);
    }

    public function roomTypes()
    {
        return $this->hasMany(RoomType::class);
    }

    public function bookingsHotel()
    {
        return $this->hasMany(BookingHotel::class);
    }

    public function city(){
        return $this->belongsTo(City::class);
    }

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : asset('images/default-hotel.jpg');
    }

}
