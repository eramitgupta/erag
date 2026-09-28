<?php

// #region example
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;

[
    TextInput::make('subject')->required()->maxLength(120),
    Textarea::make('description')
        ->required()
        ->rows(3)
        ->autoResize()
        ->minLength(20)
        ->maxLength(2000)
        ->showCharacterCount()
        ->placeholder('What happened, and what did you expect to happen?'),
    Textarea::make('steps')
        ->label('Steps to reproduce')
        ->autoResize()
        ->placeholder("1. Open the dashboard\n2. Click Export")
        ->help('Optional, but it helps us fix it faster.'),
];
// #endregion example
