<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use Carbon\Carbon;

class ClearExpiredBookings extends Command
{
    protected $signature = 'bookings:clear-expired';
    protected $description = 'Удаляет просроченные брони (неоплаченные)';

    public function handle()
    {
        $expiredBookings = Booking::where('is_paid', false)
            ->where('expires_at', '<', now())
            ->get();

        $count = $expiredBookings->count();

        foreach ($expiredBookings as $booking) {
            $booking->delete();
        }

        $this->info("Удалено $count просроченных броней.");
    }
}
