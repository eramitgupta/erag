<?php

// #region example
use Erag\InertiaForms\Fields\FileUpload;

FileUpload::make('avatar')
    ->label('Profile photo')
    ->image()
    ->maxSize(2048);
// #endregion example
