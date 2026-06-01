<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentHotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'paypal_payment_id',
        'amount',
        'currency',
        'status',
        'payment_details'
    ];

    protected $casts = [
        'payment_details' => 'array',
        'amount' => 'decimal:2'
    ];

    public function booking()
    {
        return $this->belongsTo(BookingHotel::class);
    }

    public function roomType() // ✅ roomType қатынасы
        {
            return $this->belongsTo(RoomType::class); // RoomType моделін импорттау керек
        }


}
