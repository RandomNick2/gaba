<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavoriteTour extends Model
{
    use HasFactory;

//    protected $fillable = ['user_id', 'tour_id'];
//
//    // Отношение с пользователем
//    public function user()
//    {
//        return $this->belongsTo(User::class);
//    }
//
//    // Отношение с туром
//    public function tour()
//    {
//        return $this->belongsTo(Tour::class);
//    }
}
