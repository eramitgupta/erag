---
title: 'Custom Fields'
description: 'Create your own field type: a small PHP class plus a Vue, React, or Svelte component registered on the Form component.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/frontend/custom-fields.md
</div>


<div class="doc-category">Frontend</div>

# Custom Fields

You can add your own field types. A custom field has two parts:

1. a **PHP class** that extends `Erag\InertiaForms\Fields\Field`,
2. a **frontend component** registered on `<Form>` through the `components` prop.

This page builds a star rating field called `Rating`.

## Live demo

The **Custom fields** form below uses three custom fields: `Rating` (stars with arrow-key support), `CodeInput` (one box per digit, with paste) and `QuantityStepper` (minus and plus buttons with a unit). Their PHP classes and Vue components are on the [Live Demo](/demo#custom-fields-in-this-demo) page.

<FormPlayground initial="custom-fields" />

## Examples

Each example below is a live form. The field class is written next to the form so the snippet is complete; in your app it lives in its own file, such as `app/Forms/Fields/Rating.php`. The matching frontend components are already registered in these docs.

### The Rating field

The class built on this page, used in a small review form. The value starts as `null` and becomes the number of stars you pick.

<Example id="frontend/custom-fields/rating">

<<< @/../examples/frontend/custom-fields/rating.php#example

</Example>

### Advanced: a stepper with common methods

A second custom field with its own options (`between()`, `unit()`). The common methods work on it unchanged: `required()`, `help()`, and `visibleWhen()` with `clearWhenHidden()` on the children count.

<Example id="frontend/custom-fields/stepper">

<<< @/../examples/frontend/custom-fields/stepper.php#example

</Example>

## 1. The PHP class

```php
<?php

namespace App\Forms\Fields;

use Erag\InertiaForms\Fields\Field;

class Rating extends Field
{
    protected int $stars = 5;

    /**
     * The frontend component name. Must match the key in `components`.
     */
    public function component(): string
    {
        return 'Rating';
    }

    public function stars(int $stars): static
    {
        $this->stars = $stars;

        return $this;
    }

    /**
     * Value before the user picks anything.
     */
    public function emptyValue(): mixed
    {
        return null;
    }

    /**
     * Rules added after `required`/`nullable` and before custom rules.
     */
    protected function typeRules(): array
    {
        return ['integer', 'between:1,'.$this->stars];
    }

    /**
     * Extra keys sent to the frontend next to the common ones.
     */
    protected function props(): array
    {
        return ['stars' => $this->stars];
    }
}
```

Use it like any other field:

```php
use App\Forms\Fields\Rating;

Rating::make('score')->label('How was your stay?')->stars(5)->required();
```

### Methods you can override

| Method | Purpose |
| ------ | ------- |
| `component(): string` | **Required.** The component name looked up in the frontend registry. |
| `props(): array` | Extra keys merged into the serialized field. |
| `typeRules(): array` | Rules generated from the field's configuration. |
| `validationRules(): array` | Full control over the rules, keyed by attribute (use this for `name.*` rules). |
| `emptyValue(): mixed` | The value used when there is no default or bound value. Default `''`. |
| `formatValue(mixed $value): mixed` | Convert a bound model value for the browser. |
| `hasValue(): bool` | Return `false` for display-only fields that carry no data. |
| `validationAttributes(): array` | Attribute names for validation messages, e.g. for `name.*.key`. `:position` is replaced with the row number. |
| `validationMessages(): array` | Custom messages keyed by `attribute.rule`. The form's own `messages()` still wins. |
| `dehydrateValue(mixed $value): mixed` | Change what `$form->validated()` returns for this field, e.g. turn rows into an array. |
| `validationRulesFor(array $data)` (and `validationAttributesFor` / `validationMessagesFor`) | Rules that depend on the submitted values, like one set per [Blocks](/fields/blocks) item. |
| `hasFiles(): bool` | Return `true` when the field sends files, so the form is submitted as multipart. |
| `getLabel(): string` | Change how the label is built. |

All common methods (`label()`, `required()`, `visibleWhen()`, `authorize()`, ...) work on custom fields automatically.

## 2. The frontend component

A field component receives these props:

| Prop | Vue | React | Svelte | Description |
| ---- | --- | ----- | ------ | ----------- |
| `field` | ✓ | ✓ | ✓ | The serialized field, including your `props()` keys. |
| `id` | ✓ | ✓ | ✓ | DOM id. The wrapper's `<label for>` points to it. |
| value | `modelValue` | `value` | `value` (`$bindable`) | The current value. |
| `error` | ✓ | ✓ | ✓ | The first error message, if any. |
| `disabled` | ✓ | ✓ | ✓ | `true` when the field is disabled. |
| `describedBy` | ✓ | ✓ | ✓ | Ids of the help and error elements, for `aria-describedby`. |
| update | emit `update:modelValue` | `onChange(value)` | `onChange(value)` | Report a new value. |

::: code-group

```vue [Vue]
<!-- resources/js/components/Rating.vue -->
<script setup lang="ts">
import type { FieldComponentProps } from '@erag/inertia-forms-vue';

const props = defineProps<FieldComponentProps>();
const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>();

const stars = Number(props.field.stars ?? 5);
</script>

<template>
    <div
        :id="id"
        role="radiogroup"
        :aria-describedby="describedBy"
        :aria-invalid="error ? true : undefined"
        class="flex gap-1"
    >
        <button
            v-for="star in stars"
            :key="star"
            type="button"
            role="radio"
            :aria-checked="modelValue === star"
            :aria-label="`${star} of ${stars}`"
            :disabled="disabled"
            class="text-2xl"
            :class="Number(modelValue) >= star ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600'"
            @click="emit('update:modelValue', star)"
        >
            ★
        </button>
    </div>
</template>
```

```tsx [React]
// resources/js/components/Rating.tsx
import type { FieldComponentProps } from '@erag/inertia-forms-react';

export function Rating({ field, id, value, error, disabled, describedBy, onChange }: FieldComponentProps) {
    const stars = Number(field.stars ?? 5);

    return (
        <div
            id={id}
            role="radiogroup"
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className="flex gap-1"
        >
            {Array.from({ length: stars }, (_, index) => index + 1).map((star) => (
                <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={value === star}
                    aria-label={`${star} of ${stars}`}
                    disabled={disabled}
                    className={`text-2xl ${Number(value) >= star ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`}
                    onClick={() => onChange(star)}
                >
                    ★
                </button>
            ))}
        </div>
    );
}
```

```svelte [Svelte]
<!-- resources/js/components/Rating.svelte -->
<script lang="ts">
    import type { FieldComponentProps } from '@erag/inertia-forms-svelte';

    let { field, id, value = $bindable(), error, disabled, describedBy, onChange }: FieldComponentProps =
        $props();

    const stars = Number(field.stars ?? 5);

    function pick(star: number) {
        value = star;
        onChange?.(star);
    }
</script>

<div
    {id}
    role="radiogroup"
    aria-describedby={describedBy}
    aria-invalid={error ? true : undefined}
    class="flex gap-1"
>
    {#each Array.from({ length: stars }, (_, index) => index + 1) as star (star)}
        <button
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} of ${stars}`}
            {disabled}
            class="text-2xl {Number(value) >= star ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600'}"
            onclick={() => pick(star)}
        >
            ★
        </button>
    {/each}
</div>
```

:::

::: tip Set `aria-invalid`
`<Form>` finds the first invalid field by looking for `aria-invalid="true"`. Set it when `error` is present so "scroll to first error" works with your component too.
:::

## 3. Register the component

Pass it to `<Form>` under the same name that `component()` returns:

::: code-group

```vue [Vue]
<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';
import Rating from '@/components/Rating.vue';

defineProps<{ form: FormSchema }>();
</script>

<template>
    <Form :form="form" :components="{ Rating }" />
</template>
```

```tsx [React]
import { Form, type FormSchema } from '@erag/inertia-forms-react';
import { Rating } from '@/components/Rating';

const components = { Rating };

export default function Review({ form }: { form: FormSchema }) {
    return <Form form={form} components={components} />;
}
```

```svelte [Svelte]
<script lang="ts">
    import { Form, type FormSchema } from '@erag/inertia-forms-svelte';
    import Rating from '@/components/Rating.svelte';

    let { form }: { form: FormSchema } = $props();
</script>

<Form {form} components={{ Rating }} />
```

:::

In React, define the `components` object outside the component (or memoize it) so it keeps the same identity between renders.

If a field names a component that isn't registered, it is skipped and a warning is logged in the console.

## How custom fields are wrapped

`<Form>` wraps every field component (built-in or custom) in a wrapper that renders:

- a `<label for={id}>` with the field label and a `*` when required,
- your component,
- the help text,
- the error message.

So your component only needs to draw the control itself.

## Replacing a built-in component

Register a component under a built-in name to replace it everywhere in that form. The built-in names are the keys of the exported `builtInComponents` object:

`TextInput`, `Textarea`, `Combobox`, `Select`, `Radio`, `Checkbox`, `CheckboxGroup`, `Toggle`, `DatePicker`, `TimePicker`, `ColorPicker`, `Slider`, `FileUpload`, `TagsInput`, `KeyValue`, `Blocks`, `Repeater`, `Link`, `Slug`, `OtpInput`, `Composer`, `Heading`, `Text`, `Html`, `Separator`, `Callout`.

::: code-group

```vue [Vue]
<template>
    <Form :form="form" :components="{ DatePicker: MyDatePicker }" />
</template>
```

```tsx [React]
<Form form={form} components={{ DatePicker: MyDatePicker }} />
```

```svelte [Svelte]
<Form {form} components={{ DatePicker: MyDatePicker }} />
```

:::

Your replacement receives the same props as the original. Notes:

- PHP serializes both `Combobox` and its `Select` alias with the component name `Combobox`. Register your dropdown under either name: a `Select` replacement is used for `Combobox` fields too, unless you also register `Combobox`. The same component handles `searchable()` and `searchUsing()` fields.
- A `Blocks` replacement also renders `Repeater` fields, unless you register a separate `Repeater` component.
- `Heading`, `Text`, `Html`, `Separator` and `Callout` are rendered without the label, help and error wrapper, and receive no useful `value`.
- `Hidden` and `Submit` are handled by `<Form>` itself and can't be replaced through `components`. Use the form's children and a custom button if you need a different submit area.
