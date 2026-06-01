@extends('layouts.app')

@section('title', 'Менің броньдарым')

@section('content')
    <div class="container py-5">
        <h2 class="mb-4 text-center fw-bold">🛏️ Менің қонақүй броньдарым</h2>

        @if ($bookings->count())
            <div class="row g-4">
                @foreach ($bookings as $booking)
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 shadow-sm rounded-4 border-0">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <h5 class="card-title text-primary fw-semibold">
                                    {{ $booking->hotel->name ?? 'Қонақүй атауы жоқ' }}
                                </h5>
                                <p class="card-text mb-2">
                                    <strong>Бөлме:</strong> {{ $booking->room->name ?? 'Бөлме мәліметі жоқ' }}<br>
                                    <strong>Күні:</strong> {{ \Carbon\Carbon::parse($booking->date)->format('d.m.Y') }}<br>
                                    <strong>Күніне баға:</strong> {{ $booking->price }} ₸<br>
                                    @foreach($booking->payments as $payment)
                                        <p>Статус: {{ $payment->status }}</p>
                                    @endforeach
                                </p>

                                <div class="mt-auto">
                                    <a href="{{route('bookings.show',['booking' => $booking->id])}}" class="btn btn-outline-primary btn-sm w-100">Толығырақ</a>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="mt-4 d-flex justify-content-center">
                {{ $bookings->links('pagination::bootstrap-5') }}
            </div>
        @else
            <div class="alert alert-info text-center">
                Сізде қазірше бронь жазбалары жоқ.
            </div>
        @endif
    </div>
@endsection
