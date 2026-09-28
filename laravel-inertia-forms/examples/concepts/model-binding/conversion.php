<?php

// #region example
use Erag\InertiaForms\Fields\CheckboxGroup;
use Erag\InertiaForms\Fields\DatePicker;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\TimePicker;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;
use Illuminate\Support\Carbon;

enum PostStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';
}

class EditPostForm extends Form
{
    public function fields(): array
    {
        $editing = $this->getModel() !== null;

        return [
            TextInput::make('title')->required(),
            Radio::make('status')->options(PostStatus::class)->buttons()->required(),
            DatePicker::make('published_at')->withTime(),
            TimePicker::make('reminder_at')->label('Daily reminder'),
            CheckboxGroup::make('tags')->inline()->options(['laravel', 'inertia', 'vue', 'php']),
            Toggle::make('featured'),
            Submit::make($editing ? 'Save changes' : 'Create post'),
        ];
    }
}

// The values an Eloquent model with casts would return.
EditPostForm::make()->bind([
    'title' => 'Forms without the boilerplate',
    'status' => PostStatus::Published,
    'published_at' => Carbon::parse('2026-09-27 10:30:00'),
    'reminder_at' => Carbon::parse('2026-09-27 08:00:00'),
    'tags' => collect(['laravel', 'inertia']),
    'featured' => 1,
]);
// #endregion example
