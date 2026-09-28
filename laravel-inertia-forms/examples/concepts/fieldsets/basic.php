<?php

// #region example
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\TextInput;

Fieldset::make('Shipping address')
    ->description('Where should we send your order?')
    ->fields([
        TextInput::make('shipping.street')->required(),
        TextInput::make('shipping.city'),
        TextInput::make('shipping.postal_code'),
    ]);
// #endregion example
