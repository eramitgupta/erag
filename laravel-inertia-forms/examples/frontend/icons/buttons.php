<?php

// #region example
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;

[
    TextInput::make('email')->email()->required(),
    Submit::make('Invite user')->icon('user'),
    Submit::make('Add to cart')->secondary()->icon('shopping-cart'),
    Submit::make('Launch')->outline()->icon('rocket', 'right'),
];
// #endregion example
