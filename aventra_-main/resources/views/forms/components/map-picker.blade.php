<div style="margin-bottom: 1rem;">
    <div id="map" style="
        height: 300px;
        width: 100%;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        border: 1px solid #ddd;
    "></div>

    {{-- Ендік/бойлықты Livewire state-ке байлау --}}
    <input type="hidden" wire:model="{{ $getStatePath() }}.lat" id="{{ $getId() }}-lat" />
    <input type="hidden" wire:model="{{ $getStatePath() }}.lng" id="{{ $getId() }}-lng" />
</div>

<script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const latInput = document.getElementById('{{ $getId() }}-lat');
        const lngInput = document.getElementById('{{ $getId() }}-lng');

        const initialLat = parseFloat(latInput?.value) || 43.238949;
        const initialLng = parseFloat(lngInput?.value) || 76.889709;

        const map = L.map('map').setView([initialLat, initialLng], 8);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        let marker = null;

        if (!isNaN(initialLat) && !isNaN(initialLng)) {
            marker = L.marker([initialLat, initialLng]).addTo(map);
            map.setView([initialLat, initialLng], 12);
        }

        map.on('click', function (e) {
            const { lat, lng } = e.latlng;

            if (marker) {
                marker.setLatLng(e.latlng);
            } else {
                marker = L.marker(e.latlng).addTo(map);
            }

            // Livewire state-ті жаңарту
            if (latInput && lngInput) {
                latInput.value = lat.toFixed(7);
                lngInput.value = lng.toFixed(7);
                latInput.dispatchEvent(new Event('input'));
                lngInput.dispatchEvent(new Event('input'));
            }
        });
    });
</script>

