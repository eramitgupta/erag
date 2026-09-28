<?php

// #region example
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class ProfileForm extends Form
{
    protected ?string $class = 'rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm';

    public function fields(): array
    {
        return [
            Fieldset::make('About you')->class('rounded-xl bg-zinc-50 p-4')->fields([
                TextInput::make('name')->required(),
                Textarea::make('bio')->rows(3),
            ]),
            Submit::make('Save profile')->class('justify-end'),
        ];
    }
}
// #endregion example
