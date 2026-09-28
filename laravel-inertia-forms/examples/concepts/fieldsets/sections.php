<?php

// #region example
use Erag\InertiaForms\Fields\Checkbox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class CheckoutForm extends Form
{
    public function fields(): array
    {
        return [
            Fieldset::make('Contact')->columns(2)->fields([
                TextInput::make('name')->required(),
                TextInput::make('email')->email()->required(),
            ]),
            Fieldset::make('Shipping address')->columns(3)->fields([
                TextInput::make('shipping.street')->required()->columnSpan(3),
                TextInput::make('shipping.city')->required(),
                TextInput::make('shipping.state'),
                TextInput::make('shipping.postal_code'),
                Checkbox::make('billing_differs')->label('Bill to a different address')->columnSpan(3),
            ]),
            Fieldset::make('Billing address')
                ->description('Only shown when billing differs.')
                ->visibleWhen('billing_differs', true)
                ->columns(2)
                ->fields([
                    TextInput::make('billing.street')->required()->columnSpan(2),
                    TextInput::make('billing.city')->required(),
                    TextInput::make('billing.postal_code'),
                ]),
            Submit::make('Place order'),
        ];
    }
}
// #endregion example
