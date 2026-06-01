<?php

namespace App\Http\Controllers;

use App\Models\BookingHotel;
use App\Models\PaymentHotel;
use Illuminate\Http\Request;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\ProductionEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest; // OrdersCaptureRequest импорттауды ұмытпаңыз
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use PayPalCheckoutSdk\Core\SandboxEnvironment;

class PaymentHotelController extends Controller
{
    private $client;
    private $environment;

    public function __construct()
        {
            $mode = config('services.paypal.mode');
            if ($mode === 'live') {
                $this->environment = new ProductionEnvironment(
                    config('services.paypal.client_id'),
                    config('services.paypal.secret')
                );
            } else {
                // ✅ SandboxEnvironment класының қолданылуы
                $this->environment = new SandboxEnvironment(
                    config('services.paypal.client_id'),
                    config('services.paypal.secret')
                );
            }
            $this->client = new PayPalHttpClient($this->environment);
            Log::info("PayPal client initialized in {$mode} mode");
        }


    // create әдісі PayPal-дың "Smart Button"-дарында қолданылмауы мүмкін,
    // себебі createOrder фронтэндте жасалады
    // Алайда, егер сіз бұл маршрутты бэкэндтен заказ құру үшін пайдалансаңыз, ол қалады.
    public function create(BookingHotel $booking)
    {
        try {
            Log::info('Creating payment for booking', [
                'booking_id' => $booking->id,
                'total_price' => $booking->total_price,
                'amount_in_usd' => round($booking->total_price / 450, 2)
            ]);

            $request = new OrdersCreateRequest();
            $request->prefer('return=representation');

            $request->body = [
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'amount' => [
                        'currency_code' => 'USD',
                        'value' => round($booking->total_price / 450, 2)
                    ],
                    'description' => "Бронирование номера {$booking->roomType->name_en} в отеле {$booking->hotel->name}" // ✅ name_en қолдану, өйткені PayPal ағылшыншаны жақсы көреді
                ]],
                'application_context' => [
                    // PayPalButtons қолданылғанда бұл URL-дар әдетте қолданылмайды
                    'cancel_url' => route('bookings.show', $booking),
                    'return_url' => route('payments.success', ['booking' => $booking->id, 'token' => '{token}'])
                ]
            ];

            Log::info('PayPal create order request body', [
                'request_body' => json_encode($request->body)
            ]);

            $response = $this->client->execute($request);

            Log::info('PayPal create order response', [
                'status' => $response->statusCode,
                'id' => $response->result->id,
                'links' => json_encode($response->result->links)
            ]);

            // Егер бұл create әдісі бэкэндтен шақырылып, кейін PayPal-ға бағыттау үшін қолданылса
            foreach ($response->result->links as $link) {
                if ($link->rel === 'approve') {
                    // Бұл жерде тек JSON жауабын қайтару керек, фронтэнд оны пайдаланады
                    // redirect($link->href); // Бұл тек бэкэнд редиректі үшін
                    return response()->json([
                        'orderID' => $response->result->id,
                        'approveURL' => $link->href
                    ]);
                }
            }

            Log::error('No approval URL found in PayPal response from create method', [
                'response' => json_encode($response->result)
            ]);

            return response()->json(['error' => 'No approval URL from PayPal'], 500); // ✅ JSON жауап

        } catch (\Exception $e) {
            Log::error('Payment creation error (create method)', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'booking_id' => $booking->id
            ]);

            $errorMessage = 'Ошибка при создании платежа. Пожалуйста, попробуйте позже или используйте другой способ оплаты.';

            if (strpos($e->getMessage(), 'INSTRUMENT_DECLINED') !== false) {
                $errorMessage = 'Ошибка при обработке платежа. Пожалуйста, убедитесь, что ваша карта активна и имеет достаточный баланс. Также проверьте, что карта поддерживает международные платежи.';
            } elseif (strpos($e->getMessage(), 'PAYER_ACTION_REQUIRED') !== false) {
                $errorMessage = 'Требуется дополнительное подтверждение от вашего банка. Пожалуйста, проверьте вашу карту.';
            } elseif (strpos($e->getMessage(), 'PAYMENT_DENIED') !== false) {
                $errorMessage = 'Платеж был отклонен. Пожалуйста, проверьте данные вашей карты.';
            }

            return response()->json(['error' => $errorMessage], 500); // ✅ JSON жауап
        }
    }

    // success әдісі PayPal-дың return_url арқылы шақырғанда жұмыс істейді.
    // PayPalButtons қолданғанда, бұл әдіс әдетте қолданылмайды.
    public function success(Request $request, BookingHotel $booking)
    {
        Log::info('Old success method called (likely from a direct redirect)', [
            'booking_id' => $booking->id,
            'token' => $request->token,
        ]);
        // Бұл жерде бұрынғы логиканы қалдыра аласыз,
        // бірақ назарды handleFrontendPaymentSuccess әдісіне аудару керек.
        return redirect()->route('bookings.show', $booking)
            ->with('info', 'Төлемді растау процесі аяқталды. Мәліметтерді тексеріңіз.');
    }

    public function handleFrontendPaymentSuccess(Request $request, BookingHotel $booking)
        {
            Log::info('Handle Frontend Payment Success method called', [
                'booking_id' => $booking->id,
                'paypal_order_id' => $request->paypal_order_id,
                'payer_id' => $request->payer_id,
                'request_details' => json_encode($request->all()) // Толық сұрау деректерін логқа жазу
            ]);

            try {
                // Броньның статусын тексеру (қайта төлеудің алдын алу)
                if ($booking->payment_status === 'paid' || $booking->status === 'confirmed') {
                    Log::warning('Attempt to pay an already paid/confirmed booking via frontend handler', [
                        'booking_id' => $booking->id
                    ]);
                    return response()->json(['success' => false, 'message' => 'Оплата уже была произведена или бронирование подтверждено.'], 409);
                }

                // PayPal-дан келген соманы алу
                $paypalAmount = $request->payment_details['purchase_units'][0]['amount']['value'] ?? null;
                if (is_null($paypalAmount)) {
                    Log::error('PayPal amount not found in payment_details', ['request_details' => json_encode($request->all())]);
                    throw new \Exception('PayPal amount not found in payment details.');
                }

                DB::transaction(function () use ($booking, $request, $paypalAmount) {
                    $payment = PaymentHotel::create([
                        'booking_id' => $booking->id,
                        'paypal_payment_id' => $request->paypal_order_id,
                        'amount' => $paypalAmount, // ✅ PayPal-дан келген нақты USD сомасын сақтау
                        'currency' => 'USD', // ✅ PayPal валютасын сақтау
                        'status' => 'paid',
                        'payment_details' => json_encode($request->payment_details)
                    ]);

                    $booking->update([
                        'status' => 'confirmed',
                        'payment_status' => 'paid'
                    ]);

                    Log::info('Payment completed successfully via frontend handler', [
                        'booking_id' => $booking->id,
                        'payment_id' => $payment->id,
                        'paypal_order_id' => $request->paypal_order_id,
                        'captured_amount_usd' => $paypalAmount
                    ]);
                });

                return response()->json(['success' => true, 'message' => 'Оплата прошла успешно! Бронирование подтверждено.']);

            } catch (\Throwable $e) { // ✅ \Throwable қолданамыз, себебі бұл барлық қателерді (Exception және Error) қабылдайды
                Log::error('Payment processing error (frontend handler)', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'booking_id' => $booking->id,
                    'request_payload' => json_encode($request->all()) // Қате кезінде payload-ты да логқа жазу
                ]);

                // Төлем сәтсіз болса, бронь статусын жаңарту (егер әлі pending болса)
                if ($booking->status === 'pending') {
                    $booking->update([
                        'status' => 'payment_failed',
                        'payment_status' => 'failed'
                    ]);
                }

                $errorMessage = 'Ошибка при обработке платежа. Пожалуйста, свяжитесь с поддержкой.';
                if (strpos($e->getMessage(), 'SQLSTATE') !== false) {
                     $errorMessage = 'Ошибка базы данных при сохранении платежа. Пожалуйста, сообщите об этом администратору.';
                }

                return response()->json(['success' => false, 'message' => $errorMessage], 500);
            }
        }

    public function userBookings($userId): JsonResponse
        {
            $user = Auth::user();

            if (!$user || $user->id != $userId) {
                Log::warning('Unauthorized attempt to view hotel bookings', ['user_id' => $user ? $user->id : 'guest', 'requested_user_id' => $userId]);
                return response()->json(['message' => 'Unauthorized or User ID mismatch.'], 403);
            }

            try {
                // ✅ 'room' орнына 'roomType' қатынасын жүктеу
                // Hotel моделінің ішінде 'location' қатынасы бар болса, оны да жүктеу
                $bookings = BookingHotel::with([
                        'hotel.location', // Отельдің локациясын жүктеу
                        'roomType',       // ✅ room орнына roomType қатынасын жүктеу
                    ])
                    ->where('user_id', $user->id)
                    ->latest()
                    ->get(); // ✅ paginate(10) орнына get()

                Log::info('Fetched hotel bookings successfully', ['user_id' => $userId, 'booking_count' => $bookings->count()]);
                return response()->json(['bookings' => $bookings], 200);

            } catch (\Exception $e) {
                Log::error('Error fetching user hotel bookings', [
                    'user_id' => $userId,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json(['message' => 'Failed to load hotel bookings.', 'details' => $e->getMessage()], 500);
            }
        }

    public function userPaidTours()
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $bookings = BookingTour::where('user_id', $userId)
            ->whereIn('status', ['paid', 'confirmed']) // ✅ тек төленгендер
            ->with(['tour', 'tour.location'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'bookings' => $bookings,
        ]);
    }

    public function cancel(BookingHotel $booking)
    {
        Log::info('Payment cancelled for booking: ' . $booking->id);
        return redirect()
            ->route('bookings.show', $booking)
            ->with('error', 'Оплата отменена');
    }
}
