<?php

// #region example
use Erag\InertiaForms\Fields\Radio;

Radio::make('shipping')
    ->options([
        ['value' => 'standard', 'label' => 'Standard', 'description' => '3 to 5 business days, free'],
        ['value' => 'express', 'label' => 'Express', 'description' => 'Next business day, $12'],
        ['value' => 'pickup', 'label' => 'Store pickup', 'description' => 'Ready in 2 hours'],
        ['value' => 'drone', 'label' => 'Drone', 'description' => 'Coming soon', 'disabled' => true],
    ])
    ->default('standard')
    ->columns(2)
    ->required();
// #endregion example
