<?php

// #region example
use Erag\InertiaForms\Fields\Callout;
use Erag\InertiaForms\Fields\Toggle;

[
    Callout::make('New sign-ins', 'We email you when someone signs in from a new device.')->icon('bell'),
    Callout::make('Two-factor authentication', 'Required for every admin.')->warning()->icon('key'),
    Callout::make('Heads up', 'An unknown icon name falls back to the default icon.')->icon('unicorn'),
    Toggle::make('notify')->label('Email me about new sign-ins'),
];
// #endregion example
