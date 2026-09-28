<?php

// #region example
use Erag\InertiaForms\Fields\ColorPicker;
use Erag\InertiaForms\Fields\Fieldset;

Fieldset::make('Theme')
    ->description('Colors used on your public booking page.')
    ->columns(2)
    ->fields([
        ColorPicker::make('primary')
            ->swatches(['#4f46e5', '#0f766e', '#be123c', '#1d4ed8', '#18181b'])
            ->default('#0f766e')
            ->required(),
        ColorPicker::make('background')
            ->swatches(['#ffffff', '#fafaf9', '#f1f5f9', '#fef3c7'])
            ->default('#ffffff')
            ->required(),
        ColorPicker::make('highlight')
            ->placeholder('No highlight')
            ->clearable()
            ->help('Optional. Used for badges and banners.')
            ->columnSpan(2),
    ]);
// #endregion example
