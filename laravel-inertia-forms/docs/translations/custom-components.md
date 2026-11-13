---
title: 'Custom Components'
description: 'Use useTranslate() and translate() in your own field components, and type your translation files with TypeScript.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/translations/custom-components.md
</div>


<div class="doc-category">Translations</div>

# Custom Components

Your own field components can use the same translations, so a language switch updates them too.

A [custom field](/frontend/custom-fields) can use the same strings, so it matches the built-in fields in every language. `useTranslate()` returns the `translate` function and re-renders the component when the translations change:

::: code-group

```vue [Vue]
<!-- resources/js/components/Rating.vue -->
<script setup lang="ts">
import { useTranslate, type FieldComponentProps } from '@erag/inertia-forms-vue';

defineProps<FieldComponentProps>();
const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>();
const t = useTranslate();
</script>

<template>
    <button type="button" :disabled="disabled" @click="emit('update:modelValue', null)">
        {{ t('action_clear_field', { label: field.label }) }}
    </button>
</template>
```

```tsx [React]
// resources/js/components/Rating.tsx
import { useTranslate, type FieldComponentProps } from '@erag/inertia-forms-react';

export function Rating({ field, disabled, onChange }: FieldComponentProps) {
    const t = useTranslate();

    return (
        <button type="button" disabled={disabled} onClick={() => onChange(null)}>
            {t('action_clear_field', { label: field.label })}
        </button>
    );
}
```

```svelte [Svelte]
<!-- resources/js/components/Rating.svelte -->
<script lang="ts">
    import { useTranslate, type FieldComponentProps } from '@erag/inertia-forms-svelte';

    let { field, disabled, onChange }: FieldComponentProps = $props();
    const t = useTranslate();
</script>

<button type="button" {disabled} onclick={() => onChange?.(null)}>
    {t('action_clear_field', { label: field.label })}
</button>
```

:::

- **Vue:** call `t()` in the template or inside a `computed`. A value read once in `<script setup>` does not update.
- **Svelte:** call `t()` in the markup or inside `$derived`.
- **React:** call `useTranslate()` in every component that renders translated text.

The reserved keys `action_add`, `action_cancel`, `action_close`, `action_copy`, `action_delete` and `action_done` are not used by any built-in component. They are there so your own components can share the same words.

Outside components (a toast, a plain helper, a store), import `translate()` itself. It returns the current text but does not re-render anything:

```ts
import { translate } from '@erag/inertia-forms-vue'; // or -react / -svelte

showToast(translate('action_copied'));
```

To react to changes outside a component, `subscribeTranslations(listener)` calls `listener` after every `setTranslations()` or `resetTranslations()` and returns an unsubscribe function. `translationsVersion()` returns a counter that goes up on each change, for `useSyncExternalStore` or your own store.


## TypeScript

All types are exported from each package:

| Type | What it is |
| ---- | ---------- |
| `TranslationKey` | Union of every key name. `translate()` and `t()` autocomplete it. |
| `Translations` | `Partial<Record<TranslationKey, TranslationValue>>`, the argument of `setTranslations()`. |
| `TranslationValue` | `string \| ((params: TranslationParams) => string)` |
| `TranslationParams` | `Record<string, string \| number>` |
| `TranslationPart` | `string \| { slot: string }`, what `translateParts()` returns. |

Type a locale file with `satisfies Translations`. A misspelled key is an error, and the file keeps its exact type:

```ts
// resources/js/lang/inertia-forms/nl.ts
import type { Translations } from '@erag/inertia-forms-vue'; // or -react / -svelte

export default {
    action_clear: 'Wissen',
    wizard_next: 'Doorgaan',
    // wizard_nxt: 'Doorgaan', ← error: not a known key
} satisfies Translations;
```

To make TypeScript tell you when a full locale file is missing a key (for example after a package update adds one), check it against every key instead:

```ts
import type { TranslationKey, TranslationValue } from '@erag/inertia-forms-vue';

export default {
    // ...all keys
} satisfies Record<TranslationKey, TranslationValue>;
```
