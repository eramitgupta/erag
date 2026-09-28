<?php

// #region example
use Erag\InertiaForms\Fields\Checkbox;

[
    Checkbox::make('newsletter')
        ->label('Send me the monthly newsletter')
        ->trueValue('yes')
        ->falseValue('no'),
    Checkbox::make('marketing_opt_in')
        ->label('I’m happy to hear about offers')
        ->trueValue(1)
        ->falseValue(0),
];
// #endregion example
