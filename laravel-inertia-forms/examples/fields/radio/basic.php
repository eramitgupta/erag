<?php

// #region example
use Erag\InertiaForms\Fields\Radio;

Radio::make('contact_method')
    ->options(['email' => 'Email', 'phone' => 'Phone', 'none' => 'Don’t contact me'])
    ->inline()
    ->required();
// #endregion example
