<?php

// #region example
use Erag\InertiaForms\Fields\Checkbox;
use Erag\InertiaForms\Fields\TextInput;
use Illuminate\Validation\Rule;

[
    TextInput::make('username')
        ->required()
        ->minLength(3)
        ->maxLength(20)
        ->rules('alpha_dash')
        ->rule(Rule::unique('users', 'username')),
    TextInput::make('email')->email()->required(),
    TextInput::make('website')->url()->help('Optional. Gets nullable, so an empty value passes.'),
    Checkbox::make('terms')->label('I agree to the terms')->required(),
];
// #endregion example
