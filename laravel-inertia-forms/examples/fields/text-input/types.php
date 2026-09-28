<?php

// #region example
use Erag\InertiaForms\Fields\TextInput;

[
    TextInput::make('price')->number()->min(0)->step(0.01)->prefix('$'),
    TextInput::make('weight')->number()->min(0)->suffix('kg'),
    TextInput::make('subdomain')->prefix('https://')->suffix('.example.test'),
    TextInput::make('password')->password()->autocomplete('new-password')->minLength(8),
    TextInput::make('keyword')->search()->placeholder('Search products…')->clearable(),
];
// #endregion example
