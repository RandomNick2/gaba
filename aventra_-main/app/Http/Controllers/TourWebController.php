<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Location;
use App\Models\TourImage;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Tour;

class TourWebController extends Controller
{

    public function index(Request $request)
    {
        $query = Tour::query();

        // Іздеу бойынша сүзгілеу
        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where('name', 'like', "%{$searchTerm}%")
                ->orWhere('description', 'like', "%{$searchTerm}%");
        }

        // Күні бойынша сүзгілеу
        if ($request->filled('date')) {
            $date = $request->input('date');
            $query->whereDate('date', '<=', $date); // Турдың күні ізделген күннен ерте немесе тең болуы керек
        }

        // Адам саны бойынша сүзгілеу
        if ($request->filled('people')) {
            $peopleCount = $request->input('people');
            $query->where('volume', '>=', $peopleCount); // Турдың орны ізделген адам санынан көп немесе тең болуы керек
        }

        // Қосымша сүзгілеулер (егер қажет болса)
        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        if ($request->filled('volume_max')) {
            $query->where('volume', '<=', $request->volume_max);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        // ✅ Отфильтрованные туры және пікірлер
        $tours = $query->with(['user', 'location', 'reviews'])->paginate(10); // ✅ 'reviews' қатынасын қосу

        // ✅ Справочные данные для фильтрации
        $users = User::all();
        $locations = Location::all();

        return view('tours.index', compact('tours', 'users', 'locations'));

    }

    public function create()
    {
        $users = User::all();
        $locations = Location::all();

        return view('tours.create', compact('users', 'locations'));
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'location_id' => 'required|exists:locations,id',
            'price' => 'required|numeric|min:0',
            'volume' => 'required|integer|min:1',
            'date' => 'required|date',
            'images.*' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:2048', // ✅ Множественные файлы
        ]);


        $tour = Tour::create($validatedData);


        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('tours', 'public');
                TourImage::create([
                    'tour_id' => $tour->id,
                    'image_path' => $imagePath
                ]);
            }
        }

        return redirect()->route('tours.index')->with('success', 'Тур успешно сохранён!');
    }

    public function show(Tour $tour)
    {
        $users = User::all();
        $locations = Location::all();

        $bookings = Booking::where('tour_id', $tour->id)
            ->where('user_id', auth()->id())
            ->get();
//        if (auth()->check()) {
//            $bookings = \App\Models\Booking::where('tour_id', $tour->id)
//                ->where('user_id', auth()->id())
//                ->get();
//        }
        return view('tours.show', compact('tour', 'users', 'locations','bookings'));
    }

    public function edit(Tour $tour){
        $users = User::all();
        $locations = Location::all();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'tour' => $tour,
                'users' => $users,
                'locations' => $locations,
            ]);
        }

        return view('tours.edit', compact('tour', 'users', 'locations'));
    }

    // 4. Обновление тура
    public function update(Request $request, Tour $tour)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'location_id' => 'required|exists:locations,id',
            'price' => 'required|numeric|min:0',
            'volume' => 'required|integer|min:0',
            'date' => 'required|date',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048', // уточнение форматов
        ]);

        // Если новое изображение загружено — сохранить и обновить
        if ($request->hasFile('image')) {
            // Удалить старое изображение, если оно есть
            if ($tour->image && \Storage::disk('public')->exists($tour->image)) {
                \Storage::disk('public')->delete($tour->image);
            }

            $validated['image'] = $request->file('image')->store('tours', 'public');
        }

        $tour->update($validated);
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Тур успешно обновлён',
            ]);
        }

        return redirect()->route('tours.index')->with('success', 'Тур успешно обновлён');
    }


    // 5. Удаление тура
    public function destroy($id)
    {
        $tour = Tour::findOrFail($id);
        $tour->delete();
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Тур успешно сохранён!',
            ]);
        }

        return redirect()->route('tours.index')->with('success', 'Тур успешно сохранён!');

    }

    // 6. Покупка тура (уменьшение volume)
    public function purchase(Request $request, $id)
    {
        $request->validate([
            'seats' => 'required|integer|min:1',
        ]);

        $tour = Tour::findOrFail($id);

        try {
            $tour->decreaseVolume($request->seats);
            return response()->json(['message' => 'Tour purchased successfully!', 'remaining_volume' => $tour->volume]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
