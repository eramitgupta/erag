<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;

class EmployeeForm extends Form
{
    protected ?string $actionUrl = '/employees';

    public function __construct(private string $role = 'viewer', private bool $isOwnRecord = false) {}

    public function fields(): array
    {
        return [
            Fieldset::make('Profile')->columns(2)->fields([
                TextInput::make('name')->required(),
                TextInput::make('job_title'),
            ]),
            Fieldset::make('Compensation')
                ->description('Only HR and admins get this section.')
                ->authorize(fn () => in_array($this->role, ['hr', 'admin'], true))
                ->columns(2)
                ->fields([
                    TextInput::make('salary')->number()->prefix('€')->required(),
                    Combobox::make('pay_band')->options(['A', 'B', 'C']),
                    Toggle::make('bonus_eligible')
                        ->authorize($this->role === 'admin')
                        ->authorizedUnless($this->isOwnRecord)
                        ->columnSpan(2),
                ]),
            Textarea::make('internal_notes')->rows(2)->authorizedUnless($this->role === 'viewer'),
            Submit::make('Save employee'),
        ];
    }
}

// In your app: EmployeeForm::make($request->user()->role, $employee->is($request->user()))
EmployeeForm::make('hr');
// #endregion example
