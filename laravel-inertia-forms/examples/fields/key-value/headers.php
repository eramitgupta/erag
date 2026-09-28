<?php

// #region example
use Erag\InertiaForms\Fields\KeyValue;

KeyValue::make('headers')
    ->label('Request headers')
    ->keyLabel('Header')
    ->valueLabel('Value')
    ->keyPlaceholder('X-Api-Version')
    ->valuePlaceholder('2024-06-01')
    ->addActionLabel('Add header')
    ->maxItems(5)
    ->maxKeyLength(64);
// #endregion example
