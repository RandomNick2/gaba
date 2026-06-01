<?php

namespace App\Http\Controllers;

// use App\Models\Booking;
use App\Models\BookingTour;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    // API-дан қолданушының тур брондауларының тізімін алу
    public function index()
    {
        $bookings = BookingTour::with('tour') // Booking орнына BookingTour
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'bookings' => $bookings
        ]);
    }

    // Тур брондау формасы үшін деректерді дайындау (фронтэндке JSON қайтарады)
    public function tourCreate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tour_id' => 'required|exists:tours,id',
            'seats' => 'nullable|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Некорректные данные запроса.', 'errors' => $validator->errors()], 422);
        }

        $tour = Tour::with(['location', 'user', 'images'])->findOrFail($request->tour_id);
        $seats = $request->seats ?? 1;

        return response()->json([
            'success' => true,
            'tour' => $tour,
            'seats' => $seats
        ]);
    }


    public function store(Request $request)
    {
        Log::info('BookingController@store for Tour called', ['request_payload' => $request->all()]);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'tour_id' => 'required|exists:tours,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'guests_count' => 'required|integer|min:1',
            'notes' => 'nullable|string',
            'total_price' => 'required|numeric|min:0',
            'status' => 'nullable|string|in:pending,confirmed,cancelled,completed,failed',
        ]);

        if ($validator->fails()) {
            Log::error('Tour booking validation failed', ['errors' => $validator->errors()]);
            return response()->json(['success' => false, 'message' => 'Валидация қатесі.', 'errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        // user_id сұраудағы user_id-мен сәйкес келетінін тексереді, қауіпсіздік үшін
        if (!$user || $user->id != $request->user_id) {
            return response()->json(['success' => false, 'message' => 'Сіз кірмегенсіз немесе рұқсатыңыз жоқ.'], 401);
        }

        try {
            DB::beginTransaction();

            $tour = Tour::findOrFail($request->tour_id);

            // Қолжетімді орын тексеру
            $activeBookedSeats = BookingTour::where('tour_id', $tour->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where('booking_date', $request->booking_date)
                ->sum('guests_count');

            $availableSeats = $tour->volume - $activeBookedSeats;

            if ($availableSeats < $request->guests_count) {
                DB::rollBack();
                return response()->json(['success' => false, 'message' => 'Бұл турда жеткілікті орын жоқ немесе бұл күнге орындар толған.'], 400);
            }

            // Бағаны бэкэндте қайта есептеу және фронтэндпен сәйкестігін тексеру
            $calculatedPrice = $tour->price * $request->guests_count;
            if (abs($calculatedPrice - $request->total_price) > 0.01) {
                Log::warning('Frontend total price mismatch for tour booking', [
                    'frontend_price' => $request->total_price,
                    'calculated_price' => $calculatedPrice,
                    'tour_id' => $tour->id,
                    'booking_date' => $request->booking_date
                ]);
                DB::rollBack();
                return response()->json(['success' => false, 'message' => 'Баға сәйкес келмейді. Қайта тексеріңіз.'], 400);
            }

            $expiresAt = now()->addMinutes(15);

            // Бронь жасау (BookingTour моделін қолданамыз)
            $booking = BookingTour::create([
                'user_id' => $user->id,
                'tour_id' => $tour->id,
                'booking_date' => $request->booking_date,
                'guests_count' => $request->guests_count,
                'notes' => $request->notes,
                'total_price' => $calculatedPrice,
                'status' => $request->status ?? 'pending',
                'payment_status' => 'unpaid',
                // 'expires_at' => now()->addMinutes(15), // Егер booking_tours кестесінде expires_at болса
            ]);

            // ✅ Турдың қолжетімді орындарын азайту
            // Егер `volume` турдың қолжетімді орындар саны болса және броньдалғанда азаюы керек болса
            $tour->decreaseVolume($request->guests_count);

            DB::commit();
            Log::info('Tour booking created successfully', ['booking_id' => $booking->id]);

            return response()->json([
                'success' => true,
                'message' => 'Брондау сәтті жасалды. Енді төлем жасаңыз.',
                'booking' => $booking // Фронтэндке брондау объектісін қайтарамыз
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating tour booking', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_payload' => $request->all()
            ]);
            return response()->json(['success' => false, 'message' => 'Брондау кезінде қате шықты. Қайтадан көріңіз.'], 500);
        }
    }

    // Тур брондауды жою (BookingTour моделін қолданамыз)
    public function destroy(BookingTour $booking) // Booking орнына BookingTour
    {
        if ($booking->user_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Бұл брондауды жоюға құқығыңыз жоқ.'], 403);
        }

        // ✅ Турдың қолжетімді орындарын арттыру, егер бронь жойылса
        // $booking->tour->increaseVolume($booking->guests_count); // Егер tour моделінде осындай әдіс болса

        $booking->delete();

        return response()->json([
            'success' => true,
            'message' => 'Брондау сәтті жойылды.'
        ]);
    }

    // Қолданушының тур брондауларын алу (BookingTour моделін қолданамыз)
    public function userBookings()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Сіз кірмегенсіз.'], 401);
        }

        $bookings = BookingTour::with('tour') // Booking орнына BookingTour
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'bookings' => $bookings
        ]);
    }

    // Тур брондау деталын көрсету
    public function show(BookingTour $booking)
    {
        if ($booking->user_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Бұл брондауды көруге құқығыңыз жоқ.'], 403);
        }
        $booking->load('tour.location', 'tour.user'); // Қатынастарды жүктеу
        return response()->json(['success' => true, 'booking' => $booking], 200);
    }
}
