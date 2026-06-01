<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BookingPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // все могут видеть
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'guide']);
    }

    public function update(User $user, Booking $booking): bool
    {
        return $user->role === 'admin' || ($user->role === 'guide' && $booking->user_id === $user->id);
    }

    public function delete(User $user, Booking $booking): bool
    {
        return $user->role === 'admin' || ($user->role === 'guide' && $booking->user_id === $user->id);
    }
}
