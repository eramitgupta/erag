---
title: 'Wizard (Multi-Step Forms)'
description: 'Turn a form into a multi-step wizard: each fieldset becomes a step with a stepper, Back and Continue buttons, and server-side validation per step.'
head:
    - - meta
      - name: robots
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    - - meta
      - name: googlebot
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    - - meta
      - name: bingbot
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/concepts/wizard.md
</div>


<div class="doc-category">Core Concepts</div>

# Wizard

A wizard shows a form one part at a time. Every [fieldset](/concepts/fieldsets) becomes a **step**, a stepper at the top shows where the user is, and **Continue** checks the current step on the server before moving on. It is still one form class, one `data` object and one final submit.

**When to use:** sign-up and onboarding flows, checkout, applications and long intake forms, where a single page of fields would feel like too much.

```php
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\OtpInput;
use Erag\InertiaForms\Fields\Slug;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class SignupForm extends Form
{
    protected ?string $actionRoute = 'signup.store';

    protected bool $wizard = true;

    public function fields(): array
    {
        return [
            Fieldset::make('Account')->description('Your login details')->icon('user')->fields([
                TextInput::make('name')->required(),
                TextInput::make('email')->email()->required(),
                TextInput::make('password')->password()->minLength(8)->required(),
            ]),
            Fieldset::make('Workspace')->description('Name your team space')->icon('briefcase')->fields([
                TextInput::make('workspace')->required(),
                Slug::make('workspace_url')->from('workspace')->prefix('app.example.test/')->required(),
            ]),
            Fieldset::make('Verify')->description('Enter the code we emailed you')->icon('shield')->fields([
                OtpInput::make('code')->length(6)->required(),
            ]),
            Submit::make('Create account')->processingLabel('Creating…'),
        ];
    }
}
```

The controller and the page don't change: pass `SignupForm::make()` to Inertia, render `<Form>`, and validate with `#[Validate]` as usual.

Try it on the **Onboarding wizard** form in the [Live Demo](/demo).

## Examples

Each example is a live wizard built from the PHP below it. The docs have no server, so **Continue** skips the step check here and only the final submit checks `required` fields.

### Basic

Two fieldsets, two steps. The trailing `Submit` appears on the last step.

<Example id="concepts/wizard/basic">

<<< @/../examples/concepts/wizard/basic.php#example

</Example>

### Icons, descriptions and labels

Three steps with an icon and a description each, plus custom button labels set as properties.

<Example id="concepts/wizard/stepper">

<<< @/../examples/concepts/wizard/stepper.php#example

</Example>

### Advanced: conditional steps

A checkout where the second step depends on the first answer: Shipping for delivery, Pickup for collection. Switch the delivery option and the stepper changes. The wizard is turned on in the constructor, which keeps it working with the server step check.

<Example id="concepts/wizard/checkout">

<<< @/../examples/concepts/wizard/checkout.php#example

</Example>

## Turning it on

Set the `$wizard` property in the class, as above. The button texts can be set the same way:

```php
protected bool $wizard = true;

protected string $wizardNextLabel = 'Next';

protected string $wizardBackLabel = 'Previous';
```

Or call `wizard()` with named arguments:

```php
public function __construct()
{
    $this->wizard(nextLabel: 'Next step', backLabel: 'Go back');
}
```

`wizard(bool $wizard = true, ?string $nextLabel = null, ?string $backLabel = null)` defaults to **Continue** and **Back**. `wizard(false)` turns it off again.

::: warning Turn it on inside the class
Step checks run on a package endpoint that rebuilds your form with `YourForm::make()`, without arguments, the same way [remote combobox search](/fields/combobox#searchusing-closure-callback) does. The endpoint only answers for forms that are a wizard **after** `make()`, so set `$wizard` (or call `wizard()` in the constructor) rather than calling `->wizard()` in a controller. For the same reason, the fields of a wizard must not depend on a bound model or on constructor arguments to decide their rules.
:::

## Steps

- Each visible fieldset that holds at least one field other than a [Submit](/fields/submit) button is a step. Loose fields between fieldsets are grouped into a step of their own, like on a normal form.
- The stepper shows each step's `icon()`, `legend()` and `description()`.
- A fieldset with [`visibleWhen()`](/concepts/visibility) is a step only while it is visible, so steps can appear and disappear as the user answers earlier questions.
- Submit buttons are shown on the last step. A trailing `Submit` outside any fieldset, like in the example, does not make an extra step.

### `Fieldset::icon(?string $icon)`

A package icon name shown for the step in the stepper, for example `user`. It has no effect outside a wizard. See [Icons](/icons) for every name.

## Moving between steps

- **Back** goes to the previous step without checking anything.
- **Continue** sends the current step's values to the server. When they pass, the next step opens; when they fail, the messages appear under the fields, exactly like after a normal submit.
- Pressing **Enter** in a field continues to the next step instead of submitting the form. On the last step it submits.
- File fields ([File Upload](/fields/file-upload), [Composer](/fields/composer) attachments) are skipped by the step check and validated with the final submit, since files are only sent then.
- The final submit validates the whole form again. If it fails, the wizard jumps to the step that holds the first invalid field.

## How a step is checked

Continue posts to `POST /_inertia-forms/validate-step` with an encrypted form token, the step index and the current data. The package:

1. decrypts the form class and rejects anything that isn't one of your `Form` classes (404),
2. builds the form with `make()` and checks that it is a wizard (404) and that its `authorize()` passes (403),
3. runs the rules of the visible fields in that step, with your `messages()` and `attributes()`,
4. answers `204 No Content` when the step is valid, or the usual `422` JSON with errors.

Nothing is saved by a step check. The data is only trusted after the final `validate()` in your controller.

The route name is `inertia-forms.validate-step`. Change its path or middleware under `wizard` in the [config file](/reference/artisan-config#wizard).

You can run the same checks yourself:

```php
$form = SignupForm::make();

$form->wizardSteps($data);      // the fieldsets that are steps for this data
$form->validateStep(0, $data);  // throws ValidationException when step 0 is invalid
```

## Schema

A wizard form serializes a `wizard` object (it is `null` for other forms):

```json
"wizard": {
    "nextLabel": "Continue",
    "backLabel": "Back",
    "validateUrl": "https://example.test/_inertia-forms/validate-step",
    "token": "eyJpdiI6..."
}
```

See [Serialized Schema](/reference/schema#form).
