<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\City; // Егер қала бойынша сүзу болса
use App\Models\EventType; // Егер оқиға түрі бойынша сүзу болса
use Illuminate\Http\Request;

class EventController extends Controller
{
    // 1. Барлық оқиғаларды алу (сүзумен)
    public function index(Request $request)
    {
        $query = Event::query()->with(['city', 'eventType', 'user']);

        // Тақырып бойынша іздеу
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->input('search') . '%')
                ->orWhere('description', 'like', '%' . $request->input('search') . '%');
        }

        // Күні бойынша сүзу (start_date)
        if ($request->filled('date')) {
            $query->whereDate('start_date', $request->input('date'));
        }

        // Қала бойынша сүзу (city_id немесе location_name)
        if ($request->filled('city_id')) {
            $query->where('city_id', $request->input('city_id'));
        } elseif ($request->filled('location_name')) { // Frontend-тен location_name келсе
            $query->where('location_name', 'like', '%' . $request->input('location_name') . '%');
        }


        // Оқиға түрі бойынша сүзу (event_type_id немесе event_type_name)
        if ($request->filled('event_type_id')) {
            $query->where('event_type_id', $request->input('event_type_id'));
        } elseif ($request->filled('event_type_name')) { // Frontend-тен event_type_name келсе
            $query->whereHas('eventType', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->input('event_type_name') . '%');
            });
        }


        $events = $query->latest('start_date')->paginate(10); // Жақынырақ оқиғаларды бірінші көрсету

        return response()->json([
            'success' => true,
            'data' => $events,
        ], 200);
    }

    // 2. Жеке оқиғаны көрсету
    public function show(Event $event)
    {
        $event->load(['city', 'eventType', 'user']); // Қатысты қатынастарды жүктеу
        return response()->json([
            'success' => true,
            'data' => $event,
        ], 200);
    }
}
