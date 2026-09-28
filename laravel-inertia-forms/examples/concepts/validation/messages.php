<?php

// #region example
use Erag\InertiaForms\Fields\Checkbox;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class ContactForm extends Form
{
    public function fields(): array
    {
        return [
            TextInput::make('email')->label('Work email')->email()->required(),
            Textarea::make('message')->minLength(20)->maxLength(1000)->showCharacterCount()->required(),
            Checkbox::make('terms')->label('I agree to the privacy policy')->required(),
            Submit::make('Send message'),
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'We need your email to reply.',
            'message.min' => 'Tell us a bit more (at least :min characters).',
            'terms.accepted' => 'Please accept the privacy policy to continue.',
        ];
    }

    public function attributes(): array
    {
        return [
            'email' => 'email address',
        ];
    }
}
// #endregion example
