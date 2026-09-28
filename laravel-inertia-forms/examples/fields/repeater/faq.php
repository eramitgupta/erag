<?php

// #region example
use Erag\InertiaForms\Fields\Repeater;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;

Repeater::make('faq')
    ->label('FAQ')
    ->itemLabel('Question')
    ->titleFrom('question')
    ->maxItems(5)
    ->fields([
        TextInput::make('question')->required(),
        Textarea::make('answer')->rows(2)->required(),
    ]);
// #endregion example
