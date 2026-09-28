<?php

// #region example
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Support\Icon;

// Usually in AppServiceProvider::boot(), or in config/inertia-forms.php.
Icon::register('brandMark', '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>');

[
    TextInput::make('project')->required(),
    Submit::make('Create project')->icon('brandMark'),
];
// #endregion example
