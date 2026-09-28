<?php

// #region example
use Erag\InertiaForms\Fields\DatePicker;

DatePicker::make('meeting_at')
    ->label('Meeting')
    ->withTime()
    ->minDate(now())
    ->clearable()
    ->required();
// #endregion example
