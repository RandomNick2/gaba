<?php

namespace App\Filament\Resources;

use App\Models\Tour;
use App\Models\Location;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Components\DateTimePicker;
use Filament\Tables;
use Filament\Resources\Resource;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Forms\Components\Checkbox;
use Illuminate\Support\Facades\Auth;

class TourResource extends Resource
{
    protected static ?string $model = Tour::class;

    protected static ?string $navigationIcon = 'heroicon-o-map'; // Иконка "чемодан"
    protected static ?string $navigationGroup = 'Әкімшілік';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name_kz')
                    ->label('Тур аты')
                    ->required()
                    ->maxLength(255),
                TextInput::make('name_en')
                    ->label('Тур аты')
                    ->required()
                    ->maxLength(255),

                Textarea::make('description_kz')
                    ->label('Тур сипаттамасы')
                    ->required()
                    ->maxLength(65535),

                Textarea::make('description_en')
                    ->label('Тур сипаттамасы')
                    ->required()
                    ->maxLength(65535),

                Select::make('user_id')
                    ->label('Тур жетекшісі')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->nullable()
                    ->preload(),

                Select::make('location_id')
                    ->label('Локация')
                    ->relationship('location', 'name_en')
                    ->searchable()
                    ->nullable()
                    ->preload(),

                TextInput::make('price')
                    ->label('Бағасы')
                    ->numeric()
                    ->required(),

                TextInput::make('volume')
                    ->label('Орын саны')
                    ->numeric()
                    ->required(),

                DateTimePicker::make('date')
                    ->label('Күні')
                    ->required(),

                FileUpload::make('image')
                    ->label('Тур суреті')
                    ->image()
                    ->directory('tours') // Куда будут загружаться файлы
                    ->nullable(),

                Checkbox::make('featured')
                    ->label('Басты бетте көрсету')
                    ->visible(fn () => in_array(Auth::user()->role, ['admin', 'moderator']))
                    ->default(false),
            ]);
    }

//    public static function mutateFormDataBeforeCreate(array $data): array
//    {
//        $data['user_id'] = Auth()->id();// текущий авторизованный пользователь
//        return $data;
//    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name_kz')
                    ->label('Тур аты')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('name_en')
                    ->label('Тур аты')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('user.name')
                    ->label('Тур жетекшісі')
                    ->sortable(),

                TextColumn::make('location.name_en')
                    ->label('Локация')
                    ->sortable(),

                TextColumn::make('price')
                    ->label('Бағасы')
                    ->money('kzt') // Или выберите свою валюту
                    ->sortable(),

                TextColumn::make('volume')
                    ->label('Орын саны'),

                TextColumn::make('date')
                    ->label('Күні')
                    ->sortable(),

                TextColumn::make('featured')
                    ->label('Таңдаулы')
                    ->badge()
                    ->formatStateUsing(fn ($state) => $state ? 'Иә' : 'Жоқ')
                    ->visible(fn () => Auth::user()->role === 'admin' || Auth::user()->role === 'moderator'),

                ImageColumn::make('image')
                    ->label('Суреті')
                    ->circular(), // Красивая круглая форма картинки
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
            'index' => TourResource\Pages\ListTours::route('/'),
            'create' => TourResource\Pages\CreateTour::route('/create'),
            'edit' => TourResource\Pages\EditTour::route('/{record}/edit'),
        ];
    }
}
