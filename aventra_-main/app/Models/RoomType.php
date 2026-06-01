<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    use HasFactory;


    protected $fillable = [
        'hotel_id',
        'name_kz',
        'name_en',
        'description_kz',
        'description_en',
        'price_per_night',
        'max_guests',
        'available_rooms',
        'image',
        'has_breakfast',
        'has_wifi',
        'has_tv',
        'has_air_conditioning'
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'max_guests' => 'integer',
        'available_rooms' => 'integer',
        'has_breakfast' => 'boolean',
        'has_wifi' => 'boolean',
        'has_tv' => 'boolean',
        'has_air_conditioning' => 'boolean'
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function bookingsHotel()
    {
        return $this->hasMany(BookingHotel::class);
    }

    public function getImageUrlAttributes()
    {
        return $this->image ? asset('storage/' . $this->image) : asset('images/default-room.jpg');
    }

    public function isAvailable($checkInDate, $checkOutDate)
    {
        // Получаем количество активных бронирований на указанные даты
        $activeBookings = BookingHotel::where('room_type_id', $this->id)
            ->where('status', '!=', 'cancelled')
            ->where(function($query) use ($checkInDate, $checkOutDate) {
                $query->whereBetween('check_in_date', [$checkInDate, $checkOutDate])
                    ->orWhereBetween('check_out_date', [$checkInDate, $checkOutDate]);
            })
            ->count();

        // Проверяем, есть ли еще свободные номера
        return $activeBookings < $this->available_rooms;
    }

    public function getAvailableRoomsCount($checkInDate, $checkOutDate)
    {
        // Получаем количество активных бронирований на указанные даты
        $activeBookings = BookingHotel::where('room_type_id', $this->id)
            ->where('status', '!=', 'cancelled')
            ->where(function($query) use ($checkInDate, $checkOutDate) {
                $query->whereBetween('check_in_date', [$checkInDate, $checkOutDate])
                    ->orWhereBetween('check_out_date', [$checkInDate, $checkOutDate]);
            })
            ->count();

        // Возвращаем количество свободных номеров
        return max(0, $this->available_rooms - $activeBookings);
    }

    public function getAmenitiesListAttributes()
    {
        $amenities = [];

        if ($this->has_breakfast) {
            $amenities[] = 'Завтрак включен';
        }
        if ($this->has_wifi) {
            $amenities[] = 'Wi-Fi';
        }
        if ($this->has_tv) {
            $amenities[] = 'Телевизор';
        }
        if ($this->has_air_conditioning) {
            $amenities[] = 'Кондиционер';
        }

        return $amenities;
    }
}
