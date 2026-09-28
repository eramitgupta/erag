<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class SettingsForm extends Form
{
    public function fields(): array
    {
        return [
            TextInput::make('team_name')->required(),
            Fieldset::make('Address')->columns(2)->fields([
                TextInput::make('address.street')->columnSpan(2),
                TextInput::make('address.city'),
                Combobox::make('address.country')->options(['IN' => 'India', 'US' => 'United States']),
            ]),
            TextInput::make('billing.email')->email()->default('billing@example.com'),
            Submit::make('Save settings'),
        ];
    }
}

// For example $team->settings, stored as JSON.
SettingsForm::make()->bind([
    'team_name' => 'Acme',
    'address' => ['street' => '12 MG Road', 'city' => 'Bengaluru', 'country' => 'IN'],
    'billing' => ['email' => null],
]);
// #endregion example
