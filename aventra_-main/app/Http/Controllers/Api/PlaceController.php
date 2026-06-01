<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    public function index()
    {
        return response()->json(Place::all());
    }

    public function show($id)
    {
        $place = Place::findOrFail($id);
        return response()->json($place);
    }
}
