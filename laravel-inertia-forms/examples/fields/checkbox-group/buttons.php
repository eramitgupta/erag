<?php

// #region example
use Erag\InertiaForms\Fields\CheckboxGroup;

[
    CheckboxGroup::make('workdays')
        ->options([
            'mon' => 'Mon', 'tue' => 'Tue', 'wed' => 'Wed', 'thu' => 'Thu',
            'fri' => 'Fri', 'sat' => 'Sat', 'sun' => 'Sun',
        ])
        ->default(['mon', 'tue', 'wed', 'thu', 'fri'])
        ->buttons()
        ->required(),
    CheckboxGroup::make('interests')
        ->options(['Design', 'Frontend', 'Backend', 'DevOps', 'Testing', 'Security'])
        ->buttons()
        ->rule('max:3')
        ->help('Pick up to three.'),
];
// #endregion example
