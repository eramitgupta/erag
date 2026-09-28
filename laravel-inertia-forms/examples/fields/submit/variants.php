<?php

// #region example
use Erag\InertiaForms\Fields\Submit;

[
    Submit::make('Primary'),
    Submit::make('Secondary')->secondary(),
    Submit::make('Outline')->outline(),
    Submit::make('Ghost')->ghost(),
    Submit::make('Link')->link(),
    Submit::make('Danger')->danger(),
];
// #endregion example
