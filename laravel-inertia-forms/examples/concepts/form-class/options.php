<?php

// #region example
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Form;

class FeedbackForm extends Form
{
    public function fields(): array
    {
        return [
            Radio::make('mood')->label('How do you feel about the product?')->buttons()->required()->options([
                'love' => 'Love it',
                'fine' => 'It is fine',
                'meh' => 'Not for me',
            ]),
            Textarea::make('comment')->rows(3)->maxLength(500),
            Submit::make('Send feedback'),
        ];
    }
}

FeedbackForm::make()
    ->url('/api/feedback')
    ->put()
    ->resetOnSuccess()
    ->accent('#0f766e');
// #endregion example
