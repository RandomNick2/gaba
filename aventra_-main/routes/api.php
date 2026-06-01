<?php

use App\Http\Controllers\Api\AIChatController;



use App\Http\Controllers\BookingHotelController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FavoriteTourController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PaymentHotelController;
use App\Http\Controllers\PaymentTourController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use App\Http\Controllers\Api\PlaceController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\TourController;

//AI Chat
Route::post('/ai-chat', [AIChatController::class, 'handle']);

//Login
Route::post('/login', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if ($user && Hash::check($request->password, $user->password)) {
        return response()->json([
            'token' => $user->createToken('API Token')->plainTextToken,
            'user_id' => $user->id, // ✅ ҚОЛДАНУШЫНЫҢ ID-ІН ҚАЙТАРУ
            'user_name' => $user->name, // Қажет болса, атауын да қайтаруға болады
            'user_email' => $user->email, // Қажет болса, email-ін де қайтаруға болады
            // 'user_role' => $user->role, // Қажет болса, ролін де қайтаруға болады
        ]);
    }

    return response()->json(['error' => 'Unauthorized'], 401);
})->name('login');


//Register
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

Route::post('/register', function (Request $request) {
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
    ]);

    return response()->json([
        'token' => $user->createToken('API Token')->plainTextToken
    ]);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user()->load('tours', 'bookings', 'favoriteTours', 'posts'); // 'posts' қосылды
});
Route::middleware('auth:sanctum')->get('/user/reviews', [ReviewController::class, 'userReviews'])->name('user.reviews');
Route::middleware('auth:sanctum')->post('/update-profile', [ProfileController::class, 'update'])->name('profile.update');

Route::middleware('auth:sanctum')->get('bookings/user/{id}', [BookingHotelController::class, 'userBookings']);
Route::middleware('auth:sanctum')->get('bookings_tours/user', [PaymentTourController::class, 'userPaidTours']);

//Routes which don't use auth
Route::apiResource('cities', CityController::class);
Route::apiResource('locations', LocationController::class);
Route::apiResource('tours', TourController::class);
Route::get('/tours_featured', [TourController::class, 'featured']); // top tours
Route::get('/posts',[PostController::class,'index'])->name('posts.index');
Route::get('/posts/{id}',[PostController::class,'show'])->name('posts.show');

Route::get('/places', [PlaceController::class, 'index']);
Route::get('/places/{id}', [PlaceController::class, 'show']);
Route::resource('hotels', HotelController::class);
Route::apiResource('events', EventController::class)->only(['index', 'show']);
Route::get('/comments', [CommentController::class, 'index'])->name('comments.index');


//Routes use auth
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');
    Route::get('/bookings/user', [BookingController::class, 'userBookings'])->name('bookings.user');

    Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('profile.show');

    Route::apiResource('reviews', ReviewController::class);
    Route::apiResource('favorites', FavoriteTourController::class);

    Route::post('/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    Route::post('/posts/{post}/like', [LikeController::class, 'store'])->name('posts.like');
    Route::delete('/posts/{post}/like', [LikeController::class, 'destroy'])->name('posts.unlike');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::delete('/post/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    Route::put('/post/{post}', [PostController::class, 'update'])->name('posts.update');


    Route::get('/bookings', [BookingHotelController::class, 'index'])->name('bookings.index');//json
    Route::get('/bookings/{booking}', [BookingHotelController::class, 'show'])->name('bookings.show');//json
    Route::get('/bookings/user/{userId}', [BookingHotelController::class, 'userBookings'])->name('bookingsHotel.user');
    Route::get('/bookings/hotel/{hotelId}', [BookingHotelController::class, 'hotelBookings'])->name('bookings.hotel');
    Route::post('/bookings/{booking}/confirm', [BookingHotelController::class, 'confirm'])->name('bookings.confirm');
    Route::post('/bookings/{booking}/cancel', [BookingHotelController::class, 'cancel'])->name('bookings.cancel');
    Route::get('/bookings/step1', [BookingHotelController::class, 'step1'])->name('bookings.step1');
    Route::get('/bookings/step2/{hotel}', [BookingHotelController::class, 'step2'])->name('bookings.step2');
    Route::get('/hotels/{hotel}/book/{roomType}', [BookingHotelController::class, 'create'])->name('bookings.create');//json
    Route::post('/bookings', [BookingHotelController::class, 'store'])->name('bookings.store');
    Route::post('/bookings/check-availability', [BookingHotelController::class, 'checkAvailability'])->name('bookings.check-availability');
    Route::post('/bookings/{booking}/pay', [BookingHotelController::class, 'pay'])->name('bookings.pay');

    // Маршруты для оплаты
    Route::get('/bookings/{booking}/pay', [PaymentHotelController::class, 'create'])->name('payments.create');
    Route::get('/bookings/{booking}/pay/success', [PaymentHotelController::class, 'success'])->name('payments.success');
    Route::get('/bookings/{booking}/pay/cancel', [PaymentHotelController::class, 'cancel'])->name('payments.cancel');
    Route::post('/bookings/{booking}/payment/success', [PaymentHotelController::class, 'handleFrontendPaymentSuccess']); // 👈 Бұл жол түсініктемеге алынған!

    Route::post('/bookings_tours', [BookingController::class, 'store'])->name('bookings.tour.store'); // Тур брондауды сақтау
    Route::get('/bookings_tours/user', [BookingController::class, 'userBookings'])->name('bookings.tour.user'); // Қолданушының тур брондаулары
    Route::get('/bookings_tours/{booking}', [BookingController::class, 'show'])->name('bookings.tour.show'); // Тур брондау деталын көрсету
    Route::delete('/bookings_tours/{booking}', [BookingController::class, 'destroy'])->name('bookings.tour.destroy'); // Тур брондауды жою

    // ✅ ТУР ТӨЛЕМ МАРШРУТЫ (PayPalButtons Frontend үшін)
    Route::post('/bookings_tours/{booking}/payment/success', [PaymentTourController::class, 'handleFrontendPaymentSuccess'])->name('payments.tour.success'); // Тур төлемі
    Route::get('/payment/{paymentId}/receipt', [PaymentTourController::class, 'generateReceipt'])->name('payment.receipt'); //түбіртек

    Route::get('/paypal/success/tour', [PaymentTourController::class, 'success'])->name('paypal.success.tour');
    Route::get('/paypal/cancel/tour', [PaymentTourController::class, 'cancel'])->name('paypal.cancel.tour');

Route::get('/payment/{paymentId}/receipt', [PaymentTourController::class, 'getUserPayments'])->name('payment.receipt');

//     //payments route for tour
//    Route::get('/paypal/pay/{booking}', [PaymentTourController::class, 'pay'])->name('paypal.pay');
//    Route::get('/paypal/success', [PaymentTourController::class, 'success'])->name('paypal.success');
//    Route::get('/paypal/cancel', [PaymentTourController::class, 'cancel'])->name('paypal.cancel');
//    Route::get('/bookings/tourCreate', [BookingController::class, 'tourCreate'])->name('bookingsTour.create');
//    Route::post('/bookings_tours', [BookingController::class, 'store'])->name('bookings.store');
//    Route::get('/booking_tours', [BookingController::class, 'index'])->name('bookingTour.index');
//    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');
//

});

