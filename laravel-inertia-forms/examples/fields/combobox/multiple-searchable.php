<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;

[
    Combobox::make('timezone')
        ->searchable()
        ->clearable()
        ->options([
            'Asia/Kolkata' => 'Asia/Kolkata (UTC+05:30)',
            'Europe/London' => 'Europe/London (UTC+00:00)',
            'Europe/Berlin' => 'Europe/Berlin (UTC+01:00)',
            'America/New_York' => 'America/New_York (UTC−05:00)',
            'America/Los_Angeles' => 'America/Los_Angeles (UTC−08:00)',
            'Asia/Tokyo' => 'Asia/Tokyo (UTC+09:00)',
        ]),
    Combobox::make('skills')
        ->multiple()
        ->searchable()
        ->required()
        ->placeholder('Search skills…')
        ->options([
            ['value' => 'laravel', 'label' => 'Laravel', 'description' => 'PHP framework'],
            ['value' => 'inertia', 'label' => 'Inertia', 'description' => 'Server-driven SPAs'],
            ['value' => 'vue', 'label' => 'Vue'],
            ['value' => 'react', 'label' => 'React'],
            ['value' => 'svelte', 'label' => 'Svelte'],
            ['value' => 'tailwind', 'label' => 'Tailwind CSS'],
        ]),
];
// #endregion example
