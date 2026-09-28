<?php

// #region example
use Erag\InertiaForms\Fields\TagsInput;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class ProductForm extends Form
{
    public function fields(): array
    {
        return [
            TextInput::make('name')->required(),
            TagsInput::make('tags')
                ->required()
                ->suggestions(['carry-on', 'water-resistant', 'lightweight', 'laptop-sleeve'])
                ->maxTags(8)
                ->maxTagLength(30),
            TagsInput::make('search_aliases')
                ->reorderable(false)
                ->help('Other words shoppers use for this product.'),
        ];
    }
}

ProductForm::make()->bind([
    'name' => 'Cabin backpack',
    'tags' => 'carry-on, water-resistant',
]);
// #endregion example
