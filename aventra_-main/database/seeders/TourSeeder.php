<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Location;
use App\Models\Tour;
use Illuminate\Database\Seeder;

class TourSeeder extends Seeder
{
    /**
     * Seed tours without creating duplicates.
     */
    public function run(): void
    {
        $tourSeeds = [
            [
                'city' => [
                    'city_code' => 'ALA',
                    'name_kz' => 'Алматы',
                    'name_en' => 'Almaty',
                    'image' => 'cities/almaty.jpg',
                    'description_kz' => 'Қазақстанның мәдени орталығы және таулы бағыттарға қақпа.',
                    'description_en' => 'The cultural capital of Kazakhstan and a gateway to mountain routes.',
                ],
                'location' => [
                    'name_kz' => 'Көлсай көлдері',
                    'name_en' => 'Kolsai Lakes',
                ],
                'tour' => [
                    'name_kz' => 'Көлсай мен Қайыңдыға демалыс туры',
                    'name_en' => 'Weekend Tour to Kolsai and Kaindy',
                    'description_kz' => 'Екі күндік табиғат туры: көлдер, шатқалдар және жайлы трансфер.',
                    'description_en' => 'Two-day nature trip with lakes, canyons, and comfortable transfer.',
                    'price' => 45000,
                    'volume' => 18,
                    'date' => '2026-07-10',
                    'image' => 'tours/kolsai-kaindy.jpg',
                    'featured' => true,
                ],
            ],
            [
                'city' => [
                    'city_code' => 'AST',
                    'name_kz' => 'Астана',
                    'name_en' => 'Astana',
                    'image' => 'cities/astana.jpg',
                    'description_kz' => 'Елорда және орталық Қазақстан бағыттарының бастауы.',
                    'description_en' => 'The capital city and a starting point for central Kazakhstan trips.',
                ],
                'location' => [
                    'name_kz' => 'Бурабай',
                    'name_en' => 'Burabay',
                ],
                'tour' => [
                    'name_kz' => 'Бурабайға отбасылық тур',
                    'name_en' => 'Family Tour to Burabay',
                    'description_kz' => 'Орман, көл және серуенге арналған жайлы бір күндік бағыт.',
                    'description_en' => 'A relaxed one-day route with forest walks and lake views.',
                    'price' => 28000,
                    'volume' => 24,
                    'date' => '2026-07-18',
                    'image' => 'tours/burabay-family.jpg',
                    'featured' => true,
                ],
            ],
            [
                'city' => [
                    'city_code' => 'TRK',
                    'name_kz' => 'Түркістан',
                    'name_en' => 'Turkistan',
                    'image' => 'cities/turkistan.jpg',
                    'description_kz' => 'Тарихи мұралар мен киелі орындарға бай өңір.',
                    'description_en' => 'A region rich in historical heritage and sacred landmarks.',
                ],
                'location' => [
                    'name_kz' => 'Қожа Ахмет Ясауи кесенесі',
                    'name_en' => 'Mausoleum of Khoja Ahmed Yasawi',
                ],
                'tour' => [
                    'name_kz' => 'Түркістан тарихи туры',
                    'name_en' => 'Historic Turkistan Tour',
                    'description_kz' => 'Кесене, музей және ежелгі қаланың атмосферасын қамтитын тур.',
                    'description_en' => 'A cultural route covering the mausoleum, museums, and old city atmosphere.',
                    'price' => 32000,
                    'volume' => 20,
                    'date' => '2026-08-02',
                    'image' => 'tours/turkistan-history.jpg',
                    'featured' => false,
                ],
            ],
            [
                'city' => [
                    'city_code' => 'AKT',
                    'name_kz' => 'Ақтау',
                    'name_en' => 'Aktau',
                    'image' => 'cities/aktau.jpg',
                    'description_kz' => 'Каспий жағалауы мен Маңғыстау табиғатына жол ашатын қала.',
                    'description_en' => 'A coastal city opening the way to the Caspian and Mangystau landscapes.',
                ],
                'location' => [
                    'name_kz' => 'Бозжыра шатқалы',
                    'name_en' => 'Bozzhyra Canyon',
                ],
                'tour' => [
                    'name_kz' => 'Бозжыра экспедициясы',
                    'name_en' => 'Bozzhyra Expedition',
                    'description_kz' => 'Маңғыстаудың көркем шатқалдарына фото және джип тур.',
                    'description_en' => 'A jeep and photo tour through Mangystau dramatic canyons.',
                    'price' => 67000,
                    'volume' => 12,
                    'date' => '2026-08-15',
                    'image' => 'tours/bozzhyra-expedition.jpg',
                    'featured' => true,
                ],
            ],
        ];

        foreach ($tourSeeds as $seed) {
            $city = City::updateOrCreate(
                ['city_code' => $seed['city']['city_code']],
                $seed['city']
            );

            $location = Location::updateOrCreate(
                [
                    'city_id' => $city->id,
                    'name_en' => $seed['location']['name_en'],
                ],
                [
                    'city_id' => $city->id,
                    'name_kz' => $seed['location']['name_kz'],
                    'name_en' => $seed['location']['name_en'],
                ]
            );

            Tour::updateOrCreate(
                [
                    'location_id' => $location->id,
                    'name_en' => $seed['tour']['name_en'],
                    'date' => $seed['tour']['date'],
                ],
                $seed['tour'] + [
                    'user_id' => null,
                    'location_id' => $location->id,
                ]
            );
        }
    }
}
