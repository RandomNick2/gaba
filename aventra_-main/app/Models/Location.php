<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_kz',
        'name_en',
        'city_id',
    ];

    public function city(){
        return $this->belongsTo(City::class);
    }

    public function tours(){
        return $this->hasMany(Tour::class,'location_id');
    }

    public function posts(){
        return $this->hasMany(Post::class);
    }
}
