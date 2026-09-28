<?php

// #region example
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\TextInput;

Fieldset::make('Contact details')
    ->columns(2)
    ->fields([
        TextInput::make('name')->required()->maxLength(100)->autocomplete('name'),
        TextInput::make('company')->autocomplete('organization'),
        TextInput::make('email')->email()->required()->autocomplete('email'),
        TextInput::make('phone')->tel()->autocomplete('tel')->placeholder('+91 98765 43210'),
        TextInput::make('website')->url()->placeholder('https://example.test')->columnSpan(2),
        TextInput::make('budget')
            ->number()
            ->min(500)
            ->max(100000)
            ->step(100)
            ->prefix('$')
            ->suffix('USD')
            ->help('Between 500 and 100,000.')
            ->columnSpan(2),
    ]);
// #endregion example
