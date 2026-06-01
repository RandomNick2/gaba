<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookingResource\Pages;
use App\Models\Booking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-check';
    protected static ?string $navigationGroup = 'Турлар';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('tour_id')
                ->relationship('tour', 'name')
                ->required(),

            Forms\Components\Select::make('user_id')
                ->relationship('user', 'name')
                ->required(),

            Forms\Components\TextInput::make('seats')
                ->numeric()
                ->minValue(1)
                ->required(),

            Forms\Components\Toggle::make('is_paid'),

            Forms\Components\DateTimePicker::make('expires_at')
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('tour.name')->label('Тур'),
                Tables\Columns\TextColumn::make('user.name')->label('Қолданушы'),
                Tables\Columns\TextColumn::make('seats')->label('Орын саны'),
                Tables\Columns\BooleanColumn::make('is_paid')->label('Тқлем статусы'),
                Tables\Columns\TextColumn::make('expires_at')->label('Мерзімі бітеді')->dateTime(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->defaultSort('expires_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBookings::route('/'),
            'create' => Pages\CreateBooking::route('/create'),
            'edit' => Pages\EditBooking::route('/{record}/edit'),
        ];
    }

    /**
     * Ограничить видимость для гидов — только их туры
     */
    public static function getEloquentQuery(): Builder
    {
        $user = Auth::user();

        // Если пользователь — гид (например, роль user), фильтруем
        if ($user && $user->hasRole(['guide','admin'])) {
            return parent::getEloquentQuery()
                ->whereHas('tour', fn ($query) => $query->where('user_id', $user->id));
        }

        return parent::getEloquentQuery();
    }
}
