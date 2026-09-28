<?php

// #region example
use Erag\InertiaForms\Fields\Field;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Form;

class Rating extends Field
{
    protected int $stars = 5;

    public function component(): string
    {
        return 'Rating';
    }

    public function stars(int $stars): static
    {
        $this->stars = $stars;

        return $this;
    }

    public function emptyValue(): mixed
    {
        return null;
    }

    protected function typeRules(): array
    {
        return ['integer', 'between:1,'.$this->stars];
    }

    protected function props(): array
    {
        return ['stars' => $this->stars];
    }
}

class ReviewForm extends Form
{
    public function fields(): array
    {
        return [
            Rating::make('score')->label('How was your stay?')->stars(5)->required(),
            Textarea::make('comment')->rows(3),
            Submit::make('Send review'),
        ];
    }
}

ReviewForm::make();
// #endregion example
