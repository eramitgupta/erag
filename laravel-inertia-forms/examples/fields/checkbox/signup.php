<?php

// #region example
use Erag\InertiaForms\Fields\Checkbox;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class SignupForm extends Form
{
    public function fields(): array
    {
        return [
            TextInput::make('email')->email()->required(),
            TextInput::make('password')->password()->autocomplete('new-password')->required(),
            Checkbox::make('newsletter')
                ->label('Email me product updates')
                ->help('At most twice a month. Unsubscribe any time.')
                ->default(true),
            Checkbox::make('terms')
                ->label('I agree to the terms of service and privacy policy')
                ->required(),
        ];
    }
}
// #endregion example
