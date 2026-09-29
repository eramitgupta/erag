---
title: One Set of Validation Rules for Laravel and Inertia
description: Stop duplicating Laravel Inertia validation in PHP and Vue. Generate rules from field definitions, skip hidden fields, and test them with Pest.
date: 2026-09-29
package: laravel-inertia-forms
category: Guide
tags: [laravel, inertia, validation, forms, pest]
---

Laravel Inertia validation starts out simple. Rules go in a FormRequest, Laravel redirects back with errors, and Inertia hands them to your page. Then the page needs to know things the rules already know. Which fields get a `*`. What the `maxlength` is. Which options the select offers. Which input to show when "Billing" is picked.

So you write that knowledge down a second time, in the template. And the two copies start to drift.

This post is about keeping one copy. I'll show where the drift comes from, then how Laravel Inertia Forms builds rules from the field definitions themselves, what happens to hidden and unauthorized fields, and how to test the result with Pest.

## Where Laravel Inertia validation drifts

Here's a support ticket form written the usual way. The rules:

```php
// app/Http/Requests/StoreTicketRequest.php
public function rules(): array
{
    return [
        'subject' => ['required', 'string', 'max:120'],
        'category' => ['required', Rule::in(['billing', 'bug', 'account'])],
        'order_number' => ['required_if:category,billing', 'nullable', 'exists:orders,number'],
        'description' => ['required', 'string', 'min:20', 'max:2000'],
    ];
}
```

And the template, a few months later:

```vue
<input v-model="form.subject" maxlength="100" required />

<select v-model="form.category">
    <option value="billing">Billing</option>
    <option value="bug">Bug report</option>
    <option value="account">Account access</option>
    <option value="feature">Feature request</option>
</select>

<input v-if="form.category === 'billing'" v-model="form.order_number" />
```

Three bugs, none of them dramatic. The input stops at 100 characters while the server allows 120. There's a "Feature request" option the server rejects with a confusing error. And the `v-if` restates `required_if` in JavaScript, so the next person who changes one has to remember the other.

No amount of discipline fixes this for long. The fix is to have one definition that both sides read.

## Rules come from the field definition

In Laravel Inertia Forms, a field's configuration is its rule source. `maxLength(120)` sets the HTML attribute and adds `max:120`. `options([...])` renders the choices and generates `Rule::in()` with the same values. Here's the ticket form as a form class:

```php
<?php

namespace App\Forms;

use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class SupportTicketForm extends Form
{
    protected ?string $actionRoute = 'tickets.store';

    public function fields(): array
    {
        return [
            TextInput::make('subject')->required()->maxLength(120),
            Combobox::make('category')->required()->options([
                'billing' => 'Billing',
                'bug' => 'Bug report',
                'account' => 'Account access',
            ]),
            TextInput::make('order_number')
                ->required()
                ->rule('exists:orders,number')
                ->visibleWhen('category', 'billing')
                ->clearWhenHidden(),
            Radio::make('priority')->buttons()->default('normal')->options([
                'low' => 'Low',
                'normal' => 'Normal',
                'urgent' => 'Urgent',
            ]),
            Textarea::make('description')->required()->minLength(20)->maxLength(2000)->showCharacterCount(),
            Submit::make('Open ticket'),
        ];
    }
}
```

Each field builds its list in the same order:

1. **Presence.** `required` if you called `required()`, otherwise `nullable`.
2. **Type rules** the field generates from its configuration.
3. **Your rules** from `rules()` and `rule()`, in the order you added them.

You can print the result at any time, which is the fastest way to trust it:

```php
SupportTicketForm::make()->rules();
// [
//     'subject'     => ['required', 'string', 'max:120'],
//     'category'    => ['required', Rule::in(['billing', 'bug', 'account'])],
//     'priority'    => ['nullable', Rule::in(['low', 'normal', 'urgent'])],
//     'description' => ['required', 'string', 'min:20', 'max:2000'],
// ]
```

Notice `order_number` isn't there. That's the next section. The full table of generated rules per field type is on the [validation page](https://erag.in/laravel-inertia-forms/concepts/validation.html).

## Hidden fields are not validated

`visibleWhen('category', 'billing')` is serialized into the form schema. The browser evaluates it on every change, and the server evaluates the same condition during validation with the same comparison logic. A field that isn't visible for the submitted data gets no rules at all.

Pass data to `rules()` to see it:

```php
SupportTicketForm::make()->rules(['category' => 'billing']);
// adds: 'order_number' => ['required', 'string', 'exists:orders,number']
```

So `required()` on a conditional field means "required when shown". No `required_if`, no `v-if`, no second copy of the condition.

Two details worth knowing:

- A hidden field's value is still sent with the request unless you use `clearWhenHidden()`. It's never validated and never appears in `validated()`, but clearing it keeps the request clean.
- Hiding a whole fieldset with `visibleWhen()` skips every field inside it.

The [conditional visibility page](https://erag.in/laravel-inertia-forms/concepts/visibility.html) lists the operators, like `>=`, `contains` and `not_empty`.

## Unauthorized fields don't exist at all

Visibility depends on what the user types. Authorization depends on who they are, and it's stricter:

```php
TextInput::make('internal_tag')->authorize(fn () => auth()->user()?->isStaff() ?? false),
```

For a non-staff user, `internal_tag` isn't in the schema, has no initial value and gets no rules. If someone adds `internal_tag` to the request by hand, `validated()` drops it. That last part matters for mass assignment.

## Adding the rules fields can't guess

Some rules are about your data, not the field type. Add them with `rule()` for one rule, or `rules()` for several:

```php
use Illuminate\Validation\Rule;

TextInput::make('username')
    ->required()
    ->rules('alpha_dash|min:3')
    ->rule(Rule::unique('users', 'username'));
```

`rule()` also takes a closure:

```php
TextInput::make('coupon')->rule(function (string $attribute, mixed $value, \Closure $fail) {
    if ($value !== null && ! Coupon::valid($value)) {
        $fail('This coupon has expired.');
    }
});
```

One gotcha: a string passed to `rules()` is split on `|`. A regex containing a pipe needs `rule()` or an array.

Checkboxes and toggles are the other special case. `required()` on them means "must be switched on" and generates `accepted`, which is exactly what a terms checkbox wants.

## Validating in the controller

For create screens, `#[Validate]` on a controller parameter resolves the form and validates before your method runs:

```php
use Erag\InertiaForms\Attributes\Validate;

public function store(Request $request, #[Validate] SupportTicketForm $form): RedirectResponse
{
    $request->user()->tickets()->create($form->validated());

    return to_route('tickets.index');
}
```

For edit screens, validate on a bound instance instead. The attribute builds a fresh form without a model, so rules that depend on the model, like a unique rule that ignores the current row, need this:

```php
public function update(Request $request, Ticket $ticket): RedirectResponse
{
    $ticket->update(SupportTicketForm::make()->bind($ticket)->validate($request));

    return back();
}
```

Either way, a failure throws Laravel's `ValidationException`. Laravel redirects back, Inertia passes the errors along, and `<Form>` shows the first error under each field and scrolls to the first one. If the whole form is unauthorized, validation throws an `AuthorizationException` (403) instead.

A few display details you'd otherwise build by hand: errors for array items, like `tags.0`, are shown under the parent `tags` field, and a field's errors clear as soon as the user changes it. The first invalid field also gets focus, which matters more than it sounds on a long form with the error below the fold.

After validating, `validated('order_number')` reads one value and `validated('address.city', 'N/A')` reads a nested one with a default.

## Messages and attribute names

Field labels double as attribute names, so a field labelled "Work email" produces "The Work email field is required." For anything else, add `messages()` and `attributes()` to the class, the same shape you'd use in a FormRequest:

```php
public function messages(): array
{
    return [
        'description.min' => 'Tell us a bit more (at least :min characters).',
    ];
}

public function attributes(): array
{
    return [
        'order_number' => 'order number',
    ];
}
```

These messages come from Laravel's validator, so they're built in the active locale. If you run a multilingual app, your `lang/{locale}/validation.php` files apply as usual; I go through that in [building a multilingual Laravel Inertia app](./multilingual-laravel-inertia-app.md).

## Client-side checks are a convenience

`<Form>` accepts an `onBeforeSubmit` callback (`:on-before-submit` in Vue). It gets the form data and a `setErrors()` helper, and returning `false` cancels the submit. It's handy for checks that don't need the server, like "start and end dates can't be the same day".

Treat it as UX, not validation. The server runs every rule again when the request arrives, and that's the result you trust. Wizards follow the same idea: each step is checked on the server before the user moves on, which I cover in [multi-step form wizards in Laravel Inertia](./multi-step-form-wizard-laravel-inertia.md).

## Testing the rules with Pest

Because rules are plain arrays you can ask for, testing conditional logic is short:

```php
use App\Forms\SupportTicketForm;

it('only requires an order number for billing tickets', function () {
    expect(SupportTicketForm::make()->rules(['category' => 'billing']))
        ->toHaveKey('order_number');

    expect(SupportTicketForm::make()->rules(['category' => 'bug']))
        ->not->toHaveKey('order_number');
});
```

And a feature test covers the full round trip:

```php
it('rejects a billing ticket without an order number', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('tickets.store'), [
            'subject' => 'Charged twice',
            'category' => 'billing',
            'description' => 'I was charged twice for the same order this morning.',
        ])
        ->assertSessionHasErrors('order_number');
});
```

## When a FormRequest is still the better fit

Pure API endpoints with no form on screen don't gain much from a form class; a FormRequest says what it does and nothing more. The same goes for validation that depends on complex cross-field logic beyond "show this when that". You can express it with closure rules, but if most of a form's rules are closures, the generated rules aren't buying you much.

## Where to go next

Take one form where you know the template and the rules disagree, move it into a form class, and print `rules()`. If you're new to the package, start with [building Inertia forms from a single PHP class](./laravel-inertia-forms-php-class.md) for the install and a full create and edit example.
