<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Tour;
use Illuminate\Http\Request;

class LocationController extends Controller
{

    public function index(Request $request)
    {
        $locations = Location::with('city')->get();
        return response()->json($locations, 200);
    }


    public function create()
    {

    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city_id' => 'required|exists:cities,id',
        ]);

        $location = Location::create($validated);
        return response()->json($location, 201);
    }


    public function show(string $id)
    {
        //
    }


    public function edit(string $id)
    {

    }


    public function update(Request $request, string $id)
    {
        $location = Location::find($id);

        if(!$location){
            return response()->json(['message' => 'Location not found'],404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city_id' => 'required|exists:cities,id',
        ]);

        $location = Location::updated($validated);
        return response()->json($location, 200);
    }


    public function destroy(string $id)
    {
        $location = Location::find($id);
        if(!$location){
            return response()->json(['message'=>'Location not found'], 404);
        }

        $location->delete();
        return response()->json(['message'=>'Location deleted successfully'], 200);
    }
}
