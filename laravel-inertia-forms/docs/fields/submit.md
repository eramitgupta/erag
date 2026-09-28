---
title: 'Submit'
description: 'Submit buttons with variants, sizes, icons and a saving label. Add several buttons with intent() to offer actions like Save draft and Publish.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/submit.md
</div>


<div class="doc-category">Fields</div>

# Submit

`Erag\InertiaForms\Fields\Submit` renders a submit button. While the form is submitting, the button is disabled and shows a spinner. You can style it with variants, sizes and an icon, and put several buttons in one form, each sending its own `intent`.

**When to use:** every form that needs a custom button text, a "processing" text, a specific position or style for the button, or more than one action.

Unlike other fields, the argument to `make()` is the **button text**, not a data key.

Try several buttons on the **Landing page** form in the [Live Demo](/demo).

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Variants

Every style side by side. Buttons that follow each other share one row.

<Example id="fields/submit/variants">

<<< @/../examples/fields/submit/variants.php#example

</Example>

### Sizes

`small()`, the default `md`, and `large()`.

<Example id="fields/submit/sizes">

<<< @/../examples/fields/submit/sizes.php#example

</Example>

### Icons and full width

A sign-in form with a full-width button and an icon after the text. During a real request, a spinner replaces the icon and `processingLabel()` replaces the text.

<Example id="fields/submit/icons">

<<< @/../examples/fields/submit/icons.php#example

</Example>

### Advanced: two actions

"Save draft" and "Publish" submit the same fields, and the clicked button adds its value under `intent` (`draft` or `publish`), so your controller can tell them apart. Try both buttons: the submitted data shows the intent. `onBeforeSubmit` receives it too.

<Example id="fields/submit/intents">

<<< @/../examples/fields/submit/intents.php#example

</Example>

### Advanced: save only after a change

An edit form filled from a model. "Save changes" stays disabled until a value changes, and turns off again when the value is changed back.

<Example id="fields/submit/until-dirty">

<<< @/../examples/fields/submit/until-dirty.php#example

</Example>

## Methods

### `processingLabel(?string $label)`

Text shown on the button while the request is running. Without it, the normal text stays and only the spinner appears.

```php
Submit::make('Save')->processingLabel('Saving…');
```

### `variant(string $variant)`

The button style. One of:

| Variant | Shortcut | Look |
| ------- | -------- | ---- |
| `primary` (default) | `primary()` | Filled with the accent color |
| `secondary` | `secondary()` | Neutral, for the less important action |
| `danger` | `danger()` | Red, for destructive actions |
| `outline` | `outline()` | Border only |
| `ghost` | `ghost()` | No border or background until hovered |
| `link` | `link()` | Looks like a text link |

Any other value throws an `InvalidArgumentException`.

```php
Submit::make('Delete project')->danger();
```

### `size(string $size)`

`sm`, `md` (default) or `lg`. The shortcuts `small()` and `large()` do the same. Any other value throws an `InvalidArgumentException`.

### `fullWidth(bool $fullWidth = true)`

Stretch the button across its row. Handy on narrow forms and in sign-in screens.

### `icon(?string $icon, string $position = 'left')`

Show a package icon, like `user`, `check`, `send`, `arrowRight` or `trash`, before the text. Pass `'right'` as the second argument to put it after the text. See [Icons](/icons) for every name.

```php
Submit::make('Continue')->icon('arrowRight', 'right');
```

### `intent(string $value, string $key = 'intent')`

Send `key => value` with the form when this button is clicked. Use it to offer several actions in one form:

```php
Submit::make('Save draft')->secondary()->intent('draft'),
Submit::make('Publish')->icon('send', 'right')->intent('publish')->processingLabel('Publishing…'),
```

The form accepts only the values of its own buttons: the rules get `'intent' => ['nullable', 'string', Rule::in(['draft', 'publish'])]`, so a request with `intent=delete` fails validation. The value is part of `validated()`:

```php
public function store(#[Validate] PageForm $form)
{
    $page = Page::create(Arr::except($form->validated(), 'intent'));

    if ($form->validated('intent') === 'publish') {
        $page->publish();
    }

    return to_route('pages.index');
}
```

Buttons can use different keys (`intent('archive', 'action')`); each key gets its own rule. When the form is sent without clicking an intent button, the key is empty, so give it a default in your controller.

### `disableUntilDirty(bool $disable = true)`

Keep the button disabled until the user changes a value. Useful for "Save changes" on an edit form, so nobody sends a request that changes nothing.

```php
Submit::make('Save changes')->disableUntilDirty();
```

The form is dirty when any value differs from its starting value. After a successful submit the saved values become the new starting point, so the button turns off again. The frontend can read the same state; see [Unsaved changes](/frontend/form-component#unsaved-changes).

### Common methods that apply

| Method | Effect |
| ------ | ------ |
| `label(?string $label)` | Overrides the button text set in `make()`. |
| `disabled(bool $disabled = true)` | Disables the button. |
| `class(?string $class)` | Extra classes on the button's wrapper row, for example `'justify-end'`. |
| `visibleWhen()` / `hiddenWhen()` | Show the button only in some states. |
| `authorize()` / `authorizedWhen()` / `authorizedUnless()` | Remove the button for some users. |

Other common methods (`help()`, `placeholder()`, `required()`, `rules()`, `columnSpan()`, ...) have no effect on the button.

## Placement

The button renders where you put it in `fields()`. Buttons that follow each other share one row, so a "Save draft" and a "Publish" button sit side by side. Most forms put them last:

```php
public function fields(): array
{
    return [
        Fieldset::make('Profile')->columns(2)->fields([...]),
        Submit::make('Save profile')->class('justify-end'),
    ];
}
```

If a form has **no** `Submit` field, `<Form>` adds a default "Submit" button at the end, after any content you pass as children. Add a `Submit` field to control its text and position. Forms with a [Composer](/fields/composer) use its **Send** button instead, and in a [wizard](/concepts/wizard) the buttons appear on the last step.

## Validation rules

None for the button itself. It carries no value, so it is not part of the form data. Buttons with `intent()` add one rule per key, as shown above.

## Value

No value. `data()` never contains the button. With `intent()`, `validated()` contains the intent key and the value of the clicked button, like `['intent' => 'publish']`.

## Standalone use

`SubmitButton` is exported for custom layouts. It does not use the field props contract; it takes these props instead:

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `label` | `string` | Button text. |
| `processingLabel` | `string \| null` | Optional text while processing. |
| `processing` | `boolean` | Shows the spinner and disables the button. |
| `disabled` | `boolean` | Optional. Disables the button. |

Inside `<Form>`, the style options (`variant`, `size`, `fullWidth`, `icon`, `iconPosition`) and the `intent` are read from the serialized `Submit` field. See [Serialized Schema](/reference/schema#keys-per-field-type).

::: code-group

```vue [Vue]
<SubmitButton label="Save" processing-label="Saving…" :processing="form.processing" class="justify-end" />
```

```tsx [React]
<SubmitButton label="Save" processingLabel="Saving…" processing={form.processing} className="justify-end" />
```

```svelte [Svelte]
<SubmitButton label="Save" processingLabel="Saving…" processing={form.processing} class="justify-end" />
```

:::

The button has `type="submit"`, so place it inside your own `<form>`. Extra classes go on its wrapper row (`class` in Vue and Svelte, `className` in React).
