@extends('layouts.app')

@section('content')
    <div class="container py-5">
        <a href="{{ route('tours.show', $tour->id) }}" class="btn btn-link mb-3">← Тур бетіне қайту</a>

        <div class="card mb-4">
            <div class="row g-0">
                @if($tour->images->first())
                    <div class="col-md-6">
                        <img src="{{ asset('storage/' . $tour->images->first()->image_path) }}" class="img-fluid rounded-start" alt="Tour Image">
                    </div>
                @endif
                <div class="col-md-6">
                    <div class="card-body">
                        <h3 class="card-title">{{ $tour->name }}</h3>
                        <p class="card-text">{{ $tour->description }}</p>
                        <p class="card-text"><strong>Бағасы:</strong> {{ $tour->price }} ₸</p>
                        <p class="card-text"><strong>Өтетін күні:</strong> {{ $tour->date }}</p>
                        <p class="card-text"><strong>Орналасуы:</strong> {{ $tour->location->name ?? '—' }}</p>
                        <p class="card-text"><strong>Гид:</strong> {{ $tour->user->name ?? '—' }}</p>
                        <p class="card-text"><strong>Қалған орын:</strong> {{ $tour->volume }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h4 class="card-title mb-4">Брондау және төлем</h4>
                <form action="{{ route('bookingsTour.store') }}" method="POST">
                    @csrf
                    <input type="hidden" name="tour_id" value="{{ $tour->id }}">

                    <div class="mb-3">
                        <label for="seats" class="form-label">Орын саны:</label>
                        <input type="number" name="seats" id="seats" class="form-control" value="{{ old('seats', request('seats', 1)) }}" min="1" max="{{ $tour->volume }}" required>
                    </div>

                    @php
                        $seats = old('seats', request('seats', 1));
                        $total = $seats * $tour->price;
                    @endphp

                    <div class="mb-3">
                        <label class="form-label">Жалпы бағасы:</label>
                        <div class="form-control bg-light">{{ number_format($total / 520, 2) }} ₸</div>
                    </div>

                    <button type="submit" class="btn btn-success w-100">Брондау және төлеу</button>
                </form>

                @if(session('booking_id'))
                    <div class="text-center mt-4">
                        <a href="{{ route('paypal.pay', session('booking_id')) }}" class="btn btn-outline-primary">
                            <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" style="height: 20px; margin-right: 8px;">
                            PayPal арқылы төлеу
                        </a>
                    </div>
                @endif
            </div>
        </div>
    </div>
@endsection
