<?php

// #region example
use Erag\InertiaForms\Fields\FileUpload;

FileUpload::make('resume')
    ->label('CV')
    ->accept(['pdf', 'doc', 'docx'])
    ->maxSize(5120)
    ->placeholder('Drop your CV here')
    ->required();
// #endregion example
