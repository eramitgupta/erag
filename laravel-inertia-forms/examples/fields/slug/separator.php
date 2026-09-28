<?php

// #region example
use Erag\InertiaForms\Fields\Slug;
use Erag\InertiaForms\Fields\TextInput;

[
    TextInput::make('name')->label('Full name'),
    Slug::make('username')
        ->from('name')
        ->prefix('@')
        ->separator('_')
        ->maxLength(20),
];
// #endregion example
