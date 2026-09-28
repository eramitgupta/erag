<?php

// #region example
use Erag\InertiaForms\Fields\CheckboxGroup;
use Erag\InertiaForms\Fields\DatePicker;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;

class BookingForm extends Form
{
    public function fields(): array
    {
        return [
            Radio::make('room')->buttons()->default('double')->options([
                'single' => 'Single',
                'double' => 'Double',
                'suite' => 'Suite',
            ]),
            DatePicker::make('stay')->range()->required(),
            CheckboxGroup::make('extras')->inline()->default(['breakfast'])->options([
                'breakfast' => 'Breakfast',
                'parking' => 'Parking',
                'late_checkout' => 'Late checkout',
            ]),
            Toggle::make('newsletter')->default(true),
            Submit::make('Book room'),
        ];
    }
}

BookingForm::make()->accent('#0f766e');
// #endregion example
