<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth; // Auth импорттау

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'location', 'images'])->latest()->get();

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $request->validate([
            // 'title' бағаны фронттан келгендіктен, оны да қосу керек

            'content' => 'nullable|string',
            'location_id' => 'required|exists:locations,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048', // ✅ image бағаны, бір файл
            // 'images.*' және 'images' массивтерін алып тастадық
        ]);

        $post = Post::create([
            'user_id' => Auth::id(),
            'location_id' => $request->location_id,

            'content' => $request->content,
        ]);

        // Суретті жүктеу логикасы (тек бір сурет үшін)
        if ($request->hasFile('image')) { // 'image' кілтін тексереміз
            $imagePath = $request->file('image')->store('posts', 'public'); // Суреттерді 'posts' қалтасына сақтау
            $post->image = $imagePath; // Post моделінде image бағаны болса, осыған сақтау
            $post->save(); // Өзгерістерді сақтау
        }
        // Егер Post моделінде images() қатынасы бар болса және сіз images кестесіне сақтағыңыз келсе, осыны қолданыңыз:
        // if ($request->hasFile('image')) {
        //     $imagePath = $request->file('image')->store('post_images', 'public');
        //     $post->images()->create(['image_path' => $imagePath]);
        // }


        return response()->json(['message' => 'Пост успешно создан', 'post' => $post->load('images')], 201);
    }

    public function show($id)
    {
        // ... show әдісі
        $post = Post::with(['user', 'location', 'images', 'comments.user', 'likes'])->findOrFail($id);

        return response()->json([
            $post,
            'likes_count' => $post->likes()->count(),
            'liked_by_user' => Auth::check() ? $post->isLikedBy(Auth::user()) : false, // Auth::user() қолданыңыз
        ]);
    }


    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) { // Auth::id() қолданыңыз
            return response()->json(['message' => 'Недостаточно прав'], 403);
        }

        $request->validate([
            'content' => 'nullable|string',
            'location_id' => 'exists:locations,id',
            // 'images.*' => 'image|max:2048', // Егер бірнеше сурет болса
            // 'images' => 'array|max:10', // Егер бірнеше сурет болса
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048', // ✅ image бағаны, бір файл
        ]);

        $post->update([
            'content' => $request->content,
            'location_id' => $request->location_id ?? $post->location_id,
            // 'image' бағанын жаңартуды қосыңыз
        ]);

        if ($request->hasFile('image')) { // 'image' кілтін тексереміз
            // Ескі суретті жою (егер Post моделінде image бағаны болса)
            if ($post->image && Storage::disk('public')->exists($post->image)) {
                Storage::disk('public')->delete($post->image);
            }
            $imagePath = $request->file('image')->store('posts', 'public');
            $post->image = $imagePath;
            $post->save();
        }

        return response()->json(['message' => 'Пост обновлён', 'post' => $post->load('images')]);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) { // Auth::id() қолданыңыз
            return response()->json(['message' => 'Недостаточно прав'], 403);
        }

        // Суретті жою (егер Post моделінде image бағаны болса)
        if ($post->image && Storage::disk('public')->exists($post->image)) {
            Storage::disk('public')->delete($post->image);
        }
        $post->delete();

        // Егер images() қатынасы бар болса және оның суреттерін жою керек болса:
        // foreach ($post->images as $image) {
        //     Storage::disk('public')->delete($image->image_path);
        //     $image->delete();
        // }

        return response()->json(['message' => 'Пост удалён']);
    }
}
