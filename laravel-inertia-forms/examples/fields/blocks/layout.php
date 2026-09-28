<?php

// #region example
use Erag\InertiaForms\Fields\Block;
use Erag\InertiaForms\Fields\Blocks;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;

Blocks::make('body')
    ->label('Article outline')
    ->addActionLabel('Add content block')
    ->blocks([
        Block::make('section')
            ->icon('§')
            ->description('Heading with notes')
            ->titleFrom('heading')
            ->fields([
                TextInput::make('heading')->required(),
                Textarea::make('summary'),
            ]),
        Block::make('quote')
            ->icon('“')
            ->description('Pull quote')
            ->titleFrom('author')
            ->columns(2)
            ->fields([
                Textarea::make('text')->label('Quote')->required()->columnSpan(2),
                TextInput::make('author')->required(),
                TextInput::make('source'),
            ]),
    ]);
// #endregion example
