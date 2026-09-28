<?php

// #region example
use Erag\InertiaForms\Fields\Slider;

[
    Slider::make('discount')->max(50)->step(5)->suffix('%')->default(10),
    Slider::make('font_size')->min(12)->max(32)->suffix('px')->default(16),
    Slider::make('opacity')->min(0)->max(1)->step(0.1)->default(0.8),
];
// #endregion example
