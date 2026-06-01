<?php

namespace App\Http\Controllers;

use App\Models\BookingHotel;
use App\Models\Hotel;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class BookingHotelWebController extends Controller
{
    /**
     * Отображает список всех бронирований
     */
    public function index()
    {
        $bookings = BookingHotel::where('user_id', auth()->id())
            ->where('status', '!=', 'cancelled')
            ->with(['hotel', 'roomType'])
            ->latest()
            ->paginate(10);
//        return response()->json(['bookings' => $bookings]);

       return view('bookings.index', compact('bookings'));
    }

    /**
     * Показывает форму создания нового бронирования
     */
    public function step1()
    {
        $hotels = Hotel::all();
//        return response()->json(['hotels' => $hotels]);

       return view('bookings.step1', compact('hotels'));
    }

    public function step2(Hotel $hotel)
    {
        $roomTypes = $hotel->roomTypes;
//        return response()->json([
//            'hotel' => $hotel,
//            'room_types' => $roomTypes
//        ]);

       return view('bookings.step2', compact('hotel', 'roomTypes'));
    }

    public function create(Hotel $hotel, RoomType $roomType)
    {
        if ($roomType->hotel_id !== $hotel->id) {
            abort(404);
        }
//        return response()->json([
//            'hotel' => $hotel,
//            'room_type' => $roomType,
//        ]);

       return view('bookings.create', compact('hotel', 'roomType'));
    }

    /**
     * Сохраняет новое бронирование
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'room_type_id' => 'required|exists:room_types,id',
            'check_in_date' => 'required|date|after:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'guests_count' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $hotel = Hotel::findOrFail($validated['hotel_id']);
        $roomType = RoomType::findOrFail($validated['room_type_id']);

        // Проверяем доступность номера
        if ($roomType->available_rooms <= 0) {
            return back()->with('error', 'К сожалению, этот тип номера больше не доступен.');
        }

        // Рассчитываем количество ночей
        $checkIn = Carbon::parse($validated['check_in_date']);
        $checkOut = Carbon::parse($validated['check_out_date']);
        $nightsCount = $checkIn->diffInDays($checkOut);

        // Рассчитываем общую стоимость
        $totalPrice = $roomType->price_per_night * $nightsCount;

        // Создаем бронирование
        $booking = new BookingHotel();
        $booking->user_id = auth()->id();
        $booking->hotel_id = $validated['hotel_id'];
        $booking->room_type_id = $validated['room_type_id'];
        $booking->check_in_date = $validated['check_in_date'];
        $booking->check_out_date = $validated['check_out_date'];
        $booking->guests_count = $validated['guests_count'];
        $booking->notes = $validated['notes'];
        $booking->status = 'pending';
        $booking->total_price = $totalPrice;
        $booking->save();

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Бронирование успешно создано! Ожидает оплаты.');
    }

    /**
     * Отображает информацию о конкретном бронировании
     */
    public function show(BookingHotel $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            abort(403);
        }

        $booking->load(['hotel', 'roomType', 'user']);
//        return response()->json([
//            'booking' => $booking,
//        ]);

       return view('bookings.show', compact('booking'));
    }

    /**
     * Показывает форму редактирования бронирования
     */
    public function edit(BookingHotel $booking)
    {
        if (!in_array($booking->status, ['pending'])) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'Можно редактировать только бронирования со статусом "Ожидает оплаты"');
        }

        $booking->load(['hotel', 'roomType']);
        $hotels = Hotel::all();
        $roomTypes = RoomType::where('hotel_id', $booking->hotel_id)->get();

        return view('bookings.edit', compact('booking', 'hotels', 'roomTypes'));
    }

    /**
     * Обновляет информацию о бронировании
     */
    public function update(Request $request, BookingHotel $booking)
    {
        if (!in_array($booking->status, ['pending'])) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'Можно редактировать только бронирования со статусом "Ожидает оплаты"');
        }

        $validator = Validator::make($request->all(), [
            'room_type_id' => 'required|exists:room_types,id',
            'check_in_date' => 'required|date|after:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'guests_count' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $roomType = RoomType::findOrFail($request->room_type_id);

        // Проверка доступности типа номера (исключая текущее бронирование)
        $isAvailable = BookingHotel::where('room_type_id', $roomType->id)
            ->where('id', '!=', $booking->id)
            ->where(function($query) use ($request) {
                $query->whereBetween('check_in_date', [$request->check_in_date, $request->check_out_date])
                    ->orWhereBetween('check_out_date', [$request->check_in_date, $request->check_out_date]);
            })
            ->where('status', '!=', 'cancelled')
            ->doesntExist();

        if (!$isAvailable) {
            return redirect()->back()
                ->with('error', 'Тип номера уже забронирован на выбранные даты')
                ->withInput();
        }

        $booking->room_type_id = $request->room_type_id;
        $booking->check_in_date = $request->check_in_date;
        $booking->check_out_date = $request->check_out_date;
        $booking->guests_count = $request->guests_count;
        $booking->total_price = $this->calculateTotalPrice($roomType, $request->check_in_date, $request->check_out_date);
        $booking->save();

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Бронирование успешно обновлено');
    }

    /**
     * Удаляет бронирование
     */
    public function destroy(BookingHotel $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            abort(403);
        }

        // Увеличиваем количество доступных номеров
        $roomType = $booking->roomType;
        $roomType->available_rooms += 1;
        $roomType->save();

        $booking->update(['status' => 'cancelled']);

        return redirect()->route('bookings.index')
            ->with('success', 'Бронирование успешно отменено.');
    }

    /**
     * Показывает бронирования конкретного пользователя
     */
    public function userBookings($userId)
    {
        $bookings = BookingHotel::where('user_id', $userId)
            ->with(['hotel', 'roomType','payments'])
            ->paginate(10);
//        return response()->json([
//            'booking' => $bookings,
//        ]);
        return view('bookings.user', compact('bookings'));
    }

    /**
     * Показывает бронирования конкретного отеля
     */
    public function hotelBookings($hotelId)
    {
        $bookings = BookingHotel::where('hotel_id', $hotelId)
            ->with(['user', 'room'])
            ->paginate(10);
        return view('bookings.hotel', compact('bookings'));
    }

    /**
     * Подтверждает бронирование
     */
    public function confirm(BookingHotel $booking)
    {
        if ($booking->user_id !== auth()->id()) {
            return back()->with('error', 'У вас нет прав для подтверждения этого бронирования');
        }

        if (!in_array($booking->status, ['pending']))  {
            return back()->with('error', 'Это бронирование уже не может быть подтверждено');
        }

        $booking->status = 'confirmed';
        $booking->save();

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Бронирование успешно подтверждено!');
    }

    /**
     * Отменяет бронирование
     */
    public function cancel(BookingHotel $booking)
    {
        \Log::info('Cancel booking request', [
            'booking_id' => $booking->id,
            'user_id' => auth()->id(),
            'booking_user_id' => $booking->user_id,
            'status' => $booking->status
        ]);

        if ($booking->user_id !== auth()->id()) {
            \Log::warning('Unauthorized cancel attempt', [
                'booking_id' => $booking->id,
                'user_id' => auth()->id(),
                'booking_user_id' => $booking->user_id
            ]);
            return back()->with('error', 'У вас нет прав для отмены этого бронирования');
        }

        // Проверяем, можно ли отменить бронирование
        if ($booking->status === 'cancelled') {
            return back()->with('error', 'Это бронирование уже отменено');
        }

        // Проверяем, что бронирование находится в статусе, который можно отменить
        if (!in_array($booking->status, ['pending', 'pending_payment'])) {
            return back()->with('error', 'Можно отменить только бронирования со статусом "Ожидает оплаты"');
        }

        try {
            // Увеличиваем количество доступных номеров
            $roomType = $booking->roomType;
            $roomType->available_rooms += 1;
            $roomType->save();

            $booking->status = 'cancelled';
            $booking->save();

            \Log::info('Booking cancelled successfully', [
                'booking_id' => $booking->id
            ]);

            return redirect()->route('bookings.show', $booking)
                ->with('success', 'Бронирование успешно отменено!');
        } catch (\Exception $e) {
            \Log::error('Error cancelling booking', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);
            return back()->with('error', 'Произошла ошибка при отмене бронирования');
        }
    }

    /**
     * Рассчитывает общую стоимость бронирования
     */
    private function calculateTotalPrice($roomType, $checkIn, $checkOut)
    {
        $checkInDate = Carbon::parse($checkIn);
        $checkOutDate = Carbon::parse($checkOut);
        $nights = $checkInDate->diffInDays($checkOutDate);

        return $roomType->price_per_night * $nights;
    }

    public function checkAvailability(Request $request)
    {
        $request->validate([
            'room_type_id' => 'required|exists:room_types,id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date'
        ]);

        $roomType = RoomType::findOrFail($request->room_type_id);
        $availableRooms = $roomType->getAvailableRoomsCount($request->check_in_date, $request->check_out_date);

        return response()->json([
            'available' => $availableRooms > 0,
            'available_rooms' => $availableRooms
        ]);
    }

    public function pay(BookingHotel $booking)
    {
        if ($booking->status !== 'pending') {
            return back()->with('error', 'Это бронирование уже не может быть оплачено');
        }

        // Обновляем статус бронирования на 'pending_payment'
        $booking->update([
            'status' => 'pending_payment'
        ]);

        // Перенаправляем на PayPal
        return redirect()->route('payments.create', $booking);
    }

    public function extendTime(BookingHotel $booking)
    {
        if ($booking->status !== 'pending_payment') {
            return back()->with('error', 'Можно продлить только ожидающие оплаты бронирования');
        }

        if ($booking->isTimerExpired()) {
            return back()->with('error', 'Время на оплату уже истекло');
        }

        // Продлеваем таймер на 5 минут
        $booking->extendTimer(5);

        return back()->with('success', 'Время на оплату продлено на 5 минут');
    }
}
