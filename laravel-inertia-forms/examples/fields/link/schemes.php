<?php

// #region example
use Erag\InertiaForms\Fields\Link;

[
    Link::make('docs_url')
        ->label('Documentation')
        ->requireScheme()
        ->allowedSchemes('https')
        ->placeholder('https://docs.example.test'),
    Link::make('support')
        ->label('Support link')
        ->withLabel(placeholder: 'Contact us')
        ->allowedSchemes('https', 'mailto')
        ->placeholder('mailto:help@example.test')
        ->help('A web page or a mailto: address.'),
];
// #endregion example
