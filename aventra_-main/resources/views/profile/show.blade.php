@extends('layouts.app')

@section('content')
    <h1>Профиль: {{ $user->name }}</h1>
    <p>Email: {{ $user->email }}</p>
    <p>Role:{{$user->role}}</p>
    <p>Зарегистрирован: {{ $user->created_at->format('d.m.Y') }}</p>

    <hr>

    <h2>Посты</h2>
    @foreach($user->posts as $post)
        <div>{{ $post->title }}</div>
    @endforeach

    <h2>Комментарии</h2>
    @foreach($user->comments as $comment)
        <div>{{ $comment->content }}</div>
    @endforeach

    <h2>Отзывы</h2>
    @foreach($user->reviews as $review)
        <div>
            Рейтинг: {{ $review->rating }} |
            Тур: {{ $review->tour->name }}<br>
            {{ $review->content }}
        </div>
    @endforeach

    <h2>Туры гида</h2>
    @foreach($user->tours as $tour)
        <div>{{ $tour->name }}</div>
    @endforeach

    <h2>Бронирования</h2>
    @foreach($user->bookings as $booking)
        <div>Тур: {{ $booking->tour->name }} | Дата: {{ $booking->created_at->format('d.m.Y') }}</div>
    @endforeach

    <h2>Избранные туры</h2>
    @foreach($user->favoriteTours as $tour)
        <div>{{ $tour->name }}</div>
    @endforeach
@endsection
