<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{

    public function index()
    {
        $cities = City::all();
        return response()->json($cities, 200);
    }


    public function create()
    {
        //
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'img' => 'required|string',
            'description' => 'required|string',
            'city_code' => 'required|max:3'
        ]);

        $city = City::create($validated);
        return response()->json($city,201);
    }


    public function show(string $id)
    {
        $city = City::find($id);
        if(!$city){
            return response()->json(['message' => 'City not found'], 404);
        }
        return response()->json($city,200);
    }


    public function edit(string $id)
    {
        //
    }


    public function update(Request $request, string $id)
    {
        $city = City::find($id);;

        if(!$city){
            return response()->json(['message' => 'City not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'img' => 'required|string',
            'description' => 'required|string',
            'city_code' => 'required|max:4'
        ]);

        $city->update($validated);
        return response()->json($city,200);
    }


    public function destroy(string $id)
    {
        $city = City::find($id);
        if (!$city){
            return response()->json(['message' => 'City not found'], 404);
        }

        $city->delete();
        return response()->json(['message' => 'City deleted successfully'],404);
    }
}
