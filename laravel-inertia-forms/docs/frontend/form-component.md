---
title: 'Form Component & Events'
description: 'Props and events of the Form component in Vue, React, and Svelte: success, error, and finish callbacks, extra content, and custom components.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/frontend/form-component.md
</div>


<div class="doc-category">Frontend</div>

# Form Component & Events

`<Form>` takes the serialized form from Laravel and renders every fieldset and field. It keeps the form state with Inertia's `useForm`, submits to the form's action, and shows validation errors.

```php
return Inertia::render('Profile/Edit', [
    'form' => ProfileForm::make()->bind($request->user()),
]);
```

::: code-group

```vue [Vue]
<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();
</script>

<template>
    <Form :form="form" class="max-w-xl" />
</template>
```

```tsx [React]
import { Form, type FormSchema } from '@erag/inertia-forms-react';

export default function Edit({ form }: { form: FormSchema }) {
    return <Form form={form} className="max-w-xl" />;
}
```

```svelte [Svelte]
<script lang="ts">
    import { Form, type FormSchema } from '@erag/inertia-forms-svelte';

    let { form }: { form: FormSchema } = $props();
</script>

<Form {form} class="max-w-xl" />
```

:::

## Props

| Vue | React | Svelte | Description |
| --- | ----- | ------ | ----------- |
| `form` | `form` | `form` | **Required.** The serialized form (`FormSchema`). |
| `components` | `components` | `components` | Map of component name → component. Adds custom fields or replaces built-in ones. See [Custom Fields](/frontend/custom-fields). |
| `class` | `className` | `class` | Extra classes on the `<form>` element. |
| `accent` | `accent` | `accent` | Accent color, like `"#0f766e"`. Overrides `Form::accent()` from PHP. See [Accent color](#accent-color). |
| `:on-before-submit` | `onBeforeSubmit` | `onBeforeSubmit` | Function called before the request is sent. Return `false` to cancel. See [Before submit](#before-submit). |
| default slot | `children` | `children` snippet | Content rendered after the fields and before the default submit button. It can read the form state (`isDirty`, `processing`). See [Children](#children). |

## Events

| Vue | React / Svelte | Payload | When |
| --- | -------------- | ------- | ---- |
| `@success` | `onSuccess` | the Inertia `page` | The request succeeded without validation errors. |
| `@error` | `onError` | `FormErrors` (field name → message) | Laravel returned validation errors. |
| `@finish` | `onFinish` | none | The request finished, with or without errors. |
| `@dirty-change` | `onDirtyChange` | `boolean` | The form got unsaved changes (`true`) or lost them (`false`). See [Unsaved changes](#unsaved-changes). |

::: code-group

```vue [Vue]
<script setup lang="ts">
import { Form, type FormErrors, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();

function saved() {
    alert('Saved!');
}

function failed(errors: FormErrors) {
    console.log(Object.keys(errors).length, 'errors');
}
</script>

<template>
    <Form :form="form" @success="saved" @error="failed" @finish="() => console.log('done')" />
</template>
```

```tsx [React]
import { Form, type FormErrors, type FormSchema } from '@erag/inertia-forms-react';

export default function Edit({ form }: { form: FormSchema }) {
    return (
        <Form
            form={form}
            onSuccess={() => alert('Saved!')}
            onError={(errors: FormErrors) => console.log(Object.keys(errors).length, 'errors')}
            onFinish={() => console.log('done')}
        />
    );
}
```

```svelte [Svelte]
<script lang="ts">
    import { Form, type FormErrors, type FormSchema } from '@erag/inertia-forms-svelte';

    let { form }: { form: FormSchema } = $props();
</script>

<Form
    {form}
    onSuccess={() => alert('Saved!')}
    onError={(errors: FormErrors) => console.log(Object.keys(errors).length, 'errors')}
    onFinish={() => console.log('done')}
/>
```

:::

## Before submit

`onBeforeSubmit` runs when the user submits, before anything is sent to Laravel. It receives the current form data and a helper object:

```ts
(data: Record<string, unknown>, helpers: { setErrors(errors: FormErrors): void }) => boolean | void
```

- Return `false` to stop the submit. Return nothing (or `true`) to let it continue.
- `helpers.setErrors({ field: 'message' })` shows messages under fields exactly like server errors, and scrolls to the first one when `scrollToFirstError` is on. It replaces any errors already shown; pass `{}` to clear them all.

Use it for quick checks that don't need the server, a confirmation step, or to take over submission entirely (return `false` and send `data` yourself).

::: code-group

```vue [Vue]
<script setup lang="ts">
import { Form, type BeforeSubmitHelpers, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();

function checkDates(data: Record<string, unknown>, { setErrors }: BeforeSubmitHelpers) {
    const stay = data.stay as { start: string; end: string };

    if (stay.start && stay.start === stay.end) {
        setErrors({ stay: 'Pick at least one night.' });
        return false;
    }
}
</script>

<template>
    <Form :form="form" :on-before-submit="checkDates" />
</template>
```

```tsx [React]
import { Form, type FormSchema } from '@erag/inertia-forms-react';

export default function Book({ form }: { form: FormSchema }) {
    return (
        <Form
            form={form}
            onBeforeSubmit={(data, { setErrors }) => {
                const stay = data.stay as { start: string; end: string };

                if (stay.start && stay.start === stay.end) {
                    setErrors({ stay: 'Pick at least one night.' });
                    return false;
                }
            }}
        />
    );
}
```

```svelte [Svelte]
<script lang="ts">
    import { Form, type BeforeSubmitHelpers, type FormSchema } from '@erag/inertia-forms-svelte';

    let { form }: { form: FormSchema } = $props();

    function checkDates(data: Record<string, unknown>, { setErrors }: BeforeSubmitHelpers) {
        const stay = data.stay as { start: string; end: string };

        if (stay.start && stay.start === stay.end) {
            setErrors({ stay: 'Pick at least one night.' });
            return false;
        }
    }
</script>

<Form {form} onBeforeSubmit={checkDates} />
```

:::

In Vue, `@before-submit="checkDates"` works too, because Vue passes `@before-submit` to the `onBeforeSubmit` prop. The server still validates everything when the request goes through, so client checks are a convenience, not a replacement for the rules in PHP.

## Accent color

Buttons, focus rings, checked states, calendar selections, and chips use one accent color (indigo by default). Set it per form in PHP with [`accent()`](/concepts/form-class#form-options), or pass the `accent` prop. The prop wins when both are set.

::: code-group

```vue [Vue]
<Form :form="form" accent="#0f766e" />
```

```tsx [React]
<Form form={form} accent="#0f766e" />
```

```svelte [Svelte]
<Form {form} accent="#0f766e" />
```

:::

Any CSS color works, for example `#e11d48`, `rgb(2 132 199)`, or `var(--brand)`. See [Styling → Accent color](/frontend/styling#accent-color) for the CSS variable behind it.

## Children

Anything you put inside `<Form>` renders after the fields. Use it for extra links, notes, or a cancel button.

::: code-group

```vue [Vue]
<template>
    <Form :form="form">
        <p class="text-sm text-zinc-500">
            By signing up you accept our <a href="/terms" class="underline">terms</a>.
        </p>
    </Form>
</template>
```

```tsx [React]
<Form form={form}>
    <p className="text-sm text-zinc-500">
        By signing up you accept our <a href="/terms" className="underline">terms</a>.
    </p>
</Form>
```

```svelte [Svelte]
<Form {form}>
    <p class="text-sm text-zinc-500">
        By signing up you accept our <a href="/terms" class="underline">terms</a>.
    </p>
</Form>
```

:::

If the form has no [Submit](/fields/submit) field, a default "Submit" button is added after the children.

The children also receive the form state, `{ isDirty, processing }`, through a scoped slot (Vue), a render function (React), or snippet arguments (Svelte):

::: code-group

```vue [Vue]
<template>
    <Form :form="form" v-slot="{ isDirty }">
        <p v-if="isDirty" class="text-sm text-amber-600">You have unsaved changes.</p>
    </Form>
</template>
```

```tsx [React]
<Form form={form}>
    {({ isDirty }) => isDirty && <p className="text-sm text-amber-600">You have unsaved changes.</p>}
</Form>
```

```svelte [Svelte]
<Form {form}>
    {#snippet children({ isDirty })}
        {#if isDirty}
            <p class="text-sm text-amber-600">You have unsaved changes.</p>
        {/if}
    {/snippet}
</Form>
```

:::

## Unsaved changes

The form is **dirty** (`isDirty` is `true`) when any value differs from what it started with. Changing a value back makes it clean again. After a successful submit, the saved values become the new starting point, so the form is clean again (and with `resetOnSuccess` it goes back to its initial values).

There are four ways to use it:

- **Submit button:** `Submit::make('Save changes')->disableUntilDirty()` keeps the button disabled until something changes. See [Submit](/fields/submit#disableuntildirty-bool-disable-true).
- **Children:** read `isDirty` from the [children](#children), as shown above.
- **Event:** `@dirty-change` / `onDirtyChange` runs each time the state flips.
- **Styling:** the `<form>` gets a `data-dirty` attribute while it is dirty, so you can style it with Tailwind, for example `class="data-dirty:ring-2 data-dirty:ring-amber-300"`.

Custom fields can read it too, from `useFormContext()?.isDirty` (Vue and React) or `getFormContext()?.isDirty` (Svelte).

For example, warn before the user closes the tab with unsaved changes:

::: code-group

```vue [Vue]
<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';
import { onBeforeUnmount, onMounted } from 'vue';

defineProps<{ form: FormSchema }>();

let dirty = false;
const warn = (event: BeforeUnloadEvent) => dirty && event.preventDefault();

onMounted(() => window.addEventListener('beforeunload', warn));
onBeforeUnmount(() => window.removeEventListener('beforeunload', warn));
</script>

<template>
    <Form :form="form" @dirty-change="(isDirty) => (dirty = isDirty)" />
</template>
```

```tsx [React]
import { Form, type FormSchema } from '@erag/inertia-forms-react';
import { useEffect, useState } from 'react';

export default function EditProfile({ form }: { form: FormSchema }) {
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        if (!dirty) return;
        const warn = (event: BeforeUnloadEvent) => event.preventDefault();
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty]);

    return <Form form={form} onDirtyChange={setDirty} />;
}
```

```svelte [Svelte]
<script lang="ts">
    import { Form, type FormSchema } from '@erag/inertia-forms-svelte';

    let { form }: { form: FormSchema } = $props();
    let dirty = $state(false);
</script>

<svelte:window onbeforeunload={(event) => dirty && event.preventDefault()} />

<Form {form} onDirtyChange={(isDirty) => (dirty = isDirty)} />
```

:::

## What `<Form>` does for you

**State.** The initial values come from `form.data`. Each field reads and writes its value by name; dot names like `address.city` update nested data.

**Visibility.** [Conditions](/concepts/visibility) are checked on every change. Hidden fields and fieldsets are not rendered. Fields with `clearWhenHidden()` are reset to their empty value when they disappear.

**Submitting.** On submit, `<Form>` first calls `onBeforeSubmit` (if given) and stops when it returns `false`. Then it sends the data with Inertia to `form.action` using `form.method`. The scroll position is preserved. If `action` is `null` (for example an [unauthorized](/concepts/authorization) form), submitting does nothing.

**Files.** When `form.hasFiles` is `true`, the data is sent as `FormData`. For `put`/`patch`/`delete` it sends a `POST` with a `_method` override. See [File Upload](/fields/file-upload#how-files-are-sent).

**Processing.** While the request runs, the submit button is disabled and shows a spinner (and the `processingLabel`, if set).

**Errors.** Each field shows its first error message under the control and gets `aria-invalid="true"`. Errors for array items, like `tags.1`, appear under the parent field. Changing a field clears its error.

**Scroll to error.** When `scrollToFirstError` is on (the default), the first invalid field is scrolled into view and focused after a failed submit.

**Dirty state.** `<Form>` tracks whether any value changed since the start or the last successful submit. See [Unsaved changes](#unsaved-changes).

**Reset.** When `resetOnSuccess` is on, the data is reset to its initial values after a successful submit.

**Steps.** When the form is a [wizard](/concepts/wizard), `<Form>` shows one fieldset at a time with a stepper and Back / Continue buttons, and checks each step on the server before moving on.

## Accessibility

- Each input has a `<label>` linked by `id`. Radio and checkbox groups use `role="radiogroup"`/`role="group"` with `aria-labelledby`.
- Help text and errors are connected with `aria-describedby`. Errors use `role="alert"`.
- Required fields show a `*` that is hidden from screen readers; the input itself carries `required`.
- The form uses `novalidate`, so browser popups don't compete with Laravel's messages.
- Field ids are unique per form, so two forms on one page don't clash.

## TypeScript types

Each package exports the schema types, so page props are typed:

```ts
import type {
    FormSchema,        // the whole form
    FieldsetSchema,    // one fieldset
    FieldSchema,       // one field
    FieldOption,       // { value, label, description, disabled }
    FormErrors,        // Record<string, string>
    VisibilityCondition,
    FieldComponentProps,
    FormProps,
    BeforeSubmitHelpers, // { setErrors(errors) }
    FormState,           // { isDirty, processing }, passed to the children
    DateRangeValue,      // { start, end } for DatePicker::range()
} from '@erag/inertia-forms-react'; // or -vue / -svelte
```
