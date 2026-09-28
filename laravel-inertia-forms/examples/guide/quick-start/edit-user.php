<?php

// #region example
use Erag\InertiaForms\Fields\CheckboxGroup;
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;

class UserForm extends Form
{
    public function fields(): array
    {
        $editing = $this->getModel() !== null;

        return [
            Fieldset::make('Account')->columns(2)->fields([
                TextInput::make('name')->required()->maxLength(100),
                TextInput::make('email')->email()->required()->readonly($editing),
                TextInput::make('password')->password()->required()->minLength(8)->authorizedUnless($editing),
                Combobox::make('role')->options([
                    'admin' => 'Admin',
                    'editor' => 'Editor',
                ])->required(),
                CheckboxGroup::make('sections')
                    ->label('Sections this editor can publish to')
                    ->inline()
                    ->options(['news' => 'News', 'sport' => 'Sport', 'culture' => 'Culture'])
                    ->required()
                    ->visibleWhen('role', 'editor')
                    ->columnSpan(2),
            ]),
            Toggle::make('send_welcome_email')->default(true)->authorizedUnless($editing),
            Submit::make($editing ? 'Save user' : 'Create user')->processingLabel('Saving…'),
        ];
    }
}

// In the edit action: UserForm::make()->bind($user)
UserForm::make()->bind([
    'name' => 'Jane Cooper',
    'email' => 'jane@example.com',
    'role' => 'editor',
    'sections' => ['news', 'culture'],
]);
// #endregion example
