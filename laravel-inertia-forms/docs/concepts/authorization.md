---
title: 'Authorization'
description: 'Hide fields, fieldsets, or a whole form from users who should not see them with authorize(), authorizedWhen(), and authorizedUnless().'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/concepts/authorization.md
</div>


<div class="doc-category">Core Concepts</div>

# Authorization

Remove a field, a fieldset, or the whole form for users who shouldn't see it.

```php
TextInput::make('salary')
    ->number()
    ->authorize(fn () => auth()->user()->can('manage-salaries'));
```

**When to use:** admin-only fields, role-based sections, or forms that only some users may submit.

Authorization is different from [visibility](/concepts/visibility). Visibility depends on what the user types and is checked in the browser. Authorization is decided on the server, and unauthorized items **never reach the browser at all**.

## Examples

Each example is a live form built from the PHP below it. The checks use plain booleans so the result is fixed; in your app they would come from the current user, as the comments show.

### Basic

`salary` fails its check, so it is missing from the preview and from the submitted data. `notes` passes because `authorizedUnless()` gets `false`.

<Example id="concepts/authorization/basic">

<<< @/../examples/concepts/authorization/basic.php#example

</Example>

### A whole fieldset

One check on the fieldset removes every field inside it. Only the Profile section is rendered.

<Example id="concepts/authorization/fieldset">

<<< @/../examples/concepts/authorization/fieldset.php#example

</Example>

### Advanced: role-based sections

The role is passed to the constructor, and the checks read it. The preview is built for an HR user: Compensation is shown, but `bonus_eligible` is removed because it also needs the admin role. Every check on an item must pass.

<Example id="concepts/authorization/roles">

<<< @/../examples/concepts/authorization/roles.php#example

</Example>

## Methods

All three methods accept a `bool` or a `Closure`. They are available on fields, fieldsets, and the form.

| Method | Passes when |
| ------ | ----------- |
| `authorize($check)` | the check is truthy |
| `authorizedWhen($check)` | the check is truthy (alias of `authorize()`) |
| `authorizedUnless($check)` | the check is falsy |

```php
TextInput::make('internal_notes')->authorizedWhen($user->isStaff());

Toggle::make('featured')->authorizedUnless(fn () => $user->isGuest());
```

A closure receives the item it belongs to (the field, fieldset, or form) and is evaluated when the form is serialized or validated.

You can call these methods more than once. **Every** check must pass.

```php
Combobox::make('owner_id')
    ->authorize(fn () => auth()->check())
    ->authorize(fn () => auth()->user()->can('reassign', Post::class));
```

## Fields and fieldsets

An unauthorized field or fieldset is removed everywhere:

- it is not in the serialized schema,
- it has no initial value in `data()`,
- it gets no validation rules, so any submitted value is ignored by `validated()`,
- `getField('name')` returns `null`.

```php
Fieldset::make('Admin')
    ->authorize(fn () => auth()->user()->isAdmin())
    ->fields([
        Toggle::make('is_verified'),
        Combobox::make('plan')->options(Plan::class),
    ]);
```

## The whole form

Call the methods on the form instance, or inside your class (for example in the constructor):

```php
return Inertia::render('Settings/Billing', [
    'form' => BillingForm::make()->authorize($request->user()->can('update-billing')),
]);
```

When the whole form is unauthorized:

- **Serialization** returns an empty form: no fieldsets, no data, and `action` set to `null`. The frontend renders nothing but the default submit button, and submitting does nothing because there is no action.
- **Validation** with `validate()` or `#[Validate]` throws an `AuthorizationException` (HTTP 403).

To throw instead of returning an empty form during serialization, enable `throw_on_unauthorized` in the [config](/reference/artisan-config#configuration):

```php
// config/inertia-forms.php
'throw_on_unauthorized' => true,
```

## Authorizing inside the class

Because the check is evaluated late, you can keep authorization inside `fields()`:

```php
class PostForm extends Form
{
    public function fields(): array
    {
        return [
            TextInput::make('title')->required(),
            Toggle::make('pinned')->authorize(fn () => auth()->user()?->can('pin', Post::class) ?? false),
            Submit::make('Save'),
        ];
    }
}
```
