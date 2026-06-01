@extends('layouts.app')

@section('title', 'Редактирование отеля')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h2>Редактирование отеля: {{ $hotel->name }}</h2>
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

                        <form action="{{ route('hotels.update', $hotel->id) }}" method="POST" enctype="multipart/form-data">
                            @csrf
                            @method('PUT')

                            <div class="mb-3">
                                <label for="name" class="form-label">Название отеля</label>
                                <input type="text" class="form-control" id="name" name="name" value="{{ old('name', $hotel->name) }}" required>
                            </div>

                            <div class="mb-3">
                                <label for="address" class="form-label">Адрес</label>
                                <input type="text" class="form-control" id="address" name="address" value="{{ old('address', $hotel->address) }}" required>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="city" class="form-label">Город</label>
                                        <input type="text" class="form-control" id="city" name="city" value="{{ old('city', $hotel->city) }}" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="country" class="form-label">Страна</label>
                                        <input type="text" class="form-control" id="country" name="country" value="{{ old('country', $hotel->country) }}" required>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="description" class="form-label">Описание</label>
                                <textarea class="form-control" id="description" name="description" rows="3">{{ old('description', $hotel->description) }}</textarea>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="stars" class="form-label">Количество звезд</label>
                                        <select class="form-select" id="stars" name="stars" required>
                                            <option value="">Выберите количество звезд</option>
                                            @for($i = 1; $i <= 5; $i++)
                                                <option value="{{ $i }}" {{ old('stars', $hotel->stars) == $i ? 'selected' : '' }}>{{ $i }}</option>
                                            @endfor
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="rating" class="form-label">Рейтинг (от 0 до 5)</label>
                                        <input type="number" class="form-control" id="rating" name="rating" min="0" max="5" step="0.1" value="{{ old('rating', $hotel->rating) }}" required>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="price_per_night" class="form-label">Цена за ночь (₽)</label>
                                <input type="number" class="form-control" id="price_per_night" name="price_per_night" min="0" value="{{ old('price_per_night', $hotel->price_per_night) }}" required>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="phone" class="form-label">Телефон</label>
                                        <input type="text" class="form-control" id="phone" name="phone" value="{{ old('phone', $hotel->phone) }}">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="email" name="email" value="{{ old('email', $hotel->email) }}">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="website" class="form-label">Веб-сайт</label>
                                        <input type="url" class="form-control" id="website" name="website" value="{{ old('website', $hotel->website) }}">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="image" class="form-label">Изображение</label>
                                @if($hotel->image)
                                    <div class="mb-2">
                                        <img src="{{ asset('storage/' . $hotel->image) }}" alt="Текущее изображение" class="img-thumbnail" style="max-height: 200px;">
                                    </div>
                                @endif
                                <input type="file" class="form-control" id="image" name="image" accept="image/*">
                                <small class="form-text text-muted">Оставьте пустым, чтобы сохранить текущее изображение</small>
                            </div>

                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="is_active" name="is_active" value="1" {{ old('is_active', $hotel->is_active) ? 'checked' : '' }}>
                                    <label class="form-check-label" for="is_active">
                                        Активен
                                    </label>
                                </div>
                            </div>

                            <h4 class="mt-4 mb-3">Типы номеров</h4>
                            <div id="room-types">
                                @foreach($hotel->roomTypes as $index => $roomType)
                                    <div class="card mb-3 room-type">
                                        <div class="card-body">
                                            <input type="hidden" name="room_types[{{ $index }}][id]" value="{{ $roomType->id }}">

                                            <div class="mb-3">
                                                <label class="form-label">Название типа номера</label>
                                                <input type="text" class="form-control" name="room_types[{{ $index }}][name]" value="{{ $roomType->name }}" required>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">Цена за ночь</label>
                                                <input type="number" class="form-control" name="room_types[{{ $index }}][price_per_night]" value="{{ $roomType->price_per_night }}" min="0" step="0.01" required>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">Максимальное количество гостей</label>
                                                <input type="number" class="form-control" name="room_types[{{ $index }}][max_guests]" value="{{ $roomType->max_guests }}" min="1" required>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">Количество доступных номеров</label>
                                                <input type="number" class="form-control" name="room_types[{{ $index }}][available_rooms]" value="{{ $roomType->available_rooms }}" min="0" required>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">Описание</label>
                                                <textarea class="form-control" name="room_types[{{ $index }}][description]" rows="2">{{ $roomType->description }}</textarea>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">Изображение номера</label>
                                                @if($roomType->image)
                                                    <div class="mb-2">
                                                        <img src="{{ Storage::url($roomType->image) }}" alt="Текущее изображение" class="img-thumbnail" style="max-height: 150px;">
                                                    </div>
                                                @endif
                                                <input type="file" class="form-control" name="room_types[{{ $index }}][image]">
                                            </div>

                                            <div class="row mb-3">
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" name="room_types[{{ $index }}][has_breakfast]" value="1" {{ $roomType->has_breakfast ? 'checked' : '' }}>
                                                        <label class="form-check-label">Завтрак</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" name="room_types[{{ $index }}][has_wifi]" value="1" {{ $roomType->has_wifi ? 'checked' : '' }}>
                                                        <label class="form-check-label">Wi-Fi</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" name="room_types[{{ $index }}][has_tv]" value="1" {{ $roomType->has_tv ? 'checked' : '' }}>
                                                        <label class="form-check-label">TV</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" name="room_types[{{ $index }}][has_air_conditioning]" value="1" {{ $roomType->has_air_conditioning ? 'checked' : '' }}>
                                                        <label class="form-check-label">Кондиционер</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>

                            <div class="mb-3">
                                <button type="button" class="btn btn-secondary" id="add-room-type">Добавить тип номера</button>
                            </div>

                            <div class="d-flex justify-content-between">
                                <a href="{{ route('hotels.show', $hotel->id) }}" class="btn btn-secondary">
                                    <i class="fas fa-arrow-left"></i> Назад
                                </a>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Сохранить изменения
                                </button>
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
                const roomTypesContainer = document.getElementById('room-types');
                const addRoomTypeButton = document.getElementById('add-room-type');
                let roomTypeIndex = {{ count($hotel->roomTypes) }};

                addRoomTypeButton.addEventListener('click', function() {
                    const template = `
            <div class="card mb-3 room-type">
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Название типа номера</label>
                        <input type="text" class="form-control" name="room_types[${roomTypeIndex}][name]" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Цена за ночь</label>
                        <input type="number" class="form-control" name="room_types[${roomTypeIndex}][price_per_night]" min="0" step="0.01" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Максимальное количество гостей</label>
                        <input type="number" class="form-control" name="room_types[${roomTypeIndex}][max_guests]" min="1" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Количество доступных номеров</label>
                        <input type="number" class="form-control" name="room_types[${roomTypeIndex}][available_rooms]" min="0" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Описание</label>
                        <textarea class="form-control" name="room_types[${roomTypeIndex}][description]" rows="2"></textarea>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Изображение номера</label>
                        <input type="file" class="form-control" name="room_types[${roomTypeIndex}][image]">
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-3">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" name="room_types[${roomTypeIndex}][has_breakfast]" value="1">
                                <label class="form-check-label">Завтрак</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" name="room_types[${roomTypeIndex}][has_wifi]" value="1">
                                <label class="form-check-label">Wi-Fi</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" name="room_types[${roomTypeIndex}][has_tv]" value="1">
                                <label class="form-check-label">TV</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" name="room_types[${roomTypeIndex}][has_air_conditioning]" value="1">
                                <label class="form-check-label">Кондиционер</label>
                            </div>
                        </div>
                    </div>

                    <button type="button" class="btn btn-danger remove-room-type">Удалить тип номера</button>
                </div>
            </div>
        `;

                    roomTypesContainer.insertAdjacentHTML('beforeend', template);
                    roomTypeIndex++;

                    // Добавляем обработчик для кнопки удаления
                    const removeButtons = document.querySelectorAll('.remove-room-type');
                    removeButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            this.closest('.room-type').remove();
                        });
                    });
                });
            });
        </script>
    @endpush
@endsection
