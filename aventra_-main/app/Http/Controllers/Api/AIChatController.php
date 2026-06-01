<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Tour;
use App\Models\Hotel;
use App\Models\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\App;

class AIChatController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*.role' => 'required|string|in:user,assistant,model,system',
            'messages.*.content' => 'required|string|max:1000',
        ]);

        $messages = $request->input('messages');
        $userMessage = collect($messages)->last()['content'] ?? '';

        $currentLocale = App::getLocale();
        Log::info('AIChatController: Current locale for request', ['locale' => $currentLocale]);

        // Қалалар бойынша іздеу
        $cities = City::select('id', 'name_kz', 'name_en')->get();
        $matchedCity = null;

        foreach ($cities as $city) {
            if (stripos($userMessage, $city->name_kz ?? '') !== false || stripos($userMessage, $city->name_en ?? '') !== false) {
                $matchedCity = $city;
                break;
            }
        }

        // Турларды алу
        $tours = Tour::with('location')
            ->when($matchedCity, function ($query) use ($matchedCity) {
                $query->whereHas('location', function ($q) use ($matchedCity) {
                    $q->where('name_kz', 'LIKE', "%{$matchedCity->name_kz}%")
                      ->orWhere('name_en', 'LIKE', "%{$matchedCity->name_en}%");
                });
            })
            ->latest()
            ->take(3)
            ->get();

        // Турлар сипаттамасы
        $tourList = $tours->map(function ($tour) use ($currentLocale) {
            $locationName = $tour->location?->{"name_{$currentLocale}"} ?? 'Не указан';
            $tourTitle = $tour->{"name_{$currentLocale}"} ?? 'Без названия';
            $tourDescription = $tour->{"description_{$currentLocale}"} ?? 'Без описания';

            $shortDescription = mb_substr($tourDescription, 0, 100) . (mb_strlen($tourDescription) > 100 ? '...' : '');

            return "- {$tourTitle} ({$locationName}): {$tour->price} ₸ — {$shortDescription}";
        })->implode("\n");

        // System message
        $system = "Ты — AI-ассистент проекта Aventra, посвящённого турам и бронированию отелей по Казахстану.
Отвечай только на вопросы по теме туров, отелей, бронирования и маршрутов.
Вот подходящие туры, найденные по запросу пользователя: \n\n" . ($tourList ?: "Подходящие туры не найдены.");

        array_unshift($messages, ["role" => "system", "content" => $system]);

        // OpenAI API кілті
        $openaiApiKey = config('services.openai.key');

        if (!$openaiApiKey) {
            Log::error('OpenAI API Key орнатылмаған.');
            return response()->json(['message' => 'AI API Key орнатылмаған.'], 500);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $openaiApiKey,
                'Content-Type' => 'application/json'
            ])->timeout(60)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => $messages,
                'max_tokens' => 200,
                'temperature' => 0.7,
            ]);

            if (!$response->successful()) {
                Log::error('OpenAI API қатесі:', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return response()->json([
                    'message' => 'AI жауап бере алмады.',
                    'status' => $response->status(),
                    'details' => $response->body(),
                ], $response->status());
            }

            $data = $response->json();
            Log::info('OpenAI API Full Response:', $data);

            $reply = $data['choices'][0]['message']['content'] ?? 'Ответ не получен от OpenAI.';

            return response()->json([
                'success' => true,
                'answer' => $reply,
            ]);

        } catch (\Exception $e) {
            Log::error('AIChatController Exception:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'AI қызметіне қосылу мүмкін болмады.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
