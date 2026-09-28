<?php

// #region example
use Erag\InertiaForms\Fields\Block;
use Erag\InertiaForms\Fields\Blocks;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;

Blocks::make('body')
    ->label('Article outline')
    ->blocks([
        Block::make('section')->fields([
            TextInput::make('heading')->required(),
            Textarea::make('summary'),
        ]),
        Block::make('quote')->fields([
            Textarea::make('text')->label('Quote')->required(),
            TextInput::make('author'),
        ]),
    ]);
// #endregion example
