@extends('layouts.app')

@section('content')
    <div class="container py-5">
        <h2 class="mb-4">Барлық турлар</h2>

        <form method="GET" action="{{ route('tours.index') }}" class="row g-3 mb-4">
            <div class="col-md-3">
                <input type="text" name="search" class="form-control" placeholder="Іздеу..." value="{{ request('search') }}">
            </div>
            <div class="col-md-3">
                <input type="date" name="date" class="form-control" value="{{ request('date') }}">
            </div>
            <div class="col-md-2">
                <input type="number" name="people" class="form-control" placeholder="Адам саны" value="{{ request('people') }}">
            </div>
            <div class="col-md-2">
                <input type="number" name="price_max" class="form-control" placeholder="Макс. баға" value="{{ request('price_max') }}">
            </div>
            <div class="col-md-2">
                <button type="submit" class="btn btn-primary w-100">Сүзу</button>
            </div>
        </form>

        <div class="row">
            @forelse($tours as $tour)
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        @if($tour->images->first())
                            <img src="{{ asset('storage/' . $tour->images->first()->image_path) }}" class="card-img-top" alt="Tour Image">
                        @endif
                        <div class="card-body">
                            <h5 class="card-title">{{ $tour->name }}</h5>
                            <p class="card-text">{{ Str::limit($tour->description, 100) }}</p>
                            <p class="card-text"><strong>Бағасы:</strong> {{ $tour->price }} ₸</p>
                            <a href="{{ route('tours.show', $tour->id) }}" class="btn btn-outline-primary">Толығырақ</a>
                        </div>
                    </div>
                </div>
            @empty
                <p class="text-muted">Турлар табылмады.</p>
            @endforelse
        </div>

        <div class="mt-4">
            {{ $tours->links() }}
        </div>
    </div>
@endsection
