@props(['roomType'])

<div class="card h-100 shadow-sm">
    @if($roomType->image)
        <img src="{{ $roomType->image_url }}" class="card-img-top" alt="{{ $roomType->name }}" style="height: 200px; object-fit: cover;">
    @else
        <div class="bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
            <i class="fas fa-bed fa-3x text-muted"></i>
        </div>
    @endif

    <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="card-title mb-0">{{ $roomType->name }}</h5>
            <span class="badge bg-primary">{{ number_format($roomType->price_per_night, 0) }} ₽/ночь</span>
        </div>

        <div class="mb-3">
            <span class="badge bg-info me-2">
                <i class="fas fa-user-friends"></i> до {{ $roomType->max_guests }} гостей
            </span>
            <span class="badge bg-success">
                <i class="fas fa-door-open"></i> {{ $roomType->available_rooms }} свободно
            </span>
        </div>

        <p class="card-text">{{ Str::limit($roomType->description, 150) }}</p>

        <div class="mt-3">
            <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#roomTypeModal{{ $roomType->id }}">
                <i class="fas fa-info-circle"></i> Подробнее
            </button>
            @auth
                <a href="{{ route('bookings.create', ['hotel_id' => request()->route('hotel'), 'room_type_id' => $roomType->id]) }}"
                   class="btn btn-primary btn-sm">
                    <i class="fas fa-calendar-check"></i> Забронировать
                </a>
            @else
                <a href="{{ route('login') }}" class="btn btn-primary btn-sm">
                    <i class="fas fa-sign-in-alt"></i> Войти для бронирования
                </a>
            @endauth
        </div>
    </div>
</div>

<!-- Модальное окно с подробной информацией -->
<div class="modal fade" id="roomTypeModal{{ $roomType->id }}" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ $roomType->name }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                @if($roomType->image)
                    <img src="{{ $roomType->image_url }}" class="img-fluid rounded mb-4" alt="{{ $roomType->name }}">
                @endif

                <div class="row mb-4">
                    <div class="col-md-6">
                        <h6>Характеристики:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-money-bill text-success me-2"></i>{{ number_format($roomType->price_per_night, 0) }} ₽ за ночь</li>
                            <li><i class="fas fa-user-friends text-info me-2"></i>Вместимость: до {{ $roomType->max_guests }} гостей</li>
                            <li><i class="fas fa-door-open text-success me-2"></i>Свободно номеров: {{ $roomType->available_rooms }}</li>
                        </ul>
                    </div>
                </div>

                <h6>Описание:</h6>
                <p>{{ $roomType->description }}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                @auth
                    <a href="{{ route('bookings.create', ['hotel_id' => request()->route('hotel'), 'room_type_id' => $roomType->id]) }}"
                       class="btn btn-primary">
                        <i class="fas fa-calendar-check"></i> Забронировать
                    </a>
                @else
                    <a href="{{ route('login') }}" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Войти для бронирования
                    </a>
                @endauth
            </div>
        </div>
    </div>
</div>
