@extends('layouts.app')

@section('title', 'Детали бронирования')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h3 class="mb-0">Детали бронирования</h3>
                            <span class="badge bg-{{ $booking->status === 'confirmed' ? 'success' : (in_array($booking->status, ['pending', 'pending_payment']) ? 'warning' : 'danger') }}">
                            @switch($booking->status)
                                    @case('pending')
                                    Ожидает оплаты
                                    @break
                                    @case('pending_payment')
                                    Ожидает оплаты
                                    @break
                                    @case('confirmed')
                                    Подтверждено
                                    @break
                                    @case('cancelled')
                                    Отменено
                                    @break
                                @endswitch
                        </span>
                        </div>
                    </div>
                    <div class="card-body">
                        @if(session('error'))
                            <div class="alert alert-danger">
                                {{ session('error') }}
                            </div>
                        @endif

                        <h5 class="card-title">Информация о бронировании</h5>
                        <p><strong>Отель:</strong> {{ $booking->hotel->name }}</p>
                        <p><strong>Адрес:</strong> {{ $booking->hotel->address }}</p>
                        <p><strong>Город:</strong> {{ $booking->hotel->city }}</p>
                        <p><strong>Тип номера:</strong> {{ $booking->roomType->name }}</p>
                        <p><strong>Описание:</strong> {{ $booking->roomType->description }}</p>

                        <div class="mb-4">
                            <h3>Даты бронирования</h3>
                            <p><strong>Заезд:</strong> {{ $booking->check_in_date->format('d.m.Y') }}</p>
                            <p><strong>Выезд:</strong> {{ $booking->check_out_date->format('d.m.Y') }}</p>
                            <p><strong>Количество ночей:</strong> {{ $booking->check_in_date->diffInDays($booking->check_out_date) }}</p>
                        </div>

                        <div class="mb-4">
                            <h3>Стоимость</h3>
                            <p><strong>Цена за ночь:</strong> {{ number_format($booking->roomType->price_per_night, 2) }} ₸</p>
                            <p><strong>Количество ночей:</strong> {{ $booking->check_in_date->diffInDays($booking->check_out_date) }}</p>
                            <p><strong>Общая стоимость:</strong> {{ number_format($booking->total_price, 2) }} ₸</p>
                        </div>

                        <div class="mb-4">
                            <h3>Статус бронирования</h3>
                            <p>
                            <span class="badge bg-{{ $booking->status === 'confirmed' ? 'success' : (in_array($booking->status, ['pending', 'pending_payment']) ? 'warning' : 'danger') }}">
                                @switch($booking->status)
                                    @case('pending')
                                    Ожидает оплаты
                                    @break
                                    @case('pending_payment')
                                    Ожидает оплаты
                                    @break
                                    @case('confirmed')
                                    Подтверждено
                                    @break
                                    @case('cancelled')
                                    Отменено
                                    @break
                                @endswitch
                            </span>
                            </p>
                        </div>

                        @if($booking->notes)
                            <p><strong>Дополнительные пожелания:</strong> {{ $booking->notes }}</p>
                        @endif

                        <div class="d-grid gap-2">
                            @if($booking->status !== 'cancelled')
                                <div class="d-flex justify-content-between align-items-center">
                                    <form action="{{ route('bookings.cancel', $booking) }}" method="POST" class="d-inline">
                                        @csrf
                                        <button type="submit" class="btn btn-danger" onclick="return confirm('Вы уверены, что хотите отменить бронирование?')">
                                            Отменить бронирование
                                        </button>
                                    </form>

                                    @if($booking->status === 'pending' || $booking->status === 'pending_payment')
                                        <form action="{{ route('bookings.pay', $booking) }}" method="POST" class="d-inline">
                                            @csrf
                                            <button type="submit" class="btn btn-success">
                                                Оплатить {{ number_format($booking->total_price / 520, 2) }} USD
                                                <small class="d-block text-muted">{{ number_format($booking->total_price, 2) }} ₸</small>
                                            </button>
                                        </form>
                                    @endif
                                </div>
                            @endif

                            @if ($booking->payment_status === 'pending' || $booking->payment_status === 'pending_payment')
                                <a href="{{ route('payments.create', $booking->id) }}" class="btn btn-primary">Оплатить</a>
                            @else
                                <p class="text-danger">
                                    @if ($booking->payment_status === 'paid')
                                        Оплата уже произведена.
                                    @elseif ($booking->payment_status === 'failed')
                                        Попытка оплаты исчерпана.
                                    @endif
                                </p>
                            @endif

                            <a href="{{ route('bookings.index') }}" class="btn btn-secondary">Назад к списку</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
