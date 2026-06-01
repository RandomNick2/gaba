<?php

namespace App\Filament\Resources\PostImageResource\Pages;

use App\Filament\Resources\PostImageResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPostImages extends ListRecords
{
    protected static string $resource = PostImageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
