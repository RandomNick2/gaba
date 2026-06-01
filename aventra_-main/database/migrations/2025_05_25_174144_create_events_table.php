<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Оқиғаны қосқан қолданушы
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null'); // Қалаға байланысты (Location-ға емес, қалаға)
            $table->foreignId('event_type_id')->nullable()->constrained()->onDelete('set null'); // Оқиға түрі

            $table->string('title_kz'); // Оқиғаның тақырыбы
            $table->string('title_en'); // Оқиғаның тақырыбы
            $table->text('description_kz'); // Толық сипаттама
            $table->text('description_en'); // Толық сипаттама
            $table->dateTime('start_date'); // Басталу күні мен уақыты
            $table->dateTime('end_date')->nullable(); // Аяқталу күні мен уақыты (міндетті емес)
            $table->string('location_name_kz')->nullable(); // Өтетін орынның атауы (мысалы, "Алматы Арена")
            $table->string('location_name_en')->nullable(); // Өтетін орынның атауы (мысалы, "Алматы Арена")
            $table->string('address_kz')->nullable(); // Толық мекенжайы
            $table->string('address_en')->nullable(); // Толық мекенжайы
            $table->decimal('latitude', 10, 7)->nullable(); // Карта үшін ендік
            $table->decimal('longitude', 10, 7)->nullable(); // Карта үшін бойлық
            $table->string('price_info')->nullable(); // Баға ақпараты (мысалы, "Тегін", "5000 KZT", "Билеттер: www.ticket.kz")
            $table->string('organizer')->nullable(); // Ұйымдастырушы
            $table->string('phone')->nullable(); // Байланыс телефон
            $table->string('email')->nullable(); // Байланыс email
            $table->string('website')->nullable(); // Ресми сайт
            $table->string('image')->nullable(); // Негізгі сурет жолы
            $table->string('video_url')->nullable(); // Бейне сілтемесі (YouTube, Vimeo, т.б.)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
