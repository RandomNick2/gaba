@extends('layouts.app')

@section('title', 'Редактирование бронирования')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h3 class="mb-0">Редактирование бронирования</h3>
                    </div>
                    <div class="card-body">
                        <form action="{{ route('bookings.update', $booking) }}" method="POST">
                            @csrf
                            @method('PUT')

                            <div class="mb-3">
                                <label for="hotel_id" class="form-label">Отель</label>
                                <select class="form-select @error('hotel_id') is-invalid @enderror" id="hotel_id" name="hotel_id" required>
                                    <option value="">Выберите отель</option>
                                    @foreach($hotels as $hotel)
                                        <option value="{{ $hotel->id }}" {{ $booking->hotel_id == $hotel->id ? 'selected' : '' }}>
                                            {{ $hotel->name }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('hotel_id')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="room_type_id" class="form-label">Тип номера</label>
                                <select class="form-select @error('room_type_id') is-invalid @enderror" id="room_type_id" name="room_type_id" required>
                                    <option value="">Выберите тип номера</option>
                                    @foreach($roomTypes as $type)
                                        <option value="{{ $type->id }}"
                                            {{ $booking->room_type_id == $type->id ? 'selected' : '' }}
                                            {{ old('room_type_id') == $type->id ? 'selected' : '' }}>
                                            {{ $type->name }} ({{ $type->max_guests }} гостей) - {{ number_format($type->price_per_night, 2) }} ₸/ночь
                                        </option>
                                    @endforeach
                                </select>
                                @error('room_type_id')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="check_in_date" class="form-label">Дата заезда</label>
                                    <input type="date" class="form-control @error('check_in_date') is-invalid @enderror"
                                           id="check_in_date" name="check_in_date"
                                           value="{{ $booking->check_in_date->format('Y-m-d') }}" required>
                                    @error('check_in_date')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                                <div class="col-md-6">
                                    <label for="check_out_date" class="form-label">Дата выезда</label>
                                    <input type="date" class="form-control @error('check_out_date') is-invalid @enderror"
                                           id="check_out_date" name="check_out_date"
                                           value="{{ $booking->check_out_date->format('Y-m-d') }}" required>
                                    @error('check_out_date')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="guests_count" class="form-label">Количество гостей</label>
                                <input type="number" class="form-control @error('guests_count') is-invalid @enderror"
                                       id="guests_count" name="guests_count"
                                       value="{{ $booking->guests_count }}" min="1" required>
                                @error('guests_count')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="notes" class="form-label">Дополнительные пожелания</label>
                                <textarea class="form-control @error('notes') is-invalid @enderror"
                                          id="notes" name="notes" rows="3">{{ $booking->notes }}</textarea>
                                @error('notes')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                                <a href="{{ route('bookings.show', $booking) }}" class="btn btn-secondary">Отмена</a>
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
                const hotelSelect = document.getElementById('hotel_id');
                const roomTypeSelect = document.getElementById('room_type_id');

                hotelSelect.addEventListener('change', function() {
                    const hotelId = this.value;
                    roomTypeSelect.innerHTML = '<option value="">Выберите тип номера</option>';

                    if (hotelId) {
                        fetch(`/api/hotels/${hotelId}/room-types`)
                            .then(response => response.json())
                            .then(roomTypes => {
                                roomTypes.forEach(type => {
                                    const option = document.createElement('option');
                                    option.value = type.id;
                                    option.textContent = `${type.name} (${type.max_guests} гостей) - ${type.price_per_night} ₸/ночь`;
                                    roomTypeSelect.appendChild(option);
                                });
                            })
                            .catch(error => console.error('Error:', error));
                    }
                });
            });
        </script>
    @endpush
@endsection
