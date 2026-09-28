<?php

// #region example
use Erag\InertiaForms\Fields\Repeater;
use Erag\InertiaForms\Fields\TextInput;

Repeater::make('links')
    ->itemLabel('Link')
    ->fields([
        TextInput::make('label')->required(),
        TextInput::make('url')->label('URL')->url()->required(),
    ]);
// #endregion example
