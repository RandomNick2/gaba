<?php
// database/migrations/YYYY_MM_DD_create_booking_tours_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_tours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tour_id')->constrained()->cascadeOnDelete();
            $table->date('booking_date'); // Турды брондау күні
            $table->integer('guests_count');
            $table->text('notes')->nullable();
            $table->decimal('total_price', 10, 2);
            $table->string('status')->default('pending'); // pending, confirmed, cancelled, completed, failed
            $table->timestamp('payment_deadline')->nullable(); // Егер қажет болса
            $table->string('payment_id')->nullable(); // PayPal Order ID немесе басқа төлем ID
            $table->string('payment_status')->default('unpaid'); // unpaid, paid, failed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_tours');
    }
};
