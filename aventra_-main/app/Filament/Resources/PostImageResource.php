<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostImageResource\Pages;
use App\Models\PostImage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;

class PostImageResource extends Resource
{
    protected static ?string $model = PostImage::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationGroup = 'Посттар';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('post_id')
                    ->relationship('post', 'content')
                    ->required()
                    ->label('Пост'),

                FileUpload::make('image_path')
                    ->directory('post-images')
                    ->image()
                    ->required()
                    ->label('Суреті'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_path')
                    ->label('Суреті')
                    ->square()
                    ->height(60),

                TextColumn::make('post.title')
                    ->label('Пост')
                    ->searchable(),

                TextColumn::make('created_at')
                    ->label('Қосылды')
                    ->dateTime('d.m.Y H:i'),
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
            'index' => Pages\ListPostImages::route('/'),
            'create' => Pages\CreatePostImage::route('/create'),
            'edit' => Pages\EditPostImage::route('/{record}/edit'),
        ];
    }

    // Доступ только для админа и модератора
    public static function canAccess(): bool
    {
        return auth()->check() && in_array(auth()->user()->role, ['admin', 'moderator']);
    }

    public static function shouldRegisterNavigation(): bool
    {
        return static::canAccess();
    }

    public static function canViewAny(): bool
    {
        return static::canAccess();
    }

    public static function canCreate(): bool
    {
        return static::canAccess();
    }

    public static function canEdit($record): bool
    {
        return static::canAccess();
    }

    public static function canDelete($record): bool
    {
        return static::canAccess();
    }
}
