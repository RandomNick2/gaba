@extends('layouts.app')

@section('content')
    <div class="container py-5">
        <h2 class="mb-4">Менің брондарым</h2>

        @if($bookings->count())
            <div class="table-responsive">
                <table class="table table-bordered align-middle" id="booking-table">
                    <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>Тур</th>
                        <th>Күні</th>
                        <th>Орын саны</th>
                        <th>Жалпы баға</th>
                        <th>Статус</th>
                        <th>Уақыт қалды</th>
                        <th>Әрекет</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($bookings as $index => $booking)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>{{ $booking->tour->name ?? '—' }}</td>
                            <td>{{ $booking->tour->date ?? '—' }}</td>
                            <td>{{ $booking->seats }}</td>
                            <td>{{ number_format(($booking->seats * ($booking->tour->price ?? 0))/520, 2) }} ₸</td>
                            <td>
                                @if($booking->is_paid)
                                    <span class="badge bg-success">Төленді</span>
                                @elseif($booking->status === 'cancelled')
                                    <span class="badge bg-danger">Бас тартылды</span>
                                @else
                                    <span class="badge bg-warning text-dark">Күту</span>
                                @endif
                            </td>
                            <td>
                                @if(!$booking->is_paid && $booking->expires_at)
                                    <span class="countdown-timer" data-expires="{{ \Carbon\Carbon::parse($booking->expires_at)->toIso8601String() }}"></span>
                                @else
                                    —
                                @endif
                            </td>
                            <td>
                                @if(!$booking->is_paid && $booking->status === 'pending')
                                    <a href="{{ route('paypal.pay', $booking->id) }}" class="btn btn-sm btn-outline-primary">Төлеу</a>

                                    <form action="{{ route('bookings.destroy', $booking->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Сіз бұл брондауды жоюға сенімдісіз бе?');">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-sm btn-outline-danger">Бас тарту</button>
                                    </form>
                                @else
                                    —
                                @endif
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="alert alert-info">Сізде ешқандай брондау жоқ.</div>
        @endif
    </div>

@section('scripts')
    <script>
        function updateCountdowns() {
            const timers = document.querySelectorAll('.countdown-timer');
            timers.forEach(timer => {
                const expiresAt = new Date(timer.dataset.expires);
                const now = new Date();
                const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));

                const minutes = Math.floor(diff / 60);
                const seconds = diff % 60;

                if (diff <= 0) {
                    timer.innerHTML = 'Уақыт аяқталды';
                } else {
                    timer.innerHTML = `${minutes} мин. ${seconds.toString().padStart(2, '0')} сек.`;
                }
            });
        }

        setInterval(updateCountdowns, 1000);
        updateCountdowns();
    </script>
@endsection
@endsection
