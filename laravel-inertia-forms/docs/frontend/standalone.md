---
title: 'Standalone Components'
description: 'Use the field components on their own, outside Form, for filter bars, settings panels, or hand-built layouts in Vue, React, and Svelte.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/frontend/standalone.md
</div>


<div class="doc-category">Frontend</div>

# Standalone Components

Every field component is exported, so you can use it outside `<Form>`: in a filter bar, a settings panel, or a hand-built form with its own layout.

**When to use:** you want the look and behavior of a field, but not the whole `<Form>` (for example, a search box that filters a table as you type).

## Exports

Each package (`@erag/inertia-forms-vue`, `-react`, `-svelte`) exports:

- `Form`
- field components: `TextInput`, `Textarea`, `Combobox` (also exported as `Select`), `Radio`, `Checkbox`, `CheckboxGroup`, `Toggle`, `DatePicker`, `TimePicker`, `ColorPicker`, `Slider`, `FileUpload`, `TagsInput`, `KeyValue`, `Blocks`, `Repeater`, `Link`, `Slug`, `OtpInput`, `Composer`, `SubmitButton`
- display components: `Heading`, `Text`, `Html`, `Separator`, `Callout`
- `FieldWrapper`
- `builtInComponents` (name → component map used by `<Form>`)
- `isVisible(conditions, data)`
- types: `FormSchema`, `FieldSchema`, `FieldsetSchema`, `FieldOption`, `FormErrors`, `VisibilityCondition`, `FieldComponentProps`, `FormProps`, plus field-specific schema and value types (see [Serialized Schema](/reference/schema#typescript))

## Props

Field components use the same props as [custom fields](/frontend/custom-fields#_2-the-frontend-component):

| Vue | React | Svelte | Required |
| --- | ----- | ------ | -------- |
| `field` | `field` | `field` | yes |
| `id` | `id` | `id` | yes |
| `v-model` (`modelValue`) | `value` + `onChange` | `bind:value` (or `value` + `onChange`) | yes |
| `disabled` | `disabled` | `disabled` | yes |
| `error` | `error` | `error` | no |
| `describedBy` | `describedBy` | `describedBy` | no |

## Getting a `field` object

Components read their settings (type, options, placeholder, ...) from `field`. The easiest way to get a correct object is to build the field in PHP and pass it as a prop. Fields are `Arrayable`, so they serialize like forms:

```php
use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\TextInput;

return Inertia::render('Orders/Index', [
    'orders' => $orders,
    'searchField' => TextInput::make('search')->search()->placeholder('Search orders…'),
    'statusField' => Combobox::make('status')->options(OrderStatus::class)->placeholder('All statuses'),
]);
```

You can also write the object by hand. TypeScript expects the common keys to be present:

```ts
import type { FieldSchema } from '@erag/inertia-forms-react'; // or -vue / -svelte

const searchField: FieldSchema = {
    component: 'TextInput',
    name: 'search',
    label: 'Search',
    help: null,
    placeholder: 'Search orders…',
    required: false,
    disabled: false,
    readonly: false,
    autofocus: false,
    columnSpan: null,
    class: null,
    visibility: null,
    clearWhenHidden: false,
    emptyValue: '',
    type: 'search',
};
```

See [Serialized Schema](/reference/schema) for the keys each field type uses.

## Example: a filter bar

::: code-group

```vue [Vue]
<script setup lang="ts">
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import { Combobox, TextInput, type FieldSchema } from '@erag/inertia-forms-vue';

const props = defineProps<{
    searchField: FieldSchema;
    statusField: FieldSchema;
    filters: { search?: string; status?: string | null };
}>();

const search = ref(props.filters.search ?? '');
const status = ref(props.filters.status ?? null);

watch([search, status], () => {
    router.get('/orders', { search: search.value, status: status.value }, { preserveState: true, replace: true });
});
</script>

<template>
    <div class="grid gap-4 sm:grid-cols-2">
        <TextInput v-model="search" :field="searchField" id="search" :disabled="false" />
        <Combobox v-model="status" :field="statusField" id="status" :disabled="false" />
    </div>
</template>
```

```tsx [React]
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Combobox, TextInput, type FieldSchema } from '@erag/inertia-forms-react';

interface Props {
    searchField: FieldSchema;
    statusField: FieldSchema;
    filters: { search?: string; status?: string | null };
}

export function Filters({ searchField, statusField, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState<unknown>(filters.status ?? null);

    function apply(next: { search: string; status: unknown }) {
        router.get('/orders', next, { preserveState: true, replace: true });
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
                field={searchField}
                id="search"
                value={search}
                disabled={false}
                onChange={(value) => {
                    setSearch(String(value));
                    apply({ search: String(value), status });
                }}
            />
            <Combobox
                field={statusField}
                id="status"
                value={status}
                disabled={false}
                onChange={(value) => {
                    setStatus(value);
                    apply({ search, status: value });
                }}
            />
        </div>
    );
}
```

```svelte [Svelte]
<script lang="ts">
    import { router } from '@inertiajs/svelte';
    import { Combobox, TextInput, type FieldSchema } from '@erag/inertia-forms-svelte';

    let {
        searchField,
        statusField,
        filters,
    }: {
        searchField: FieldSchema;
        statusField: FieldSchema;
        filters: { search?: string; status?: string | null };
    } = $props();

    let search = $state(filters.search ?? '');
    let status = $state<unknown>(filters.status ?? null);

    function apply() {
        router.get('/orders', { search, status }, { preserveState: true, replace: true });
    }
</script>

<div class="grid gap-4 sm:grid-cols-2">
    <TextInput field={searchField} id="search" bind:value={search} disabled={false} onChange={apply} />
    <Combobox field={statusField} id="status" bind:value={status} disabled={false} onChange={apply} />
</div>
```

:::

## FieldWrapper

A bare field component draws only the control. To get the label, required marker, help text, and error message, wrap it in `FieldWrapper`, the same wrapper `<Form>` uses.

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `field` | `FieldSchema` | Used for the label, `required`, `help`, `class`, and `columnSpan`. |
| `id` | `string` | Must match the `id` you give the field component. |
| `columns` | `number` | Column count of the surrounding grid, for `columnSpan`. Use `1` outside a grid. |
| `error` | `string` | Optional error message to show. |
| `labelMode` | `'label' \| 'group' \| 'none'` | `'label'` for single inputs, `'group'` for Radio and CheckboxGroup, `'none'` for Checkbox (it labels itself). |

The field component goes in the default slot (Vue), `children` (React), or the `children` snippet (Svelte).

::: code-group

```vue [Vue]
<script setup lang="ts">
import { ref } from 'vue';
import { FieldWrapper, TextInput, type FieldSchema } from '@erag/inertia-forms-vue';

defineProps<{ nameField: FieldSchema; errors: Record<string, string> }>();
const name = ref('');
</script>

<template>
    <FieldWrapper :field="nameField" id="name" :columns="1" :error="errors.name" label-mode="label">
        <TextInput
            v-model="name"
            :field="nameField"
            id="name"
            :error="errors.name"
            :describedBy="errors.name ? 'name-error' : undefined"
            :disabled="false"
        />
    </FieldWrapper>
</template>
```

```tsx [React]
import { useState } from 'react';
import { FieldWrapper, TextInput, type FieldSchema } from '@erag/inertia-forms-react';

export function NameInput({ nameField, errors }: { nameField: FieldSchema; errors: Record<string, string> }) {
    const [name, setName] = useState('');

    return (
        <FieldWrapper field={nameField} id="name" columns={1} error={errors.name} labelMode="label">
            <TextInput
                field={nameField}
                id="name"
                value={name}
                error={errors.name}
                describedBy={errors.name ? 'name-error' : undefined}
                disabled={false}
                onChange={(value) => setName(String(value))}
            />
        </FieldWrapper>
    );
}
```

```svelte [Svelte]
<script lang="ts">
    import { FieldWrapper, TextInput, type FieldSchema } from '@erag/inertia-forms-svelte';

    let { nameField, errors }: { nameField: FieldSchema; errors: Record<string, string> } = $props();
    let name = $state('');
</script>

<FieldWrapper field={nameField} id="name" columns={1} error={errors.name} labelMode="label">
    <TextInput
        field={nameField}
        id="name"
        bind:value={name}
        error={errors.name}
        describedBy={errors.name ? 'name-error' : undefined}
        disabled={false}
    />
</FieldWrapper>
```

:::

The wrapper renders the help text with the id `` `${id}-help` `` and the error with `` `${id}-error` ``. Pass those ids as `describedBy` so screen readers announce them.

## Submit button

`SubmitButton` has its own props (`label`, `processingLabel`, `processing`, `disabled`). See [Submit → Standalone use](/fields/submit#standalone-use).
