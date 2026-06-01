<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BookingTour; // ✅ Booking орнына BookingTour
use App\Models\PaymentTour;
use Illuminate\Support\Facades\Auth;
use Srmklive\PayPal\Services\PayPal as PayPalClient; // Srmklive PayPalClient
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use PayPalCheckoutSdk\Core\SandboxEnvironment; // ✅ PayPal SDK импорты
use PayPalCheckoutSdk\Core\ProductionEnvironment; // ✅ PayPal SDK импорты
use PayPalCheckoutSdk\Core\PayPalHttpClient; // ✅ PayPal SDK импорты


class PaymentTourController extends Controller
{
    private $paypalClient; // Srmklive PayPalClient үшін
    private $httpClient;   // PayPalCheckoutSdk HttpClient үшін

    public function __construct()
    {
        // 1. Конфигурациядан режимді алу
                $mode = config('services.paypal.mode');
                // Режимге байланысты Client ID мен Secret-ті таңдау
                $clientId = config("services.paypal.{$mode}.client_id");
                $clientSecret = config("services.paypal.{$mode}.secret");

                // 2. PayPalCheckoutSdk HttpClient инициализациясы (қажет болса)
                if ($mode === 'live') {
                    $this->environment = new ProductionEnvironment($clientId, $clientSecret);
                } else {
                    $this->environment = new SandboxEnvironment($clientId, $clientSecret);
                }
                $this->httpClient = new PayPalHttpClient($this->environment);

                // 3. Srmklive PayPalClient инициализациясы
                // config('paypal') деген жерде Srmklive-ге арналған толық конфигурация болуы керек
                // немесе оны да осы жерде динамикалық беруге болады
                // config/paypal.php файлын да сәйкесінше жаңартыңыз, егер ол бөлек болса
                $srmkliveConfig = config('paypal'); // config/paypal.php файлын жүктейді
                $srmkliveConfig['mode'] = $mode; // режимді сәйкестендіру
                $srmkliveConfig[$mode]['client_id'] = $clientId; // client_id-ді жаңарту
                $srmkliveConfig[$mode]['client_secret'] = $clientSecret; // client_secret-ті жаңарту

                $this->paypalClient = new PayPalClient;
                $this->paypalClient->setApiCredentials($srmkliveConfig); // ✅ Жаңартылған конфигурацияны беру
                $this->paypalClient->getAccessToken();

                $this->middleware('auth:sanctum');
    }


    public function pay($bookingId)
    {
        Log::info('PaymentTourController@pay method called (deprecated for PayPalButtons)', ['booking_id' => $bookingId]);

        // Booking орнына BookingTour қолдану
        $booking = BookingTour::with('tour')
            ->where('id', $bookingId)
            ->where('user_id', Auth::id())
            ->where('status', 'pending')
            ->firstOrFail();

        $amount = $booking->total_price; // Броньнан келген жалпы бағаны қолданамыз (KZT)

        // PayPal-ға жіберу үшін USD-ға айырбастау
        $usdAmount = round($amount / config('paypal.exchange_rate_to_usd', 450), 2); // .env-ке exchange_rate_to_usd қосу

        try {
            $order = $this->paypalClient->createOrder([
                "intent" => "CAPTURE",
                "purchase_units" => [[
                    "amount" => [
                        "currency_code" => "USD", // config('paypal.currency', 'USD'),
                        "value" => number_format($usdAmount, 2, '.', '')
                    ],
                    "description" => "Бронирование тура: {$booking->tour->name_en} для {$booking->guests_count} человек"
                ]],
                "application_context" => [
                    "return_url" => route('paypal.success.tour'), // ✅ Жаңа маршрут атауы
                    "cancel_url" => route('paypal.cancel.tour'),   // ✅ Жаңа маршрут атауы
                ]
            ]);

            if (!isset($order['links']) || !is_array($order['links'])) {
                Log::error('PayPal createOrder response missing links', ['response' => $order]);
                return redirect()->route('bookings.tour.index')->with('error', 'Ошибка при создании платежа в PayPal.'); // ✅ bookings.tour.index
            }

            // Төлем жазбасы (статус pending)
            PaymentTour::create([
                'user_id' => Auth::id(),
                'booking_id' => $booking->id,
                'payment_id' => $order['id'], // PayPal Order ID
                'status' => 'pending',
                'amount' => $usdAmount, // USD сомасын сақтау
                'currency' => 'USD',
                'paypal_response' => $order,
            ]);

            // PayPal сілтемесіне бағыттау
            foreach ($order['links'] as $link) {
                if ($link['rel'] === 'approve') {
                    return redirect()->away($link['href']);
                }
            }

            return redirect()->route('bookings.tour.index')->with('error', 'PayPal сілтемесін жасау сәтсіз болды.');

        } catch (\Throwable $e) {
            Log::error('Error creating PayPal order (pay method)', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->route('bookings.tour.index')->with('error', 'Ошибка при создании платежа PayPal: ' . $e->getMessage());
        }
    }

    /**
     * Төлем сәтті болғанда (PayPal редирект арқылы) - бұл әдіс фронтэндте PayPalButtons қолданғанда сирек қолданылады
     */
    public function success(Request $request)
    {
        Log::info('PaymentTourController@success method called (deprecated for PayPalButtons)', ['token' => $request->token]);

        $paypal = new PayPalClient;
        $paypal->setApiCredentials(config('paypal'));
        $paypal->getAccessToken();

        try {
            $response = $paypal->capturePaymentOrder($request->token);

            if (!isset($response['status']) || $response['status'] !== 'COMPLETED') {
                return redirect()->route('bookings.tour.index')->with('error', 'Төлем сәтсіз аяқталды.');
            }

            // Төлемді табу
            $payment = PaymentTour::where('paypal_payment_id', $request->token)->first(); // payment_id өрісін paypal_payment_id деп атаған дұрыс
            if (!$payment) {
                // Егер token арқылы таба алмаса, ең соңғы pending төлемді табу
                $payment = PaymentTour::where('user_id', Auth::id())
                    ->where('status', 'pending')
                    ->latest()
                    ->first();
            }

            if ($payment) {
                DB::transaction(function () use ($payment, $response) {
                    $payment->update([
                        'status' => 'approved',
                        'payer_id' => $response['payer']['payer_id'] ?? null,
                        'paypal_response' => $response,
                    ]);

                    if ($payment->booking) { // PaymentTour моделіндегі booking қатынасы
                        $payment->booking->update([
                            'status' => 'confirmed',
                            'payment_status' => 'paid',
                        ]);
                        // $payment->booking->tour->decreaseVolume($payment->booking->guests_count); // Егер орынды азайту логикасы болса
                    }
                });
            } else {
                 Log::warning('Payment record not found for successful PayPal redirect for tour booking', ['token' => $request->token, 'paypal_response' => $response]);
            }

            return redirect()->route('bookings.tour.index')->with('success', 'Оплата сәтті аяқталды!');

        } catch (\Throwable $e) {
            Log::error('Error processing PayPal redirect success for tour booking', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->route('bookings.tour.index')->with('error', 'Ошибка при обработке успешной оплаты: ' . $e->getMessage());
        }
    }

    /**
     * Төлемнен бас тарту
     */
    public function cancel()
    {
        Log::info('PaymentTourController@cancel method called', ['user_id' => Auth::id()]);
        return redirect()->route('bookings.tour.index')->with('error', 'Сіз төлемнен бас тарттыңыз.');
    }

    // ✅ ЖАҢА ӘДІС: PayPalButtons-тан төлемнің сәтті аяқталғанын өңдеу
    public function handleFrontendPaymentSuccess(Request $request, BookingTour $booking) // ✅ Booking орнына BookingTour
    {
        Log::info('PaymentTourController@handleFrontendPaymentSuccess method called', [
            'booking_id' => $booking->id,
            'paypal_order_id' => $request->paypal_order_id,
            'payer_id' => $request->payer_id,
            'request_details' => json_encode($request->all())
        ]);

        try {
            // Броньның статусын тексеру (қайта төлеудің алдын алу)
            if ($booking->payment_status === 'paid' || $booking->status === 'confirmed') {
                Log::warning('Attempt to pay an already paid/confirmed tour booking via frontend handler', [
                    'booking_id' => $booking->id
                ]);
                return response()->json(['success' => false, 'message' => 'Оплата уже была произведена или бронирование подтверждено.'], 409);
            }

            // PayPal-дан келген соманы алу
            $paypalAmount = $request->payment_details['purchase_units'][0]['amount']['value'] ?? null;
            if (is_null($paypalAmount)) {
                Log::error('PayPal amount not found in payment_details for tour booking', ['request_details' => json_encode($request->all())]);
                throw new \Exception('PayPal amount not found in payment details.');
            }

            DB::transaction(function () use ($booking, $request, $paypalAmount) {
                // PaymentTour моделіне сақтау
                $payment = PaymentTour::create([
                    'user_id' => $booking->user_id, // ✅ user_id-ді BookingTour объектісінен алу
                    'booking_id' => $booking->id,
                    'payment_id' => $request->paypal_order_id, // payment_id өрісіне PayPal Order ID-ін сақтаймыз
                    'payer_id' => $request->payer_id,
                    'amount' => $paypalAmount,
                    'currency' => 'USD',
                    'status' => 'approved', // Төлем расталған соң 'approved'
                    'paypal_response' => $request->payment_details
                ]);

                // BookingTour статусын жаңарту
                $booking->update([
                    'status' => 'confirmed',
                    'payment_status' => 'paid'
                ]);

                // ✅ Турдың орындарын азайту (егер BookingController-де азайтылмаса)
                // Егер tour моделінде decreaseVolume әдісі болса:
                // if ($booking->tour) {
                //     $booking->tour->decreaseVolume($booking->guests_count);
                // }

                Log::info('Tour Payment completed successfully via frontend handler', [
                    'booking_id' => $booking->id,
                    'payment_id' => $payment->id,
                    'paypal_order_id' => $request->paypal_order_id,
                    'captured_amount_usd' => $paypalAmount
                ]);
            });

            return response()->json(['success' => true, 'message' => 'Оплата прошла успешно! Бронирование тура подтверждено.']);

        } catch (\Throwable $e) {
            Log::error('Tour Payment processing error (frontend handler)', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'booking_id' => $booking->id,
                'request_payload' => json_encode($request->all())
            ]);

            if ($booking->status === 'pending') { // Егер төлем сәтсіз болса, броньды "payment_failed" күйіне ауыстыру
                $booking->update([
                    'status' => 'payment_failed',
                    'payment_status' => 'failed'
                ]);
            }

            $errorMessage = 'Ошибка при обработке платежа за тур. Пожалуйста, свяжитесь с поддержкой.';
            if (strpos($e->getMessage(), 'SQLSTATE') !== false) {
                 $errorMessage = 'Ошибка базы данных при сохранении платежа за тур. Пожалуйста, сообщите об этом администратору.';
            }

            return response()->json(['success' => false, 'message' => $errorMessage], 500);
        }
    }


    public function getUserPayments(Request $request)
    {
        $user = Auth::user();

        // Проверяем, авторизован ли пользователь
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Пользователь не авторизован.'], 401);
        }

        // Получаем все успешные платежи пользователя
        $payments = PaymentTour::where('user_id', $user->id)
            ->where('status', 'approved')  // Учитываем только успешные платежи
            ->with(['bookingTour', 'bookingTour.tour'])  // Загружаем связанные бронь и тур
            ->get();

        // Формируем чек (или отчет) с данными
        $receipts = $payments->map(function ($payment) {
            return [
                'payment_id' => $payment->payment_id,
                'tour_name_kz' => $payment->bookingTour->tour->name_kz,
                'tour_name_en' => $payment->bookingTour->tour->name_en,
                'tour_date' => $payment->bookingTour->tour->date,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'payment_date' => $payment->created_at->format('Y-m-d H:i:s'),
                'status' => $payment->status,
            ];
        });

        return response()->json([
            'success' => true,
            'payments' => $receipts
        ]);
    }

}
