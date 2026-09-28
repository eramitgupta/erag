<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\OtpInput;
use Erag\InertiaForms\Fields\Slug;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class SignupForm extends Form
{
    protected bool $wizard = true;

    protected string $wizardNextLabel = 'Next';

    protected string $wizardBackLabel = 'Previous';

    public function fields(): array
    {
        return [
            Fieldset::make('Account')->description('Your login details')->icon('user')->fields([
                TextInput::make('name')->required(),
                TextInput::make('email')->email()->required(),
                TextInput::make('password')->password()->minLength(8)->required(),
            ]),
            Fieldset::make('Workspace')->description('Name your team space')->icon('briefcase')->columns(2)->fields([
                TextInput::make('workspace')->required(),
                Combobox::make('team_size')->options(['1-10', '11-50', '51-200', '200+']),
                Slug::make('workspace_url')->from('workspace')->prefix('app.example.test/')->required()->columnSpan(2),
            ]),
            Fieldset::make('Verify')->description('Enter the code we emailed you')->icon('shield')->fields([
                OtpInput::make('code')->length(6)->required(),
            ]),
            Submit::make('Create account')->processingLabel('Creating…'),
        ];
    }
}
// #endregion example
