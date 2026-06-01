// <?php
//
// use App\Http\Controllers\BookingController;
// use App\Http\Controllers\BookingHotelController;
// use App\Http\Controllers\CityController;
// use App\Http\Controllers\CommentController;
// use App\Http\Controllers\HotelController;
// use App\Http\Controllers\LangController;
// use App\Http\Controllers\LocationController;
// use App\Http\Controllers\PaymentHotelController;
// use App\Http\Controllers\PaymentTourController;
// use App\Http\Controllers\PostController;
// use App\Http\Controllers\ProfileController;
// use App\Http\Controllers\TourController;
// use App\Http\Controllers\TourWebController;
// use App\Http\Controllers\Api\PlaceController;
// use Illuminate\Foundation\Auth\EmailVerificationRequest;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\EventController;
// // use App\Http\Controllers\Api\AIChatController;
//
// Route::middleware(['auth'])->group(function () {
//    Route::get('/email/verify', function () {
//        return view('auth.verify-email');
//    })->name('verification.notice');
//
//    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
//        $request->fulfill();
//        return redirect('/admin');
//    })->middleware(['auth', 'signed', 'throttle:6,1'])->name('verification.verify');
//
//    Route::post('/email/verification-notification', function () {
//        request()->user()->sendEmailVerificationNotification();
//        return back()->with('message', 'Verification link sent!');
//    })->middleware(['auth', 'throttle:6,1'])->name('verification.send');
// });
//
// Auth::routes();
//
// Route::get('/lang/{lang}', [LangController::class, 'switchLang'])->name('switch.lang');
//
// Route::resource('cities', CityController::class);
// Route::resource('locations', LocationController::class);
// Route::resource('tours', TourController::class);
// Route::resource('hotels', HotelController::class);
// Route::get('/tours/featured', [TourController::class, 'featured']);
// // Route::get('/posts',[PostController::class,'index'])->name('posts.index');
// // Route::get('/posts/{id}',[PostController::class,'show'])->name('posts.show');
//
// // Route::post('/ai-chat', [AIChatController::class, 'handle']);
//
// Route::middleware(['auth'])->group(function () {
//
//     Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('profile.show');
//     Route::resource('posts', PostController::class);
//     Route::post('/comments', [CommentController::class, 'store']);
//     Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
//     Route::get('/places', [PlaceController::class, 'index']);
//     Route::get('/places/{id}', [PlaceController::class, 'show']);
//     Route::apiResource('events', EventController::class)->only(['index', 'show']);
//
//
// // Routes for payment and booking Tour
//    Route::get('/paypal/pay/{booking}', [PaymentTourController::class, 'pay'])->name('paypal.pay');
//    Route::get('/paypal/success', [PaymentTourController::class, 'success'])->name('paypal.success');
//    Route::get('/paypal/cancel', [PaymentTourController::class, 'cancel'])->name('paypal.cancel');
//    Route::get('/bookings/tourCreate', [BookingController::class, 'tourCreate'])->name('bookingsTour.create');
//    Route::post('/bookings_tour', [BookingController::class, 'tourStore'])->name('bookingsTour.store');
//    Route::get('/booking_tours', [BookingController::class, 'index'])->name('bookingTour.index');
//    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');
//
// // Route for payment Tour
//     Route::get('/bookings', [BookingHotelController::class, 'index'])->name('bookings.index');//json
//     Route::get('/bookings/{booking}', [BookingHotelController::class, 'show'])->name('bookings.show');//json
//     Route::get('/bookings/user/{userId}', [BookingHotelController::class, 'userBookings'])->name('bookings.user');
//     Route::get('/bookings/hotel/{hotelId}', [BookingHotelController::class, 'hotelBookings'])->name('bookings.hotel');
//     Route::post('/bookings/{booking}/confirm', [BookingHotelController::class, 'confirm'])->name('bookings.confirm');
//     Route::post('/bookings/{booking}/cancel', [BookingHotelController::class, 'cancel'])->name('bookings.cancel');
//     Route::get('/bookings/step1', [BookingHotelController::class, 'step1'])->name('bookings.step1');
//     Route::get('/bookings/step2/{hotel}', [BookingHotelController::class, 'step2'])->name('bookings.step2');
//     Route::get('/hotels/{hotel}/book/{roomType}', [BookingHotelController::class, 'create'])->name('bookings.create');//json
//     Route::post('/bookings', [BookingHotelController::class, 'store'])->name('bookings.store');
//     Route::post('/bookings/check-availability', [BookingHotelController::class, 'checkAvailability'])->name('bookings.check-availability');
//     Route::post('/bookings/{booking}/pay', [BookingHotelController::class, 'pay'])->name('bookings.pay');
//     Route::get('/payment/{paymentId}/receipt', [PaymentTourController::class, 'getUserPayments'])->name('payment.receipt'); //түбіртек
//
// // Routes for payments Hotel
//    Route::get('/bookings/{booking}/pay', [PaymentHotelController::class, 'create'])->name('payments.create');
//    Route::get('/bookings/{booking}/pay/success', [PaymentHotelController::class, 'success'])->name('payments.success');
//    Route::get('/bookings/{booking}/pay/cancel', [PaymentHotelController::class, 'cancel'])->name('payments.cancel');
// });
//
//
//
//
// Route::get('/', function () {
//     return view('welcome');
// });
//
// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
//
//
//
//
//
//
