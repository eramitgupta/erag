<?php

// #region example
use Erag\InertiaForms\Fields\KeyValue;

KeyValue::make('limits')
    ->label('API limits')
    ->keyLabel('Limit')
    ->default([
        'requests_per_minute' => '60',
        'burst' => '10',
        'daily_quota' => '10000',
    ])
    ->editableKeys(false)
    ->addable(false)
    ->deletable(false)
    ->reorderable(false)
    ->maxValueLength(10)
    ->help('Only the values can be changed.');
// #endregion example
