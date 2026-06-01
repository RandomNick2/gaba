@extends('layouts.app')

@section('title', 'Мои бронирования')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h3 class="mb-0">Мои бронирования</h3>
                            <a href="{{ route('hotels.index') }}" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Новое бронирование
                            </a>
                        </div>
                    </div>
                    <div class="card-body">
                        @if($bookings->isEmpty())
                            <div class="alert alert-info">
                                У вас пока нет бронирований. <a href="{{ route('hotels.index') }}">Выберите отель</a> для бронирования.
                            </div>
                        @else
                            <div class="list-group">
                                @foreach($bookings as $booking)
                                    <div class="list-group-item">
                                        <div class="d-flex w-100 justify-content-between">
                                            <h5 class="mb-1">{{ $booking->hotel->name }}</h5>
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
                                        <p class="mb-1">
                                            <strong>Тип номера:</strong> {{ $booking->roomType->name }}<br>
                                            <strong>Даты:</strong> {{ $booking->check_in_date->format('d.m.Y') }} - {{ $booking->check_out_date->format('d.m.Y') }}<br>
                                            <strong>Гости:</strong> {{ $booking->guests_count }}<br>
                                            <strong>Стоимость:</strong> {{ number_format($booking->total_price, 2) }} ₸
                                        </p>
                                        @if($booking->notes)
                                            <p class="mb-1"><strong>Дополнительно:</strong> {{ $booking->notes }}</p>
                                        @endif
                                        <div class="mt-2">
                                            <a href="{{ route('bookings.show', $booking) }}" class="btn btn-sm btn-info">
                                                <i class="fas fa-eye"></i> Подробнее
                                            </a>
                                            @if($booking->status === 'pending' || $booking->status === 'pending_payment')
                                                <form action="{{ route('bookings.cancel', $booking) }}" method="POST" class="d-inline">
                                                    @csrf
                                                    <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Вы уверены, что хотите отменить бронирование?')">
                                                        <i class="fas fa-times"></i> Отменить
                                                    </button>
                                                </form>
                                            @endif
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                            <div class="mt-4">
                                {{ $bookings->links() }}
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
