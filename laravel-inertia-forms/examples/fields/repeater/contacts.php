<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Repeater;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;

Repeater::make('contacts')
    ->label('Project contacts')
    ->itemLabel('Contact')
    ->addActionLabel('Add a contact')
    ->titleFrom('name')
    ->columns(2)
    ->minItems(1)
    ->maxItems(4)
    ->collapsed()
    ->default([
        ['name' => 'Aisha Khan', 'email' => 'aisha@example.com', 'role' => 'owner', 'notify' => true],
        ['name' => 'Ravi Mehta', 'email' => 'ravi@example.com', 'role' => 'reviewer'],
    ])
    ->fields([
        TextInput::make('name')->required(),
        TextInput::make('email')->email()->required(),
        Combobox::make('role')->options([
            'owner' => 'Owner',
            'reviewer' => 'Reviewer',
            'viewer' => 'Viewer',
        ])->required(),
        Toggle::make('notify')->label('Email updates'),
    ]);
// #endregion example
