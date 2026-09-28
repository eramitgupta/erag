<?php

// #region example
use Erag\InertiaForms\Fields\Callout;
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Heading;
use Erag\InertiaForms\Fields\Html;
use Erag\InertiaForms\Fields\Separator;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Text;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;

class WorkspaceSettingsForm extends Form
{
    public function fields(): array
    {
        return [
            Fieldset::make('Workspace')->columns(2)->fields([
                TextInput::make('name')->required(),
                Combobox::make('timezone')->options([
                    'UTC' => 'UTC',
                    'Asia/Kolkata' => 'Asia/Kolkata',
                    'Europe/Berlin' => 'Europe/Berlin',
                ])->default('UTC'),
                Separator::make()->spacing('sm'),
                Heading::make('Visibility')->level(4),
                Text::make('Public workspaces can be found and joined by anyone with the link.'),
                Toggle::make('public')->label('Public workspace')->columnSpan(2),
                Callout::make('Anyone can join', 'New members get the Viewer role until an admin changes it.')
                    ->warning()
                    ->visibleWhen('public', true),
            ]),
            Fieldset::make('Archive')->fields([
                Html::make('Archiving keeps your data. <a href="/docs">Export it</a> if you need a copy elsewhere.'),
                Toggle::make('archived')->label('Archive this workspace'),
                Callout::make('Archived workspaces are read-only', 'Members can still view projects but not change them.')
                    ->danger()
                    ->visibleWhen('archived', true),
            ]),
            Submit::make('Save settings')->icon('check'),
        ];
    }
}
// #endregion example
