<?php

// #region example
use Erag\InertiaForms\Fields\Toggle;

Toggle::make('public')
    ->label('Profile visibility')
    ->onLabel('Visible to everyone')
    ->offLabel('Only you can see this');
// #endregion example
