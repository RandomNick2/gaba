@extends('layouts.app')

@section('title', 'Добавление отеля')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col">
                <h1>Добавление отеля</h1>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-8">
                <form action="{{ route('hotels.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf

                    <div class="card mb-4">
                        <div class="card-header">
                            <h5 class="mb-0">Основная информация</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label for="name" class="form-label">Название отеля</label>
                                <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name') }}" required>
                                @error('name')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="address" class="form-label">Адрес</label>
                                <input type="text" class="form-control @error('address') is-invalid @enderror" id="address" name="address" value="{{ old('address') }}" required>
                                @error('address')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="city" class="form-label">Город</label>
                                <input type="text" class="form-control @error('city') is-invalid @enderror" id="city" name="city" value="{{ old('city') }}" required>
                                @error('city')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="country" class="form-label">Страна</label>
                                <input type="text" class="form-control @error('country') is-invalid @enderror" id="country" name="country" value="{{ old('country') }}" required>
                                @error('country')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="description" class="form-label">Описание</label>
                                <textarea class="form-control @error('description') is-invalid @enderror" id="description" name="description" rows="3">{{ old('description') }}</textarea>
                                @error('description')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="stars" class="form-label">Количество звезд</label>
                                <select class="form-select @error('stars') is-invalid @enderror" id="stars" name="stars" required>
                                    <option value="">Выберите количество звезд</option>
                                    @for($i = 1; $i <= 5; $i++)
                                        <option value="{{ $i }}" {{ old('stars') == $i ? 'selected' : '' }}>{{ $i }} звезд</option>
                                    @endfor
                                </select>
                                @error('stars')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="price_per_night" class="form-label">Средняя цена за ночь</label>
                                <input type="number" class="form-control @error('price_per_night') is-invalid @enderror" id="price_per_night" name="price_per_night" value="{{ old('price_per_night') }}" min="0" step="0.01" required>
                                @error('price_per_night')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="image" class="form-label">Изображение отеля</label>
                                <input type="file" class="form-control @error('image') is-invalid @enderror" id="image" name="image" accept="image/*">
                                @error('image')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="card mb-4">
                        <div class="card-header">
                            <h5 class="mb-0">Типы номеров</h5>
                        </div>
                        <div class="card-body">
                            @for($i = 1; $i <= 3; $i++)
                                <div class="room-type mb-4 p-4 border rounded">
                                    <h5>Тип номера #{{ $i }}</h5>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="room_types[{{ $i }}][name]">Название</label>
                                                <input type="text" name="room_types[{{ $i }}][name]" class="form-control" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="room_types[{{ $i }}][price_per_night]">Цена за ночь</label>
                                                <input type="number" name="room_types[{{ $i }}][price_per_night]" class="form-control" min="0" step="0.01" required>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="room_types[{{ $i }}][max_guests]">Максимальное количество гостей</label>
                                                <input type="number" name="room_types[{{ $i }}][max_guests]" class="form-control" min="1" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="room_types[{{ $i }}][available_rooms]">Количество доступных номеров</label>
                                                <input type="number" name="room_types[{{ $i }}][available_rooms]" class="form-control" min="0" required>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="room_types[{{ $i }}][description]">Описание</label>
                                        <textarea name="room_types[{{ $i }}][description]" class="form-control" rows="3"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="room_types[{{ $i }}][image]">Изображение</label>
                                        <input type="file" name="room_types[{{ $i }}][image]" class="form-control-file">
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-check">
                                                <input type="checkbox" name="room_types[{{ $i }}][has_breakfast]" class="form-check-input" value="1">
                                                <label class="form-check-label">Завтрак включен</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-check">
                                                <input type="checkbox" name="room_types[{{ $i }}][has_wifi]" class="form-check-input" value="1">
                                                <label class="form-check-label">Wi-Fi</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-check">
                                                <input type="checkbox" name="room_types[{{ $i }}][has_tv]" class="form-check-input" value="1">
                                                <label class="form-check-label">Телевизор</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-check">
                                                <input type="checkbox" name="room_types[{{ $i }}][has_air_conditioning]" class="form-check-input" value="1">
                                                <label class="form-check-label">Кондиционер</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @endfor
                        </div>
                    </div>

                    <div class="mb-3">
                        <a href="{{ route('hotels.index') }}" class="btn btn-secondary">Назад</a>
                        <button type="submit" class="btn btn-primary">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection 
