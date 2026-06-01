<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    public function store($postId)
    {
        $user = Auth::user();

        $like = Like::firstOrCreate([
            'user_id' => $user->id,
            'post_id' => $postId
        ]);

        return response()->json(['message' => 'Post liked.']);
    }

    public function destroy($postId)
    {
        $user = Auth::user();

        Like::where('user_id', $user->id)
            ->where('post_id', $postId)
            ->delete();

        return response()->json(['message' => 'Post unliked.']);
    }
}
