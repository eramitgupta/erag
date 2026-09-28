<?php

// #region example
use Erag\InertiaForms\Fields\FileUpload;
use Erag\InertiaForms\Fields\Textarea;

[
    Textarea::make('description')
        ->label('What happened?')
        ->rows(3)
        ->required(),
    FileUpload::make('photos')
        ->label('Photos of the damage')
        ->multiple()
        ->image()
        ->accept(['jpg', 'png', 'webp'])
        ->maxFiles(4)
        ->maxSize(4096)
        ->required(),
    FileUpload::make('receipts')
        ->multiple()
        ->accept(['pdf'])
        ->maxFiles(3)
        ->maxSize(2048)
        ->help('Optional. Invoices or repair quotes.'),
];
// #endregion example
