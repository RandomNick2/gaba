@if($roomType->image)
    <div class="mb-4">
        <img src="{{ asset('storage/' . $roomType->image) }}" alt="{{ $roomType->name }}" class="img-fluid rounded">
    </div>
@endif
