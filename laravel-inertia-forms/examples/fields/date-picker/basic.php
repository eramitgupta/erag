<?php

// #region example
use Erag\InertiaForms\Fields\DatePicker;

DatePicker::make('birthday')
    ->label('Date of birth')
    ->minDate('1920-01-01')
    ->maxDate(today()->subYears(18))
    ->help('You must be at least 18.')
    ->required();
// #endregion example
