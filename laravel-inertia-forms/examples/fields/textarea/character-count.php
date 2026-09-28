<?php

// #region example
use Erag\InertiaForms\Fields\Textarea;

Textarea::make('status')
    ->label('What are you working on?')
    ->rows(3)
    ->maxLength(280)
    ->showCharacterCount();
// #endregion example
