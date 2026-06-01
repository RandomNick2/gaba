<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $query = Comment::query()->with('user'); // Пікірмен бірге авторды да жүктеу

        if ($request->filled('post_id')) {
            $query->where('post_id', $request->input('post_id'));
        }

        $comments = $query->latest()->get(); // Ең жаңа пікірлерді бірінші көрсету

        return response()->json($comments);
    }
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'post_id' => $request->post_id,
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        return response()->json([
            'message' => 'Комментарий успешно добавлен',
            'comment' => $comment->load('user')
        ]);
    }

    // Удалить комментарий
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== auth()->id()) {
            return response()->json(['message' => 'Недостаточно прав'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Комментарий удалён']);
    }
}

