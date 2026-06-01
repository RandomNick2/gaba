@extends('layouts.app')

@section('title', 'Отели')

@section('content')
    <div class="container">
        <div class="row mb-4">
            <div class="col-md-8">
                <h1>Отели</h1>
            </div>
            <div class="col-md-4 text-end">
                <a href="{{ route('hotels.create') }}" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Добавить отель
                </a>
            </div>
        </div>

        @if(session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        <div class="row">
            @forelse($hotels as $hotel)
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        @if($hotel->image)
                            <img src="{{ Storage::url($hotel->image) }}" class="card-img-top" alt="{{ $hotel->name }}" style="height: 200px; object-fit: cover;">
                        @else
                            <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                                <i class="fas fa-hotel fa-3x text-muted"></i>
                            </div>
                        @endif
                        <div class="card-body">
                            <h5 class="card-title">{{ $hotel->name }}</h5>
                            <p class="card-text">
                                <i class="fas fa-map-marker-alt"></i> {{ $hotel->city->name }}, {{ $hotel->country }}<br>
                                <i class="fas fa-star text-warning"></i> {{ $hotel->stars }} звезд<br>
                                <i class="fas fa-thumbs-up"></i> Рейтинг: {{ $hotel->rating }}/5
                            </p>
                            <p class="card-text">
                                <strong>От {{ number_format($hotel->price_per_night, 0, ',', ' ') }} ₽</strong> за ночь
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <a href="{{ route('hotels.show', $hotel->id) }}" class="btn btn-primary">Подробнее</a>
                                <div>
                                    <a href="{{ route('hotels.edit', $hotel->id) }}" class="btn btn-sm btn-outline-primary">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <form action="{{ route('hotels.destroy', $hotel->id) }}" method="POST" class="d-inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Вы уверены, что хотите удалить этот отель?')">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-12">
                    <div class="alert alert-info">
                        Отели не найдены. <a href="{{ route('hotels.create') }}">Добавить отель</a>
                    </div>
                </div>
            @endforelse
        </div>

        <div class="d-flex justify-content-center mt-4">
            {{ $hotels->links() }}
        </div>
    </div>
@endsection
