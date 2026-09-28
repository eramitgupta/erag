<?php

// #region example
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Slug;
use Erag\InertiaForms\Fields\TextInput;

Fieldset::make('Wiki page')
    ->fields([
        TextInput::make('title')->required()->maxLength(120),
        Slug::make('path')
            ->from('title')
            ->prefix('wiki.example.test/')
            ->separator('_')
            ->keepCase()
            ->maxLength(60)
            ->required()
            ->help('Keeps capitals, like Getting_Started. Edit it to use a custom path.'),
    ]);
// #endregion example
