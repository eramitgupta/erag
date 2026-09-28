<?php

// #region example
use Erag\InertiaForms\Fields\ColorPicker;
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Slider;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TagsInput;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class ProductForm extends Form
{
    protected ?string $accent = '#e11d48';

    public function fields(): array
    {
        return [
            Fieldset::make('Product')
                ->description('Three columns on large screens, two on tablets, one on phones.')
                ->columns(3)
                ->fields([
                    TextInput::make('name')->required()->columnSpan(2),
                    TextInput::make('sku')->label('SKU'),
                    TextInput::make('price')->number()->prefix('€')->required(),
                    Combobox::make('category')->options(['Shoes', 'Bags', 'Accessories']),
                    ColorPicker::make('color')->default('#e11d48'),
                    Textarea::make('description')->rows(3)->columnSpan(3),
                ]),
            Fieldset::make('Listing')->class('rounded-xl border border-zinc-200 p-4')->columns(2)->fields([
                TagsInput::make('keywords'),
                Slider::make('discount')->max(50)->suffix('%'),
            ]),
            Submit::make('Save draft')->secondary()->intent('draft'),
            Submit::make('Publish')->intent('publish'),
        ];
    }
}
// #endregion example
