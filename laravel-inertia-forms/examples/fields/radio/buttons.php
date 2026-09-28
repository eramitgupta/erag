<?php

// #region example
use Erag\InertiaForms\Fields\Radio;

[
    Radio::make('billing')
        ->label('Billing period')
        ->options(['monthly' => 'Monthly', 'yearly' => 'Yearly (2 months free)'])
        ->default('monthly')
        ->buttons(),
    Radio::make('size')
        ->options(['XS', 'S', 'M', 'L', 'XL'])
        ->buttons()
        ->required(),
];
// #endregion example
