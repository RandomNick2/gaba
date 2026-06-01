@extends('layouts.app')

@section('title', $hotel->name)

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-body">
                        <h2 class="card-title">{{ $hotel->name }}</h2>
                        <p class="text-muted">{{ $hotel->stars }} звезд</p>
                        <p>{{ $hotel->description }}</p>
                        <p><strong>Адрес:</strong> {{ $hotel->address }}</p>
                        <p><strong>Город:</strong> {{ $hotel->city->name }}</p>
                        <p><strong>Страна:</strong> {{ $hotel->country }}</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="mb-0">Типы номеров</h3>
                    </div>
                    <div class="card-body">
                        @foreach($hotel->roomTypes as $roomType)
                            <div class="room-type mb-4 p-4 border rounded">
                                <div class="row">
                                    <div class="col-md-4">
                                        @if($roomType->image)
                                            <img src="{{ asset('storage/' . $roomType->image) }}" alt="{{ $roomType->name }}" class="img-fluid rounded">
                                        @else
                                            <img src="{{ asset('images/default-room.jpg') }}" alt="{{ $roomType->name }}" class="img-fluid rounded">
                                        @endif
                                    </div>
                                    <div class="col-md-8">
                                        <h4>{{ $roomType->name }}</h4>
                                        <p class="text-muted">До {{ $roomType->max_guests }} гостей</p>
                                        <p><strong>Цена за ночь:</strong> {{ number_format($roomType->price_per_night, 2) }} ₸</p>
                                        <p>{{ $roomType->description }}</p>

                                        @if($roomType->amenitiesList)
                                            <div class="amenities mb-3">
                                                <strong>Удобства:</strong>
                                                <ul class="list-unstyled">
                                                    @foreach($roomType->amenitiesList as $amenity)
                                                        <li><i class="fas fa-check text-success"></i> {{ $amenity }}</li>
                                                    @endforeach
                                                </ul>
                                            </div>
                                        @endif

                                        <p><strong>Доступно номеров:</strong> {{ $roomType->available_rooms }}</p>

                                        <a href="{{ route('bookings.create', ['hotel' => $hotel->id, 'roomType' => $roomType->id]) }}" class="btn btn-primary">Забронировать</a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h3 class="mb-0">Информация</h3>
                    </div>
                    <div class="card-body">
                        @if($hotel->phone)
                            <p><strong>Телефон:</strong> {{ $hotel->phone }}</p>
                        @endif
                        @if($hotel->email)
                            <p><strong>Email:</strong> {{ $hotel->email }}</p>
                        @endif
                        @if($hotel->website)
                            <p><strong>Веб-сайт:</strong> <a href="{{ $hotel->website }}" target="_blank">{{ $hotel->website }}</a></p>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const checkInInput = document.getElementById('check_in');
            const checkOutInput = document.getElementById('check_out');

            if (checkInInput && checkOutInput) {
                checkInInput.addEventListener('change', function() {
                    checkOutInput.min = this.value;
                });
            }

            // Инициализация всех тултипов
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            });
        });
    </script>
@endpush
