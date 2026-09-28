<?php

// #region example
use Erag\InertiaForms\Fields\Composer;

Composer::make('comment')
    ->placeholder('Add a comment…')
    ->rows(3)
    ->maxLength(500)
    ->submitOnEnter(false)
    ->sendLabel('Post comment')
    ->required();
// #endregion example
