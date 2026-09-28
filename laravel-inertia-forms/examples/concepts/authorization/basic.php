<?php

// #region example
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;

[
    TextInput::make('name')->required(),
    TextInput::make('email')->email()->required(),
    // In your app: ->authorizedWhen($user->can('manage-salaries'))
    TextInput::make('salary')->number()->prefix('€')->authorizedWhen(false),
    // In your app: ->authorizedUnless($user->isGuest())
    Textarea::make('notes')->rows(2)->authorizedUnless(false),
];
// #endregion example
