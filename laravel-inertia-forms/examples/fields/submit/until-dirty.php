<?php

// #region example
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class EditProfileForm extends Form
{
    public function fields(): array
    {
        return [
            TextInput::make('name')->required(),
            TextInput::make('email')->email()->required(),
            Submit::make('Save changes')
                ->icon('check')
                ->disableUntilDirty(),
        ];
    }
}

EditProfileForm::make()->bind([
    'name' => 'Ada Lovelace',
    'email' => 'ada@example.com',
]);
// #endregion example
