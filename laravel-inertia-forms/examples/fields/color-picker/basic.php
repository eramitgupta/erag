<?php

// #region example
use Erag\InertiaForms\Fields\ColorPicker;

ColorPicker::make('brand_color')
    ->swatches(['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'])
    ->default('#4f46e5');
// #endregion example
