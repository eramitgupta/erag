<?php

// #region example
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Toggle;

Fieldset::make('Privacy')
    ->fields([
        Toggle::make('status')
            ->label('Account')
            ->trueValue('active')
            ->falseValue('paused')
            ->onLabel('Active')
            ->offLabel('Paused')
            ->default('active'),
        Toggle::make('profile_public')
            ->label('Public profile')
            ->onLabel('Anyone can view your profile')
            ->offLabel('Only you can view your profile'),
        Toggle::make('show_email')
            ->label('Show my email on my profile')
            ->visibleWhen('profile_public', true),
    ]);
// #endregion example
