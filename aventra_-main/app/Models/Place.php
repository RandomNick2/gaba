<?php

namespace App\Models;
use App\Models\City;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use HasFactory;
    protected $casts = [
        'images' => 'array',
        'things_to_do' => 'array',
        'lat' => 'float',
        'lng' => 'float',
    ];

    public function getCoordinatesAttribute()
    {
        return [
            'lat' => $this->lat,
            'lng' => $this->lng,
        ];
    }

    public function setCoordinatesAttribute($value)
    {
        $this->lat = $value['lat'] ?? null;
        $this->lng = $value['lng'] ?? null;
    }
    // app/Models/Place.php

    protected $fillable = [
        'name_kz',
        'name_en',
        'city_id',
        'country',
        'description_kz',
        'description_en',
        'images',
        'things_to_do',
        'lat', // 👉 МІНДЕТТІ
        'lng', // 👉 МІНДЕТТІ
    ];



}
