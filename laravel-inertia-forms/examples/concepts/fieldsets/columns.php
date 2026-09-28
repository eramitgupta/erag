<?php

// #region example
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\TextInput;

Fieldset::make('Shipping address')
    ->description('Two columns on larger screens, one on phones.')
    ->columns(2)
    ->fields([
        TextInput::make('shipping.street')->required()->columnSpan(2),
        TextInput::make('shipping.city')->required(),
        TextInput::make('shipping.postal_code'),
        Combobox::make('shipping.country')->searchable()->options([
            'IN' => 'India',
            'US' => 'United States',
            'DE' => 'Germany',
        ]),
        TextInput::make('shipping.phone')->tel(),
    ]);
// #endregion example
