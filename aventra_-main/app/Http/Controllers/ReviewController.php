<?php

// app/Http/Controllers/ReviewController.php
namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'tour_id' => 'required|exists:tours,id', // Турдың бар екенін тексеру
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
        ]);

        $tour = Tour::findOrFail($request->tour_id);

        $review = new Review();
        $review->tour_id = $tour->id;
        $review->user_id = Auth::id();
        $review->rating = $request->rating;
        $review->content = $request->content;
        $review->save();

        // Жаңа пікірді оның авторымен бірге қайтару
        $review = Review::with('user')->findOrFail($review->id);

        return response()->json(['message' => 'Review added successfully', 'review' => $review], 200);
    }

    public function index($tourId)
    {
        $tour = Tour::findOrFail($tourId);
        $reviews = $tour->reviews()->with('user')->get();

        return response()->json($reviews);
    }

    public function userReviews(Request $request)
    {
        return Review::where('user_id', Auth::id())->with('tour')->get();
    }

    public function destroy(Review $review)
    {
        // Қолданушының бұл пікірді жоюға құқығы бар екенін тексеру (қажет болса)
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully'], 200);
    }
}
