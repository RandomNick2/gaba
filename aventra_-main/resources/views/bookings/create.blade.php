@extends('layouts.app')

@section('title', 'Новое бронирование')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h3 class="mb-0">Новое бронирование</h3>
                    </div>
                    <div class="card-body">
                        @if ($errors->any())
                            <div class="alert alert-danger">
                                <ul class="mb-0">
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        <div class="mb-4">
                            <h6>Информация о бронировании:</h6>
                            <p><strong>Отель:</strong> {{ $hotel->name }}</p>
                            <p><strong>Тип номера:</strong> {{ $roomType->name }}</p>
                            <p><strong>Цена за ночь:</strong> {{ number_format($roomType->price_per_night, 2) }} ₸</p>
                            <p><strong>Максимум гостей:</strong> {{ $roomType->max_guests }}</p>
                            <p><strong>Доступно номеров:</strong> <span id="available-rooms">{{ $roomType->available_rooms }}</span></p>
                            <p><strong>Описание:</strong> {{ $roomType->description }}</p>
                        </div>

                        <form action="{{ route('bookings.store') }}" method="POST" id="booking-form">
                            @csrf
                            <input type="hidden" name="hotel_id" value="{{ $hotel->id }}">
                            <input type="hidden" name="room_type_id" value="{{ $roomType->id }}">

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="check_in_date" class="form-label">{{ __('Дата заезда') }}</label>
                                        <input type="date" class="form-control @error('check_in_date') is-invalid @enderror" id="check_in_date" name="check_in_date" value="{{ old('check_in_date') }}" required>
                                        @error('check_in_date')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="check_out_date" class="form-label">{{ __('Дата выезда') }}</label>
                                        <input type="date" class="form-control @error('check_out_date') is-invalid @enderror" id="check_out_date" name="check_out_date" value="{{ old('check_out_date') }}" required>
                                        @error('check_out_date')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="guests_count" class="form-label">{{ __('Количество гостей') }}</label>
                                <input type="number" class="form-control @error('guests_count') is-invalid @enderror" id="guests_count" name="guests_count" value="{{ old('guests_count', 1) }}" min="1" max="{{ $roomType->max_guests }}" required>
                                @error('guests_count')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="notes" class="form-label">Дополнительные пожелания</label>
                                <textarea class="form-control @error('notes') is-invalid @enderror"
                                          id="notes" name="notes" rows="3">{{ old('notes') }}</textarea>
                                @error('notes')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <h5>Стоимость бронирования</h5>
                                <p>Цена за ночь: <span id="price_per_night">{{ number_format($roomType->price_per_night, 2) }}</span> ₸</p>
                                <p>Количество ночей: <span id="nights_count">0</span></p>
                                <p>Общая стоимость: <span id="total_price">0</span> ₸</p>
                            </div>

                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary" id="submit-button">{{ __('Забронировать') }}</button>
                                <a href="{{ route('hotels.show', $hotel) }}" class="btn btn-secondary">{{ __('Отмена') }}</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @push('scripts')
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const checkInInput = document.getElementById('check_in_date');
                const checkOutInput = document.getElementById('check_out_date');
                const pricePerNight = document.getElementById('price_per_night');
                const nightsCount = document.getElementById('nights_count');
                const totalPrice = document.getElementById('total_price');
                const submitButton = document.getElementById('submit-button');
                const bookingForm = document.getElementById('booking-form');
                const availableRoomsSpan = document.getElementById('available-rooms');
                const roomTypeId = document.querySelector('input[name="room_type_id"]').value;

                // Устанавливаем минимальную дату заезда на завтра
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                checkInInput.min = tomorrow.toISOString().split('T')[0];

                function calculateTotalPrice() {
                    if (checkInInput.value && checkOutInput.value) {
                        const start = new Date(checkInInput.value);
                        const end = new Date(checkOutInput.value);
                        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                        const price = parseFloat(pricePerNight.textContent.replace(/\s/g, ''));
                        nightsCount.textContent = nights;
                        totalPrice.textContent = (nights * price).toFixed(2);
                    }
                }

                async function checkAvailability() {
                    if (!checkInInput.value || !checkOutInput.value) return;

                    try {
                        const response = await fetch('{{ route("bookings.check-availability") }}', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': '{{ csrf_token() }}'
                            },
                            body: JSON.stringify({
                                room_type_id: roomTypeId,
                                check_in_date: checkInInput.value,
                                check_out_date: checkOutInput.value
                            })
                        });

                        const data = await response.json();

                        if (!data.available) {
                            alert('К сожалению, все номера этого типа уже заняты на выбранные даты. Пожалуйста, выберите другие даты.');
                            submitButton.disabled = true;
                        } else {
                            availableRoomsSpan.textContent = data.available_rooms;
                            submitButton.disabled = false;
                        }
                    } catch (error) {
                        console.error('Ошибка при проверке доступности:', error);
                    }
                }

                checkInInput.addEventListener('change', function() {
                    const checkInDate = new Date(this.value);
                    const nextDay = new Date(checkInDate);
                    nextDay.setDate(checkInDate.getDate() + 1);
                    checkOutInput.min = nextDay.toISOString().split('T')[0];

                    if (checkOutInput.value && new Date(checkOutInput.value) < nextDay) {
                        checkOutInput.value = nextDay.toISOString().split('T')[0];
                    }

                    calculateTotalPrice();
                    checkAvailability();
                });

                checkOutInput.addEventListener('change', function() {
                    calculateTotalPrice();
                    checkAvailability();
                });

                // Предотвращаем отправку формы, если даты заняты
                bookingForm.addEventListener('submit', function(e) {
                    if (submitButton.disabled) {
                        e.preventDefault();
                        alert('Пожалуйста, выберите доступные даты.');
                    }
                });
            });
        </script>
    @endpush
@endsection
