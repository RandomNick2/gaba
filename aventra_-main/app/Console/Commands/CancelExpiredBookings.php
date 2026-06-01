<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CancelExpiredBookings extends Command
{
    protected $signature = 'bookings:cancel-expired';
    protected $description = 'Уақыты өткен брондарды автоматты түрде өшіреді';


    public function handle()
    {
         $expiredBookings = BookingTour::where('status', 'pending') // Тек күту жағдайындағы броньдар
                 ->where('expires_at', '<', Carbon::now()) // Қазіргі уақыттан ертерек
                 ->where('is_paid', false) // Төленбеген
                 ->get();

             foreach ($expiredBookings as $booking) {
                 $booking->update([
                     'status' => 'cancelled',
                     'payment_status' => 'unpaid',
                 ]);

                 $this->info("Бронь #{$booking->id} жойылды.");
             }

             $this->info('Барлық мерзімі өткен броньдар өшірілді.');
    }
}
