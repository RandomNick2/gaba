<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EventResource\Pages;
use App\Filament\Resources\EventResource\RelationManagers;
use App\Models\Event;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

class EventResource extends Resource
{
    protected static ?string $model = Event::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar'; // Оқиғаларға сәйкес иконка
    protected static ?string $navigationGroup = 'Әкімшілік';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('title_kz')
                    ->label('Тақырыбы')
                    ->required()
                    ->maxLength(255),

                TextInput::make('title_en')
                    ->label('Title')
                    ->required()
                    ->maxLength(255),

                Textarea::make('description_kz')
                    ->label('Сипаттамасы')
                    ->required()
                    ->rows(5)
                    ->maxLength(65535),

                Textarea::make('description_en')
                    ->label('Description')
                    ->required()
                    ->rows(5)
                    ->maxLength(65535),

                Select::make('user_id')
                    ->label('Қосушы')
                    ->relationship('user', 'name')
                    ->default(auth()->id()) // Әдепкі бойынша кірген қолданушы
                    ->disabled() // Автоматты толтырылатын болғандықтан
                    ->dehydrated(fn ($state) => filled($state)), // Мәні null болса, жоймау

                Select::make('city_id')
                    ->label('Қаласы')
                    ->relationship('city', 'name_en')
                    ->searchable()
                    ->nullable()
                    ->preload(),

                Select::make('event_type_id')
                    ->label('Оқиға түрі')
                    ->relationship('eventType', 'name_en')
                    ->searchable()
                    ->nullable()
                    ->preload(),

                DateTimePicker::make('start_date')
                    ->label('Басталу күні мен уақыты')
                    ->required(),

                DateTimePicker::make('end_date')
                    ->label('Аяқталу күні мен уақыты')
                    ->nullable(),

                TextInput::make('location_name_kz')
                    ->label('Өтетін орын атауы')
                    ->nullable()
                    ->maxLength(255),

                TextInput::make('location_name_en')
                    ->label('Place')
                    ->nullable()
                    ->maxLength(255),

                TextInput::make('address_kz')
                    ->label('Толық мекенжайы')
                    ->nullable()
                    ->maxLength(255),

                TextInput::make('address_en')
                    ->label('Address')
                    ->nullable()
                    ->maxLength(255),

                TextInput::make('latitude')
                    ->label('Ендік (Latitude)')
                    ->numeric()
                    ->nullable(),

                TextInput::make('longitude')
                    ->label('Бойлық (Longitude)')
                    ->numeric()
                    ->nullable(),

                TextInput::make('price_info')
                    ->label('Бағасы/Кіру шарттары')
                    ->nullable()
                    ->maxLength(255),

                TextInput::make('organizer')
                    ->label('Ұйымдастырушы')
                    ->nullable()
                    ->maxLength(255),

                TextInput::make('phone')
                    ->label('Телефон')
                    ->nullable()
                    ->tel() // Телефон форматын тексеру
                    ->maxLength(255),

                TextInput::make('email')
                    ->label('Email')
                    ->nullable()
                    ->email() // Email форматын тексеру
                    ->maxLength(255),

                TextInput::make('website')
                    ->label('Веб-сайт')
                    ->nullable()
                    ->url() // URL форматын тексеру
                    ->maxLength(255),

                FileUpload::make('image')
                    ->label('Негізгі сурет')
                    ->image()
                    ->directory('events') // Куда будут загружаться файлы
                    ->nullable(),

                TextInput::make('video_url')
                    ->label('Бейне сілтемесі (YouTube, Vimeo)')
                    ->url() // URL форматын тексеру
                    ->nullable()
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title_kz')
                    ->label('Тақырыбы')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('title_en')
                    ->label('Title')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('user.name')
                    ->label('Қосушы')
                    ->sortable(),
                TextColumn::make('eventType.name')
                    ->label('Түрі')
                    ->sortable(),
                TextColumn::make('city_id') // City моделі бар болса
                    ->label('Қаласы')
                    ->sortable(),

                TextColumn::make('start_date')
                    ->label('Басталу күні')
                    ->dateTime()
                    ->sortable(),

                TextColumn::make('price_info')
                    ->label('Бағасы')
                    ->sortable(),

                ImageColumn::make('image')
                    ->label('Суреті')
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
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEvents::route('/'),
            'create' => Pages\CreateEvent::route('/create'),
            'edit' => Pages\EditEvent::route('/{record}/edit'),
        ];
    }

    // ✅ Автоматты түрде user_id толтыру
    public static function mutateFormDataBeforeCreate(array $data): array
    {
        $data['user_id'] = auth()->id();
        return $data;
    }
}
