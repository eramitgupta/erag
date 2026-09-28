<?php

// #region example
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\TextInput;

[
    Radio::make('contact_method')->inline()->default('email')->options([
        'email' => 'Email',
        'phone' => 'Phone',
    ]),
    TextInput::make('email')->email()->required()->visibleWhen('contact_method', 'email'),
    TextInput::make('phone')->tel()->required()->visibleWhen('contact_method', 'phone'),
];
// #endregion example
