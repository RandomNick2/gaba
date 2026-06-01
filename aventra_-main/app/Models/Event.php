<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'city_id',
        'event_type_id',
        'title_kz',
        'title_en',
        'description_kz',
        'description_en',
        'start_date',
        'end_date',
        'location_name_kz',
        'location_name_en',
        'address_kz',
        'address_en',
        'latitude',
        'longitude',
        'price_info',
        'organizer',
        'phone',
        'email',
        'website',
        'image',
        'video_url',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    // Қатынастар
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class); // Егер City моделіңіз болса
    }

    public function eventType()
    {
        return $this->belongsTo(EventType::class);
    }
}
