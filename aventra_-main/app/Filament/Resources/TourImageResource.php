<?php

namespace App\Filament\Resources;

use App\Models\TourImage;
use App\Models\Tour;
use Filament\Forms;
use Filament\Tables;
use Filament\Resources\Resource;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;

class TourImageResource extends Resource
{
    protected static ?string $model = TourImage::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo'; // Иконка "фото"
    protected static ?string $navigationGroup = 'Турлар';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('tour_id')
                    ->label('Тур')
                    ->relationship('tour', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),

                FileUpload::make('image_path')
                    ->label('Сурет')
                    ->image()
                    ->directory('tour-images') // Куда сохраняем фото
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('tour.name')
                    ->label('Тур')
                    ->sortable()
                    ->searchable(),

                ImageColumn::make('image_path')
                    ->label('Сурет')
                    ->circular(),
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
            'index' => TourImageResource\Pages\ListTourImages::route('/'),
            'create' => TourImageResource\Pages\CreateTourImage::route('/create'),
            'edit' => TourImageResource\Pages\EditTourImage::route('/{record}/edit'),
        ];
    }
}
