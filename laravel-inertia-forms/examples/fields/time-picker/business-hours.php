<?php

// #region example
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\TimePicker;

Fieldset::make('Opening hours')
    ->columns(2)
    ->fields([
        TimePicker::make('opens_at')
            ->minTime('06:00')
            ->maxTime('12:00')
            ->minuteStep(30)
            ->default('09:00')
            ->required(),
        TimePicker::make('closes_at')
            ->minTime('12:00')
            ->maxTime('23:30')
            ->minuteStep(30)
            ->default('18:00')
            ->required(),
    ]);
// #endregion example
