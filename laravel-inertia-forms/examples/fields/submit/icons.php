<?php

// #region example
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;

[
    TextInput::make('email')->email()->required(),
    TextInput::make('password')->password()->required(),
    Submit::make('Sign in')
        ->icon('arrowRight', 'right')
        ->processingLabel('Signing in…')
        ->fullWidth(),
];
// #endregion example
