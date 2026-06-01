<?php

namespace App\Policies;

use App\Models\Tour;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TourPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // все могут видеть
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'guide']);
    }

    public function update(User $user, Tour $tour): bool
    {
        return $user->role === 'admin' || ($user->role === 'guide' && $tour->user_id === $user->id);
    }

    public function delete(User $user, Tour $tour): bool
    {
        return $user->role === 'admin' || ($user->role === 'guide' && $tour->user_id === $user->id);
    }

}
