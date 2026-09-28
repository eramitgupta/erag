<?php

// #region example
use Erag\InertiaForms\Fields\OtpInput;

OtpInput::make('code')
    ->label('Verification code')
    ->required();
// #endregion example
