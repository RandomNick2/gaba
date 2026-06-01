<?php

namespace App\Policies;

use App\Models\City;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CityPolicy
{
    // В обоих policy:
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'moderator']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'moderator']);
    }

    public function update(User $user, City $model): bool
    {
        return in_array($user->role, ['admin', 'moderator']);
    }

    public function delete(User $user, City $model): bool
    {
        return in_array($user->role, ['admin', 'moderator']);
    }

}
