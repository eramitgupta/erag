<?php

// #region example
use Erag\InertiaForms\Fields\Block;
use Erag\InertiaForms\Fields\Blocks;
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;

Blocks::make('sections')
    ->label('Landing page')
    ->addActionLabel('Add section')
    ->minItems(1)
    ->maxItems(6)
    ->collapsed()
    ->default([
        ['type' => 'hero', 'data' => ['title' => 'Forms in one PHP class', 'button_label' => 'Get started']],
        ['type' => 'cta', 'data' => ['text' => 'Ready to ship your next form?']],
    ])
    ->blocks([
        Block::make('hero')
            ->icon('H')
            ->description('Big title with a button')
            ->titleFrom('title')
            ->columns(2)
            ->fields([
                TextInput::make('title')->required()->columnSpan(2),
                Textarea::make('subtitle')->rows(2)->columnSpan(2),
                TextInput::make('button_label')->default('Learn more'),
                TextInput::make('button_url')->label('Button URL')->url()->default('/docs'),
            ]),
        Block::make('features')
            ->icon('F')
            ->description('Three short selling points')
            ->titleFrom('heading')
            ->columns(3)
            ->fields([
                TextInput::make('heading')->required()->columnSpan(3),
                TextInput::make('first')->required(),
                TextInput::make('second'),
                TextInput::make('third'),
            ]),
        Block::make('cta')
            ->label('Call to action')
            ->icon('→')
            ->description('Closing banner')
            ->titleFrom('text')
            ->fields([
                TextInput::make('text')->required(),
                Combobox::make('style')->options([
                    'accent' => 'Accent background',
                    'plain' => 'Plain',
                ])->default('accent'),
            ]),
    ]);
// #endregion example
