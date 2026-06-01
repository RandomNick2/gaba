<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HotelController extends Controller
{
    /**
     * Отображает список отелей.
     */
    public function index()
    {
        $hotels = Hotel::paginate(10);
         return response()->json(['hotels' => $hotels]);
//       return view('hotels.index', compact('hotels'));
    }

    /**
     * Показывает форму создания отеля.
     */
    public function create()
    {
        return view('hotels.create');
    }

    /**
     * Сохраняет новый отель.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'description' => 'required|string',
            'stars' => 'numeric|min:1|max:5',
            'price_per_night' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'room_types' => 'required|array|min:1',
            'room_types.*.name' => 'required|string|max:255',
            'room_types.*.price_per_night' => 'required|numeric|min:0',
            'room_types.*.max_guests' => 'required|integer|min:1',
            'room_types.*.available_rooms' => 'required|integer|min:0',
            'room_types.*.description' => 'nullable|string',
            'room_types.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'room_types.*.has_breakfast' => 'nullable|boolean',
            'room_types.*.has_wifi' => 'nullable|boolean',
            'room_types.*.has_tv' => 'nullable|boolean',
            'room_types.*.has_air_conditioning' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('hotels', 'public');
            $validated['image'] = $path;
        }

        $hotel = Hotel::create($validated);

        // Создаем типы номеров
        foreach ($request->room_types as $roomTypeData) {
            $roomType = new RoomType();
            $roomType->hotel_id = $hotel->id;
            $roomType->fill($roomTypeData);

            if (isset($roomTypeData['image']) && $roomTypeData['image']) {
                $path = $roomTypeData['image']->store('room-types', 'public');
                $roomType->image = $path;
            }

            $roomType->save();
        }

        return redirect()->route('hotels.show', $hotel)
            ->with('success', 'Отель успешно добавлен!');
    }

    /**
     * Отображает указанный отель.
     */
    public function show(Hotel $hotel)
    {
        $hotel->load('roomTypes');
         return response()->json(['hotels' => $hotel]);
//       return view('hotels.show', compact('hotel'));
    }

    /**
     * Показывает форму редактирования отеля.
     */
    public function edit(string $id)
    {
        $hotel = Hotel::with('roomTypes')->findOrFail($id);
        return view('hotels.edit', compact('hotel'));
    }

    /**
     * Обновляет указанный отель.
     */
    public function update(Request $request, Hotel $hotel)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'description' => 'required|string',
            'stars' => 'required|integer|min:1|max:5',
            'price_per_night' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'room_types' => 'required|array|min:1',
            'room_types.*.id' => 'nullable|exists:room_types,id',
            'room_types.*.name' => 'required|string|max:255',
            'room_types.*.price_per_night' => 'required|numeric|min:0',
            'room_types.*.max_guests' => 'required|integer|min:1',
            'room_types.*.available_rooms' => 'required|integer|min:0',
            'room_types.*.description' => 'nullable|string',
            'room_types.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'room_types.*.has_breakfast' => 'nullable|boolean',
            'room_types.*.has_wifi' => 'nullable|boolean',
            'room_types.*.has_tv' => 'nullable|boolean',
            'room_types.*.has_air_conditioning' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($hotel->image) {
                Storage::disk('public')->delete($hotel->image);
            }
            $path = $request->file('image')->store('hotels', 'public');
            $validated['image'] = $path;
        }

        $hotel->update($validated);

        // Обновляем существующие типы номеров и создаем новые
        foreach ($request->room_types as $roomTypeData) {
            if (isset($roomTypeData['id'])) {
                // Обновляем существующий тип номера
                $roomType = RoomType::find($roomTypeData['id']);
                if ($roomType && $roomType->hotel_id === $hotel->id) {
                    if (isset($roomTypeData['image']) && $roomTypeData['image']) {
                        if ($roomType->image) {
                            Storage::disk('public')->delete($roomType->image);
                        }
                        $path = $roomTypeData['image']->store('room-types', 'public');
                        $roomTypeData['image'] = $path;
                    }
                    $roomType->update($roomTypeData);
                }
            } else {
                // Создаем новый тип номера
                $roomType = new RoomType();
                $roomType->hotel_id = $hotel->id;
                $roomType->fill($roomTypeData);
                if (isset($roomTypeData['image']) && $roomTypeData['image']) {
                    $path = $roomTypeData['image']->store('room-types', 'public');
                    $roomType->image = $path;
                }
                $roomType->save();
            }
        }

        return redirect()->route('hotels.show', $hotel)
            ->with('success', 'Отель успешно обновлен!');
    }

    /**
     * Удаляет указанный отель.
     */
    public function destroy(string $id)
    {
        $hotel = Hotel::findOrFail($id);

        // Удаляем изображение, если оно есть
        if ($hotel->image) {
            Storage::disk('public')->delete($hotel->image);
        }

        $hotel->delete();

        return redirect()->route('hotels.index')
            ->with('success', 'Отель успешно удален');
    }
}
