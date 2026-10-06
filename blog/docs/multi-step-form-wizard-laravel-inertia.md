---
title: Multi-Step Form Wizards in Laravel Inertia
description: Build a multi step form in Laravel Inertia with server-checked steps, conditional steps and one final submit, using fieldsets in a single PHP form class.
date: 2026-09-29
package: laravel-inertia-forms
category: Tutorial
tags: [laravel, inertia, forms, wizard, validation]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/multi-step-form-wizard-laravel-inertia.md
</div>

A multi step form in Laravel Inertia sounds like a frontend problem until you build one. Then you're deciding where the current step lives, whether each step gets its own endpoint or FormRequest, how to keep the data around between steps, what Back does, and what happens when the final submit fails on a field from step one.

Most hand-rolled wizards I've seen solve this with a step counter in the component and a pile of `if (step === 2)` checks, plus either no server validation until the end, or one validation endpoint per step.

Laravel Inertia Forms has a wizard mode for exactly this. Every fieldset in a form class becomes a step. Continue checks the current step on the server. It's still one class, one data object and one final submit. This tutorial builds a job application wizard with a step that only appears for some answers, then tests it.

If you haven't installed the package yet, the [installation guide](https://erag.in/laravel-inertia-forms/guide/installation.html) takes a few minutes, or follow [building Inertia forms from a single PHP class](./laravel-inertia-forms-php-class.md) for a full walkthrough.

## Building the multi step form in Laravel Inertia

Four steps, one of them conditional:

1. **About you**: name, email, phone.
2. **The role**: which position, remote or office, start date.
3. **Relocation**: only for office roles.
4. **Final check**: a CV, a short cover note and privacy consent.

```bash
php artisan make:form JobApplicationForm
```

```php
<?php

namespace App\Forms;

use Erag\InertiaForms\Fields\Checkbox;
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\DatePicker;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\FileUpload;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class JobApplicationForm extends Form
{
    protected ?string $actionRoute = 'applications.store';

    protected bool $wizard = true;

    protected string $wizardNextLabel = 'Next';

    protected string $wizardBackLabel = 'Back';

    public function fields(): array
    {
        return [
            Fieldset::make('About you')->description('How we can reach you')->icon('user')->columns(2)->fields([
                TextInput::make('name')->required()->columnSpan(2),
                TextInput::make('email')->email()->required(),
                TextInput::make('phone')->tel(),
            ]),
            Fieldset::make('The role')->description('What you are applying for')->icon('briefcase')->fields([
                Combobox::make('position')->required()->options([
                    'backend' => 'Backend developer',
                    'frontend' => 'Frontend developer',
                    'support' => 'Support engineer',
                ]),
                Radio::make('work_mode')->buttons()->default('remote')->required()->options([
                    'remote' => 'Remote',
                    'office' => 'Office',
                ]),
                DatePicker::make('available_from')->minDate(today())->required(),
            ]),
            Fieldset::make('Relocation')
                ->description('Only for office roles')
                ->icon('mapPin')
                ->visibleWhen('work_mode', 'office')
                ->fields([
                    TextInput::make('current_city')->required(),
                    Checkbox::make('needs_relocation_support')->label('I would need help relocating'),
                ]),
            Fieldset::make('Final check')->description('Almost done')->icon('fileText')->fields([
                FileUpload::make('cv')->label('CV')->accept(['pdf'])->maxSize(5 * 1024)->required(),
                Textarea::make('cover_note')->minLength(50)->maxLength(2000)->showCharacterCount()->required(),
                Checkbox::make('privacy')->label('I agree to the privacy policy')->required(),
            ]),
            Submit::make('Send application')->processingLabel('Sending…')->icon('send', 'right'),
        ];
    }
}
```

The only wizard-specific lines are `protected bool $wizard = true` and the two button labels. Everything else is a normal form. The icons show in the stepper at the top; `icon()` on a fieldset does nothing outside a wizard.

The trailing `Submit` sits outside any fieldset, so it doesn't create an extra step. Submit buttons appear on the last step.

## The controller and page don't change

This is the part I like most. A wizard is wired up exactly like any other form:

```php
<?php

namespace App\Http\Controllers;

use App\Forms\JobApplicationForm;
use App\Models\Application;
use Erag\InertiaForms\Attributes\Validate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Applications/Create', [
            'form' => JobApplicationForm::make(),
        ]);
    }

    public function store(#[Validate] JobApplicationForm $form): RedirectResponse
    {
        $data = $form->validated();

        Application::create([
            ...Arr::except($data, ['cv', 'privacy']),
            'cv_path' => $data['cv']->store('applications'),
        ]);

        return to_route('applications.thanks');
    }
}
```

```vue
<!-- resources/js/pages/Applications/Create.vue -->
<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();
</script>

<template>
    <div class="mx-auto max-w-2xl p-6">
        <Form :form="form" />
    </div>
</template>
```

In React it's the same `<Form form={form} />` from `@erag/inertia-forms-react`. Because the form has a file field, `<Form>` sends the final request as `multipart/form-data` on its own.

## What happens when the user presses Next

Here's the flow on each step:

- **Next** posts the current step's values to a package endpoint, `POST /_inertia-forms/validate-step`. If they pass, the next step opens. If not, the errors show under the fields, exactly like after a normal submit.
- **Back** goes to the previous step without checking anything.
- **Enter** in a field moves to the next step instead of submitting. On the last step it submits.
- **The final submit** validates the whole form again in your controller. If it fails, the wizard jumps to the step that holds the first invalid field.

The step endpoint checks the request carries an encrypted token for one of your form classes, rebuilds the form, runs its `authorize()` check, validates only the visible fields of that step (with your `messages()` and `attributes()`), and answers `204` or the usual `422` with errors. It never saves anything. The data is only trusted after `#[Validate]` runs in `store()`.

One exception to the per-step check: file fields. Files are only sent with the final submit, so the step check skips the CV field and it's validated at the end. In our form, a missing CV shows up after Send application is pressed, as an error on the Final check step.

## Conditional steps

The Relocation fieldset has `visibleWhen('work_mode', 'office')`. A fieldset with a visibility condition is a step only while it's visible. Pick Remote and the stepper shows three steps; switch to Office and a fourth appears between The role and Final check.

The server sees it the same way. Hidden fieldsets get no rules, so `current_city` is required for office applicants and ignored for remote ones. No extra code in the controller.

## The one rule you must follow

Step checks run on the package endpoint, which rebuilds your form with `JobApplicationForm::make()`, with no arguments. Two things follow from that:

1. **Turn the wizard on inside the class.** Set `$wizard` as above, or call `$this->wizard()` in the constructor. Calling `->wizard()` from the controller won't work, because the endpoint only answers for forms that are wizards straight out of `make()`.
2. **Don't make the rules depend on a bound model or constructor arguments.** A form like `JobApplicationForm::make($job)` that adds questions per job won't validate correctly step by step.

Loading options from the database is still fine, because that doesn't need an argument:

```php
Combobox::make('position')
    ->required()
    ->options(fn () => Position::where('is_open', true)->pluck('title', 'id')),
```

The [wizard page](https://erag.in/laravel-inertia-forms/concepts/wizard.html) has a checkout example that turns the wizard on in the constructor with custom labels.

## Changing the button labels

The labels in our form are set as properties. If you'd rather configure the wizard in one place, call `wizard()` in the constructor with named arguments:

```php
public function __construct()
{
    $this->wizard(nextLabel: 'Next step', backLabel: 'Go back');
}
```

Without labels, the buttons read Continue and Back. Either style works with the step endpoint, because both are in place as soon as `make()` builds the form. `wizard(false)` turns the mode off again, which can be handy while you debug a single long page.

## Protect the step endpoint

The endpoint's path and middleware live in `config/inertia-forms.php`:

```php
'wizard' => [
    'uri' => '_inertia-forms/validate-step',
    'middleware' => ['web', 'throttle:60,1'],
],
```

Two changes to consider. Add `'auth'` if the wizard is only for signed-in users. And keep an eye on the throttle: every Next is one request, so a long wizard used by several people behind the same office IP can hit 60 per minute sooner than you'd expect. The [config reference](https://erag.in/laravel-inertia-forms/reference/artisan-config.html) covers both endpoints.

## Test each step with Pest

The form exposes the same checks the endpoint uses. `wizardSteps($data)` returns the fieldsets that are steps for that data, and `validateStep($index, $data)` throws a `ValidationException` when a step is invalid.

```php
use App\Forms\JobApplicationForm;
use Illuminate\Validation\ValidationException;

it('adds the relocation step for office roles', function () {
    expect(JobApplicationForm::make()->wizardSteps(['work_mode' => 'remote']))->toHaveCount(3);
    expect(JobApplicationForm::make()->wizardSteps(['work_mode' => 'office']))->toHaveCount(4);
});

it('rejects the first step without an email', function () {
    JobApplicationForm::make()->validateStep(0, [
        'name' => 'Asha Rao',
        'email' => '',
    ]);
})->throws(ValidationException::class);
```

These run without HTTP, so they're fast. Pair them with one feature test that posts a full application to `applications.store` and you've covered the flow.

## When not to use a wizard

- **Short forms.** Five fields on one page beat five fields over three steps. Splitting adds clicks without adding clarity.
- **Forms people come back to later.** Step checks save nothing, so closing the tab loses the answers. If users need to finish tomorrow, you need your own draft storage, and probably separate endpoints per step.
- **Steps that depend on the record being edited.** Because the endpoint rebuilds the form without arguments, per-record steps don't fit this model.

For sign-ups, onboarding, checkout and application forms filled in one sitting, it works well and keeps all the logic in one class.

## Where to go next

Try the Onboarding wizard in the [live demo](https://erag.in/laravel-inertia-forms/demo.html) to get a feel for the stepper, then convert your longest form. If you want to understand exactly which rules each step runs, read [one set of validation rules for Laravel and Inertia](./shared-validation-laravel-inertia.md).
