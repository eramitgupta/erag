<?php

// #region example
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class SupportRequestForm extends Form
{
    protected bool $wizard = true;

    public function fields(): array
    {
        return [
            Fieldset::make('About you')->fields([
                TextInput::make('name')->required(),
                TextInput::make('email')->email()->required(),
            ]),
            Fieldset::make('Your question')->fields([
                TextInput::make('subject')->required(),
                Textarea::make('message')->rows(4)->required(),
            ]),
            Submit::make('Send request'),
        ];
    }
}
// #endregion example
