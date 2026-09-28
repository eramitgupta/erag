<?php

// #region example
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class PostForm extends Form
{
    public function fields(): array
    {
        return [
            TextInput::make('title')->required(),
            Textarea::make('excerpt')->rows(2),
            TextInput::make('author')->default('Editorial team'),
            Submit::make('Save post'),
        ];
    }
}

PostForm::make()->bind([
    'title' => 'Shipping forms from PHP',
    'excerpt' => 'One class describes the fields, the rules and the layout.',
]);
// #endregion example
