<?php

namespace App\Filament\Resources\HomeRedirectResource\Pages;

use App\Filament\Resources\HomeRedirectResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditHomeRedirect extends EditRecord
{
    protected static string $resource = HomeRedirectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
