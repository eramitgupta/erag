<?php

// #region example
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class NewsletterForm extends Form
{
    protected ?string $actionUrl = '/newsletter';

    public function fields(): array
    {
        return [
            TextInput::make('email')->email()->placeholder('you@example.com')->required(),
            Submit::make('Subscribe'),
        ];
    }
}
// #endregion example
