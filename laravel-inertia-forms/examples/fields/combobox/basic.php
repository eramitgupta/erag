<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;

Combobox::make('country')
    ->options([
        'IN' => 'India',
        'US' => 'United States',
        'GB' => 'United Kingdom',
    ])
    ->required();
// #endregion example
