---
title: 'Hidden'
description: 'Send a value with the form without showing a control, like a source tag or a parent ID.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/hidden.md
</div>


<div class="doc-category">Fields</div>

# Hidden

`Erag\InertiaForms\Fields\Hidden` adds a value to the form data without rendering anything.

**When to use:** carrying a value through the form that the user doesn't edit, like a referral source, a step number, or a parent ID.

```php
use Erag\InertiaForms\Fields\Hidden;

Hidden::make('source')->default('pricing-page');
Hidden::make('team_id')->default(fn () => auth()->user()->current_team_id);
```

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

Only the email input is visible, but the submitted data also contains `source`.

<Example id="fields/hidden/basic">

<<< @/../examples/fields/hidden/basic.php#example

</Example>

### Advanced: values from bound data

A reply form whose post and parent comment IDs come from `bind()`, the way a controller passes them in. Both are still validated on the server, because the user can change them.

<Example id="fields/hidden/reply">

<<< @/../examples/fields/hidden/reply.php#example

</Example>

## Methods

Hidden has no methods of its own. The useful [common methods](/concepts/form-class#common-field-methods) are:

- `default(mixed $value)` sets the value. A closure is resolved when the form is serialized.
- `rules()` / `rule()` add validation.
- `required()` adds the `required` rule.
- `visibleWhen()` / `hiddenWhen()` include the value in validation only when the condition passes.
- `authorize()` removes the field for some users.

Display methods such as `label()`, `placeholder()`, and `help()` have no visible effect. The label is still used as the attribute name in error messages.

## Validation rules

Hidden generates no type rules. It only gets `required` or `nullable`, plus your own rules.

```php
Hidden::make('plan_id')->required()->rule('exists:plans,id');
// ['required', 'exists:plans,id']
```

::: warning Don't trust hidden values
The value lives in the browser and can be changed by the user before submitting. Always validate it, and never use it for authorization decisions. For values the user must not change, read them on the server instead.
:::

## Value

- Stores whatever you set with `default()` or bind from a model.
- Empty value: `''`.

## Standalone use

Hidden has no frontend component. `<Form>` skips it when rendering and simply sends its value. Outside `<Form>`, keep the value in your own state.
