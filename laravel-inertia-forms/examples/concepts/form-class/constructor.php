<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Form;

class InviteForm extends Form
{
    protected ?string $actionUrl = '/team/invitations';

    /**
     * @param  array<string, string>  $roles
     */
    public function __construct(private array $roles, private bool $canInviteAdmins = false) {}

    public function fields(): array
    {
        $roles = $this->canInviteAdmins ? ['admin' => 'Admin', ...$this->roles] : $this->roles;

        return [
            TextInput::make('email')->email()->required(),
            Combobox::make('role')
                ->options($roles)
                ->default('viewer')
                ->required()
                ->when($this->canInviteAdmins, fn (Combobox $field) => $field->help('Admins can manage billing and members.')),
            Textarea::make('message')->placeholder('Optional note for the invite email')->rows(2),
            Submit::make('Send invite'),
        ];
    }
}

InviteForm::make(['editor' => 'Editor', 'viewer' => 'Viewer'], canInviteAdmins: true);
// #endregion example
