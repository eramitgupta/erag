<?php

// #region example
use Erag\InertiaForms\Fields\Hidden;
use Erag\InertiaForms\Fields\TextInput;

[
    TextInput::make('email')->email()->required(),
    Hidden::make('source')->default('pricing-page'),
];
// #endregion example
