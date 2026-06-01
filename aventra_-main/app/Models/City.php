<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
    'name_kz',
    'name_en',
    'image',
    'description_kz',
    'description_en',
    'city_code'];

    public function locations(){
        return $this -> hasMany(Location::class,'city_id');
    }

    public function places(){
        return $this -> hasMany(Place::class, 'city_id');
    }

    public function hotels(){
        return $this->hasMany(Hotel::class, 'city');
    }

    public function events(){
        return $this->hasMany(Event::class, 'city_id');
    }

}
