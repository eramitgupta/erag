<?php

// #region example
use Erag\InertiaForms\Fields\Slug;
use Erag\InertiaForms\Fields\TextInput;

[
    TextInput::make('title')->required(),
    Slug::make('slug')->from('title')->prefix('example.test/blog/')->required(),
];
// #endregion example
