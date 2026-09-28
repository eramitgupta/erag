<?php

// #region example
use Erag\InertiaForms\Fields\CheckboxGroup;

CheckboxGroup::make('topics')
    ->options([
        'news' => 'Product news',
        'tips' => 'Tips and tutorials',
        'events' => 'Events',
    ])
    ->inline();
// #endregion example
