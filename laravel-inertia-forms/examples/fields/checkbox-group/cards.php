<?php

// #region example
use Erag\InertiaForms\Fields\CheckboxGroup;

CheckboxGroup::make('channels')
    ->label('Notify me by')
    ->options([
        ['value' => 'email', 'label' => 'Email', 'description' => 'A summary once a day'],
        ['value' => 'sms', 'label' => 'SMS', 'description' => 'Only for urgent alerts'],
        ['value' => 'push', 'label' => 'Push', 'description' => 'On your phone and desktop'],
        ['value' => 'fax', 'label' => 'Fax', 'description' => 'Retired', 'disabled' => true],
    ])
    ->columns(2)
    ->required();
// #endregion example
