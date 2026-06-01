<?php

namespace App\Filament\Resources;

use App\Models\Location;
use App\Models\City;
use Filament\Forms;
use Filament\Tables;
use Filament\Resources\Resource;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\TextColumn;

class LocationResource extends Resource
{
    protected static ?string $model = Location::class;

    protected static ?string $navigationIcon = 'heroicon-o-map-pin'; // Камера вместо фотографии
    protected static ?string $navigationGroup = 'Әкімшілік';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name_kz')
                    ->label('Локация аты')
                    ->required()
                    ->maxLength(255),
                TextInput::make('name_en')
                    ->label('Локация аты')
                    ->required()
                    ->maxLength(255),

                Select::make('city_id')
                    ->label('Қала')
                    ->relationship('city', 'name_kz')
                    ->searchable()
                    ->nullable()
                    ->preload(),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name_kz')
                    ->label('Локация')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('name_en')
                    ->label('Location')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('city.name_kz')
                    ->label('Қала')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('city.name_en')
                    ->label('Қала')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Құрылған күні')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => LocationResource\Pages\ListLocations::route('/'),
            'create' => LocationResource\Pages\CreateLocation::route('/create'),
            'edit' => LocationResource\Pages\EditLocation::route('/{record}/edit'),
        ];
    }
}
