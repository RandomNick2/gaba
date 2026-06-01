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
                <h4 class="card-title mb-4">Брондау формасы</h4>
                <form action="{{ route('bookingsTour.create') }}" method="GET">
                    <input type="hidden" name="tour_id" value="{{ $tour->id }}">

                    <div class="mb-3">
                        <label for="seats" class="form-label">Орын саны:</label>
                        <input type="number" name="seats" id="seats" class="form-control" value="1" min="1" max="{{ $tour->volume }}" required>
                    </div>

                    <button type="submit" class="btn btn-success">Брондау бетіне өту</button>
                </form>
            </div>
        </div>
    </div>
@endsection
