<?php

// #region example
use Erag\InertiaForms\Fields\Callout;

[
    Callout::make('Heads up', 'Changes apply to new invoices only.'),
    Callout::make('Two-factor authentication is on')->success(),
    Callout::make('Publishing is final', 'Published pages are visible to everyone right away.')->warning(),
    Callout::make('Payment failed', 'Update your card to keep the project active.')->danger(),
    Callout::make('Admins only', 'Only workspace admins can see these settings.')->icon('lock'),
];
// #endregion example
