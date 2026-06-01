<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{

    public function show($id)
    {
        try {
            $user = User::with([
                'posts',
                'comments',
                'reviews.tour',
                'tours',
                'bookings.tour',
                'favoriteTours',
                'likes'
            ])->findOrFail($id);

            return response()->json($user);
        } catch (\Exception $e) {
            \Log::error('Ошибка профиля: '.$e->getMessage());
            return response()->json(['message' => 'Ошибка сервера'], 500);
        }
    }

    public function update(Request $request)
    {
        $user = Auth::user(); // Авторизацияланған пайдаланушыны алу

        $request->validate([
            'name' => 'string|max:255',
//            'email' => 'string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->filled('name')) {
            $user->name = $request->name;
        }
        if ($request->filled('email')) {
            $user->email = $request->email;
        }
        if ($request->filled('phone')) {
            $user->phone = $request->phone;
        }
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = '/storage/' . $path;
        }

        $user->save(); // Дерекқордағы өзгерістерді сақтау

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user], 200);
    }

    public function edit()
    {
        $user = Auth::user();
        return response()->json(['user' => $user], 200);
    }


}
