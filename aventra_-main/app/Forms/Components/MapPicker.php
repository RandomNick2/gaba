<?php

namespace App\Forms\Components;

use Filament\Forms\Components\Field;

class MapPicker extends Field
{
    protected string $view = 'forms.components.map-picker';

    protected function setUp(): void
    {
        parent::setUp();

        $this->afterStateHydrated(function ($component, $state) {
            if (is_array($state)) {
                $component->state([
                    'lat' => $state['lat'] ?? null,
                    'lng' => $state['lng'] ?? null,
                ]);
            }
        });

        $this->dehydrateStateUsing(function ($state) {
            return [
                'lat' => $state['lat'] ?? null,
                'lng' => $state['lng'] ?? null,
            ];
        });

        $this->dehydrated(true);
    }
}
