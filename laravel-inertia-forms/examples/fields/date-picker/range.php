<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\DatePicker;
use Erag\InertiaForms\Fields\Fieldset;

Fieldset::make('Your stay')
    ->columns(3)
    ->fields([
        DatePicker::make('stay')
            ->label('Check-in and check-out')
            ->range()
            ->months(2)
            ->firstDayOfWeek(1)
            ->minDate(today())
            ->clearable()
            ->required()
            ->columnSpan(2),
        Combobox::make('guests')->options([
            1 => '1 guest',
            2 => '2 guests',
            3 => '3 guests',
            4 => '4 guests',
        ])->default(2),
    ]);
// #endregion example
