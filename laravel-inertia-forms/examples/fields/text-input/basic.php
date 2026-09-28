<?php

// #region example
use Erag\InertiaForms\Fields\TextInput;

[
    TextInput::make('name')->required()->maxLength(100),
    TextInput::make('email')->email()->required(),
];
// #endregion example
