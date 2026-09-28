<?php

// #region example
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;

[
    TextInput::make('title')->required(),
    Textarea::make('body')->rows(3),
    Submit::make('Save draft')
        ->secondary()
        ->icon('save')
        ->intent('draft'),
    Submit::make('Publish')
        ->icon('send', 'right')
        ->intent('publish')
        ->processingLabel('Publishing…'),
];
// #endregion example
