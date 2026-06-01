<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address_kz')->nullable();
            $table->string('address_en')->nullable();
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('cascade');
            $table->string('country')->default('Qazaqstan');
            $table->text('description_kz')->nullable();
            $table->text('description_en')->nullable();
            $table->integer('stars')->default(3);
            $table->decimal('rating', 2, 1)->default(0.0);
            $table->decimal('price_per_night', 10, 2);
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
