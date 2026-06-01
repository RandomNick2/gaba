<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_hotels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('booking_hotels')->cascadeOnDelete(); // booking_hotels кестесіне сілтеме
            $table->string('paypal_payment_id')->nullable(); // PayPal Order ID-ін сақтау үшін
            $table->decimal('amount', 10, 2); // USD сомасын сақтау үшін
            $table->string('currency', 10); // Валюта (USD)
            $table->string('status'); // 'paid', 'pending', 'failed'
            $table->json('payment_details')->nullable(); // PayPal-дан келген толық JSON деректер
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_hotels');
    }
};
