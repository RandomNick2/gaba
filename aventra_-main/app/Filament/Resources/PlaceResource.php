<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PlaceResource\Pages;
use App\Models\Place;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Forms\Components\View;
use App\Forms\Components\MapPicker;

class PlaceResource extends Resource
{
    protected static ?string $model = Place::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name_kz')->required(),
                TextInput::make('name_en')->required(),
                TextInput::make('city')->required(),
                TextInput::make('country')->required(),
                Textarea::make('description_kz')->required(),
                Textarea::make('description_en')->required(),

                // ❗ Тек бір ғана карта компоненті
                View::make('forms.components.map-picker')->columnSpan('full'),

                // ❗ Бұл input-тар карта арқылы толтырылады
                TextInput::make('lat')
                    ->label('Ендік')
                    ->id('lat-display') // 👈 id қою міндетті
                    ->readOnly(),

                TextInput::make('lng')
                    ->label('Бойлық')
                    ->id('lng-display') // 👈 id қою міндетті
                    ->readOnly(),



                FileUpload::make('images')
                    ->multiple()
                    ->image()
                    ->directory('places')
                    ->reorderable()
                    ->preserveFilenames()
                    ->columnSpan('full'),

                Textarea::make('things_to_do')
                    ->label('Не істеуге болады')
                    ->rows(3)
                    ->helperText('JSON немесе жай мәтін ретінде жазыңыз'),
            ]);
    }


    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name_kz')->searchable(),
                TextColumn::make('name_en')->searchable(),
                TextColumn::make('city'),
                ImageColumn::make('images.0')->label('Басты сурет'),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPlaces::route('/'),
            'create' => Pages\CreatePlace::route('/create'),
            'edit' => Pages\EditPlace::route('/{record}/edit'),
        ];
    }
}
