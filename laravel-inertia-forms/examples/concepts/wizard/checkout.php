<?php

// #region example
use Erag\InertiaForms\Fields\Checkbox;
use Erag\InertiaForms\Fields\DatePicker;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class CheckoutForm extends Form
{
    public function __construct()
    {
        $this->wizard(nextLabel: 'Next step', backLabel: 'Go back');
    }

    public function fields(): array
    {
        return [
            Fieldset::make('Order')->description('How do you want it?')->icon('fileText')->fields([
                TextInput::make('quantity')->number()->min(1)->max(10)->default(1)->required(),
                Radio::make('delivery')->buttons()->default('ship')->required()->options([
                    'ship' => 'Ship to me',
                    'pickup' => 'Pick up in store',
                ]),
            ]),
            Fieldset::make('Shipping')
                ->description('Only when shipping')
                ->icon('mapPin')
                ->visibleWhen('delivery', 'ship')
                ->columns(2)
                ->fields([
                    TextInput::make('shipping.street')->required()->columnSpan(2),
                    TextInput::make('shipping.city')->required(),
                    TextInput::make('shipping.postal_code')->required(),
                ]),
            Fieldset::make('Pickup')
                ->description('Only when picking up')
                ->icon('home')
                ->visibleWhen('delivery', 'pickup')
                ->fields([
                    DatePicker::make('pickup_date')->required(),
                ]),
            Fieldset::make('Payment')->description('Card details')->icon('creditCard')->columns(2)->fields([
                TextInput::make('card.number')->label('Card number')->required()->columnSpan(2),
                TextInput::make('card.expiry')->label('Expiry (MM/YY)')->required(),
                TextInput::make('card.cvc')->label('CVC')->required(),
                Checkbox::make('terms')->label('I accept the terms of sale')->required()->columnSpan(2),
            ]),
            Submit::make('Place order')->processingLabel('Placing order…'),
        ];
    }
}
// #endregion example
