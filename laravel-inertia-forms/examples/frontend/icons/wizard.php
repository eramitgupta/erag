<?php

// #region example
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class SignupWizardForm extends Form
{
    protected bool $wizard = true;

    public function fields(): array
    {
        return [
            Fieldset::make('Account')->icon('user')->fields([
                TextInput::make('name')->required(),
                TextInput::make('email')->email()->required(),
            ]),
            Fieldset::make('Shipping')->icon('truck')->fields([
                TextInput::make('address'),
            ]),
            Fieldset::make('Billing')->icon('creditCard')->fields([
                TextInput::make('card_holder')->required(),
            ]),
            Submit::make('Create account')->icon('check'),
        ];
    }
}
// #endregion example
