<?php

// #region example
use Erag\InertiaForms\Fields\TimePicker;

TimePicker::make('start_time')
    ->label('Race start')
    ->withSeconds()
    ->minuteStep(1)
    ->minTime('07:00:00')
    ->maxTime('09:30:00')
    ->help('Between 07:00 and 09:30, to the second.')
    ->required();
// #endregion example
