<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentTour extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'booking_id',
        'payment_id',
        'payer_id',
        'status',
        'amount',
        'currency',
        'paypal_response',
    ];

    protected $casts = [
        'paypal_response' => 'array',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function bookingTour() {
        return $this->belongsTo(BookingTour::class, 'booking_id');
    }
}
