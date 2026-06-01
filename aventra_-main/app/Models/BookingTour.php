<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingTour extends Model
{
    use HasFactory;

    protected $table = 'booking_tours'; // Кесте атын нақты көрсету, Laravel автоматты түрде 'booking_tours' деп табады, бірақ нақтылау артық емес.

    protected $fillable = [
        'user_id',
        'tour_id',
        'booking_date',
        'guests_count',
        'notes',
        'total_price',
        'status',
        'payment_deadline', // Егер сіздің кестеңізде бұл баған болса
        'payment_id',       // Егер сіздің кестеңізде бұл баған болса
        'payment_status',   // Егер сіздің кестеңізде бұл баған болса
    ];

    protected $casts = [
        'booking_date' => 'date', // Күндерді дұрыс өңдеу үшін
        'payment_deadline' => 'datetime', // Егер қолдансаңыз
    ];

    // Қатынастар
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }

    public function payment(){
            return $this->hasOne(PaymentTour::class);
    }

    // Статус жаңартылғанда is_paid өрісін де жаңарту логикасы (Booking моделіндегідей)
    public function setStatusAttribute($value)
    {
        $this->attributes['status'] = $value;
        $this->attributes['payment_status'] = ($value === 'confirmed') ? 'paid' : 'unpaid'; // Статусты автоматты түрде орнату
    }
}
