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
        Schema::create('room_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
            $table->string('name_kz');
            $table->string('name_en');
            $table->decimal('price_per_night', 10, 2);
            $table->integer('max_guests');
            $table->integer('available_rooms');
            $table->text('description_kz')->nullable();
            $table->text('description_en')->nullable();
            $table->string('image')->nullable();
            $table->boolean('has_breakfast')->default(false);
            $table->boolean('has_wifi')->default(false);
            $table->boolean('has_tv')->default(false);
            $table->boolean('has_air_conditioning')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_types');
    }
};
