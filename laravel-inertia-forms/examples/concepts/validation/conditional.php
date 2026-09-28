<?php

// #region example
use Erag\InertiaForms\Fields\DatePicker;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class PaymentForm extends Form
{
    public function fields(): array
    {
        return [
            Radio::make('method')->label('Pay with')->buttons()->default('card')->required()->options([
                'card' => 'Card',
                'bank' => 'Bank transfer',
            ]),
            Fieldset::make('Card')->visibleWhen('method', 'card')->columns(2)->fields([
                TextInput::make('card.holder')->label('Name on card')->required()->columnSpan(2),
                TextInput::make('card.number')->label('Card number')->required()->rules('digits_between:12,19'),
                DatePicker::make('card.expires')->label('Expiry date')->required(),
            ]),
            Fieldset::make('Bank transfer')->visibleWhen('method', 'bank')->fields([
                TextInput::make('bank.iban')
                    ->label('IBAN')
                    ->required()
                    ->rule('regex:/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/'),
            ]),
            TextInput::make('coupon')->rule(function (string $attribute, mixed $value, \Closure $fail): void {
                if ($value !== null && strtoupper($value) !== 'WELCOME10') {
                    $fail('This coupon is not valid.');
                }
            }),
            Submit::make('Pay now'),
        ];
    }
}
// #endregion example
