<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;

Combobox::make('plan')
    ->placeholder('Choose a plan')
    ->clearable()
    ->options([
        ['value' => 'starter', 'label' => 'Starter', 'description' => 'One project, community support'],
        ['value' => 'team', 'label' => 'Team', 'description' => 'Unlimited projects, 10 seats'],
        ['value' => 'business', 'label' => 'Business', 'description' => 'SSO and priority support'],
        ['value' => 'legacy', 'label' => 'Legacy', 'description' => 'No longer available', 'disabled' => true],
    ]);
// #endregion example
