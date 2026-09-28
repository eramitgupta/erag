<?php

// #region example
use Erag\InertiaForms\Fields\Heading;
use Erag\InertiaForms\Fields\Separator;
use Erag\InertiaForms\Fields\Text;
use Erag\InertiaForms\Fields\TextInput;

[
    Heading::make('Billing details')->level(2),
    Text::make('Use the legal name of your company, as it appears on invoices.'),
    TextInput::make('company')->required(),
    TextInput::make('vat_number')->label('VAT number'),
    Separator::make()->spacing('lg'),
    Heading::make('Invoice email'),
    TextInput::make('billing_email')->email(),
];
// #endregion example
