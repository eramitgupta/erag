<?php

// #region example
use Erag\InertiaForms\Fields\CheckboxGroup;
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\TimePicker;
use Erag\InertiaForms\Fields\Toggle;

[
    TextInput::make('age')->number()->min(1)->required(),
    TextInput::make('guardian_name')
        ->label('Parent or guardian')
        ->required()
        ->visibleWhen('age', '<', 18),
    Combobox::make('country')->options([
        'IN' => 'India',
        'US' => 'United States',
        'DE' => 'Germany',
        'GB' => 'United Kingdom',
    ]),
    TextInput::make('state')->visibleWhen('country', ['IN', 'US']),
    CheckboxGroup::make('interests')->inline()->options([
        'talks' => 'Talks',
        'workshops' => 'Workshops',
        'networking' => 'Networking',
    ]),
    TimePicker::make('workshop_slot')->minuteStep(30)->visibleWhen('interests', 'contains', 'workshops'),
    Textarea::make('notes')->rows(2),
    Toggle::make('share_notes')->label('Share my notes with the speakers')->visibleWhen('notes', 'not_empty'),
];
// #endregion example
