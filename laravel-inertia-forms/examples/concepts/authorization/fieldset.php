<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;

[
    Fieldset::make('Profile')->columns(2)->fields([
        TextInput::make('name')->required(),
        TextInput::make('email')->email()->required(),
    ]),
    // In your app: ->authorize(fn () => auth()->user()->isAdmin())
    Fieldset::make('Admin')->authorize(false)->fields([
        Toggle::make('is_verified'),
        Combobox::make('plan')->options(['free' => 'Free', 'pro' => 'Pro']),
    ]),
];
// #endregion example
