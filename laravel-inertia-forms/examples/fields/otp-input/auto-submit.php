<?php

// #region example
use Erag\InertiaForms\Fields\OtpInput;

OtpInput::make('code')
    ->label('Two-factor code')
    ->length(6)
    ->groupSize(3)
    ->autoSubmit()
    ->help('Enter the code from your authenticator app.')
    ->required();
// #endregion example
