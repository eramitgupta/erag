<?php

// #region example
use Erag\InertiaForms\Fields\TimePicker;

TimePicker::make('reminder_at')
    ->label('Daily reminder')
    ->minuteStep(15)
    ->clearable();
// #endregion example
