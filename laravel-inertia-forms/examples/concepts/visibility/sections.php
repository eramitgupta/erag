<?php

// #region example
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;

class AccountForm extends Form
{
    public function fields(): array
    {
        return [
            TextInput::make('name')->required(),
            Radio::make('account_type')->buttons()->default('personal')->options([
                'personal' => 'Personal',
                'business' => 'Business',
            ]),
            Fieldset::make('Company')
                ->description('Only for business accounts. Cleared when you switch back.')
                ->visibleWhen('account_type', 'business')
                ->columns(2)
                ->fields([
                    TextInput::make('company.name')->required()->clearWhenHidden(),
                    Combobox::make('company.country')->required()->clearWhenHidden()->options([
                        'DE' => 'Germany',
                        'FR' => 'France',
                        'IT' => 'Italy',
                        'IN' => 'India',
                    ]),
                    TextInput::make('company.vat_number')
                        ->label('VAT number')
                        ->required()
                        ->visibleWhen('company.country', 'in', ['DE', 'FR', 'IT'])
                        ->clearWhenHidden(),
                    Toggle::make('company.pay_by_invoice')->label('Pay by invoice')->columnSpan(2),
                    TextInput::make('company.po_number')
                        ->label('PO number')
                        ->visibleWhen('company.pay_by_invoice', true)
                        ->visibleWhen('company.country', '!=', 'IN')
                        ->clearWhenHidden(),
                ]),
            Submit::make('Create account'),
        ];
    }
}
// #endregion example
