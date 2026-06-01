<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        \App\Models\User::class => \App\Policies\UserPolicy::class,
        \App\Models\City::class => \App\Policies\CityPolicy::class,
        \App\Models\Location::class => \App\Policies\LocationPolicy::class,
        \App\Models\Tour::class => \App\Policies\TourPolicy::class,
        \App\Models\Booking::class => \App\Policies\BookingPolicy::class,
    ];


    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
