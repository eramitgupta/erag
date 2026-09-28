<?php

// #region example
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Slider;

Fieldset::make('Project brief')
    ->description('Rough numbers are fine; we will refine them on the call.')
    ->columns(2)
    ->fields([
        Slider::make('budget')
            ->label('Budget')
            ->min(1000)
            ->max(20000)
            ->step(500)
            ->suffix(' USD')
            ->default(5000)
            ->columnSpan(2),
        Slider::make('team_size')->min(1)->max(12)->suffix(' people')->default(3),
        Slider::make('weeks')->label('Timeline')->min(2)->max(26)->suffix(' weeks')->default(8),
        Slider::make('urgency')
            ->min(1)
            ->max(5)
            ->showValue(false)
            ->help('Left: whenever it is ready. Right: as soon as possible.')
            ->columnSpan(2),
    ]);
// #endregion example
