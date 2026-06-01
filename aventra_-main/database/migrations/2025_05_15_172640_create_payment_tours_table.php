<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('payment_tours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('booking_id')->constrained('booking_tours');
            $table->string('payment_id')->nullable();         // PayPal Payment ID
            $table->string('payer_id')->nullable();           // PayPal Payer ID
            $table->string('status')->default('pending');     // pending, approved, failed
            $table->decimal('amount', 10, 2);                  // USD or KZT
            $table->string('currency')->default('USD');
            $table->json('paypal_response')->nullable();       // Optional: full response from PayPal
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('payment_tours');
    }
};

