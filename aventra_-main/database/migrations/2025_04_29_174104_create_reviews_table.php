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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained()->onDelete('cascade'); // связь с туром
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // связь с пользователем
            $table->text('content')->nullable(); // содержимое отзыва, теперь может быть пустым
            $table->integer('rating'); // рейтинг от 1 до 5
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
