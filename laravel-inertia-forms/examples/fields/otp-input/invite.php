<?php

// #region example
use Erag\InertiaForms\Fields\OtpInput;

[
    OtpInput::make('invite_code')
        ->length(8)
        ->groupSize(4)
        ->alphanumeric()
        ->help('Letters and digits, like AB12-CD34. Pasting works too.')
        ->required(),
    OtpInput::make('pin')
        ->label('Parental control PIN')
        ->length(4)
        ->password()
        ->required(),
];
// #endregion example
