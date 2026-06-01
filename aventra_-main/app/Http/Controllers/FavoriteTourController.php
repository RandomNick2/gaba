<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteTourController extends Controller
{
    public function store($tourId)
    {
        $user = Auth::user();
        $tour = Tour::findOrFail($tourId);

        // Добавляем тур в избранное
        $user->favoriteTours()->attach($tour->id);

        return back()->with('success', 'Тур добавлен в избранное!');
    }

    public function destroy($tourId)
    {
        $user = Auth::user();
        $tour = Tour::findOrFail($tourId);

        // Удаляем тур из избранного
        $user->favoriteTours()->detach($tour->id);

        return back()->with('success', 'Тур удален из избранного!');
    }
}
