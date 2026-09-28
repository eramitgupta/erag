<?php

// #region example
use Erag\InertiaForms\Fields\Link;

Link::make('cta')
    ->label('Call to action')
    ->withLabel(placeholder: 'Get started')
    ->withTarget()
    ->required();
// #endregion example
