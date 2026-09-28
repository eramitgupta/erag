<?php

// #region example
use Erag\InertiaForms\Fields\Field;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;

class QuantityStepper extends Field
{
    protected int $min = 0;

    protected int $max = 99;

    protected ?string $unit = null;

    public function component(): string
    {
        return 'QuantityStepper';
    }

    public function between(int $min, int $max): static
    {
        [$this->min, $this->max] = [$min, $max];

        return $this;
    }

    public function unit(?string $unit): static
    {
        $this->unit = $unit;

        return $this;
    }

    public function emptyValue(): mixed
    {
        return $this->min;
    }

    protected function typeRules(): array
    {
        return ['integer', 'between:'.$this->min.','.$this->max];
    }

    protected function props(): array
    {
        return ['min' => $this->min, 'max' => $this->max, 'step' => 1, 'unit' => $this->unit];
    }
}

class TicketForm extends Form
{
    public function fields(): array
    {
        return [
            TextInput::make('name')->required(),
            QuantityStepper::make('tickets')->between(1, 10)->unit('tickets')->required(),
            Toggle::make('bring_children')->label('Bringing children?'),
            QuantityStepper::make('children')
                ->between(1, 5)
                ->unit('children')
                ->help('Under 12 go free.')
                ->visibleWhen('bring_children', true)
                ->clearWhenHidden(),
            Submit::make('Reserve'),
        ];
    }
}

TicketForm::make();
// #endregion example
