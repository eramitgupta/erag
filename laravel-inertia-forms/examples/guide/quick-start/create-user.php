<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;

class CreateUserForm extends Form
{
    public function fields(): array
    {
        return [
            Fieldset::make('Account')->columns(2)->fields([
                TextInput::make('name')->required()->maxLength(100),
                TextInput::make('email')->email()->required()->rule('unique:users,email'),
                TextInput::make('password')->password()->required()->minLength(8),
                Combobox::make('role')->options([
                    'admin' => 'Admin',
                    'editor' => 'Editor',
                ])->required(),
            ]),
            Toggle::make('send_welcome_email')->default(true),
            Submit::make('Create user')->processingLabel('Creating…'),
        ];
    }
}
// #endregion example
