---
title: 'Frontend Setup'
description: 'Call setTranslations() once in your Vue, React or Svelte entry file, merge and reset translations, and override a single label from PHP.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/translations/frontend.md
</div>


<div class="doc-category">Translations</div>

# Frontend Setup

The text the components render in the browser (buttons, placeholders, empty states, screen reader labels) is translated with `setTranslations()`. Vue, React and Svelte share the same API.

## Set them once in the app entry

Call `setTranslations()` in your app entry, before `createInertiaApp()`, so the first page already renders in your language. It is exported by all three packages:

::: code-group

```ts [Vue]
// resources/js/app.ts
import { createInertiaApp } from '@inertiajs/vue3';
import { setTranslations } from '@erag/inertia-forms-vue';

setTranslations({
    action_clear: 'Wissen',
    action_remove: 'Verwijderen',
    form_submit: 'Versturen',
    option_placeholder: 'Kies een optie',
    option_no_results: 'Geen resultaten',
    file_upload_click_to_upload: 'Klik om te uploaden',
    file_upload_drop_prompt: ':action of sleep bestanden hierheen',
    date_placeholder: 'Kies een datum',
    date_today: 'Vandaag',
    repeater_add: ':Name toevoegen',
    blocks_add: 'Blok toevoegen',
    composer_send: 'Verzenden',
    wizard_next: 'Doorgaan',
    wizard_back: 'Terug',
    wizard_progress: 'Stap :current van :total',
});

createInertiaApp({
    // ...your existing setup
});
```

```tsx [React]
// resources/js/app.tsx
import { createInertiaApp } from '@inertiajs/react';
import { setTranslations } from '@erag/inertia-forms-react';

setTranslations({
    action_clear: 'Wissen',
    action_remove: 'Verwijderen',
    form_submit: 'Versturen',
    option_placeholder: 'Kies een optie',
    option_no_results: 'Geen resultaten',
    file_upload_click_to_upload: 'Klik om te uploaden',
    file_upload_drop_prompt: ':action of sleep bestanden hierheen',
    date_placeholder: 'Kies een datum',
    date_today: 'Vandaag',
    repeater_add: ':Name toevoegen',
    blocks_add: 'Blok toevoegen',
    composer_send: 'Verzenden',
    wizard_next: 'Doorgaan',
    wizard_back: 'Terug',
    wizard_progress: 'Stap :current van :total',
});

createInertiaApp({
    // ...your existing setup
});
```

```ts [Svelte]
// resources/js/app.ts
import { createInertiaApp } from '@inertiajs/svelte';
import { setTranslations } from '@erag/inertia-forms-svelte';

setTranslations({
    action_clear: 'Wissen',
    action_remove: 'Verwijderen',
    form_submit: 'Versturen',
    option_placeholder: 'Kies een optie',
    option_no_results: 'Geen resultaten',
    file_upload_click_to_upload: 'Klik om te uploaden',
    file_upload_drop_prompt: ':action of sleep bestanden hierheen',
    date_placeholder: 'Kies een datum',
    date_today: 'Vandaag',
    repeater_add: ':Name toevoegen',
    blocks_add: 'Blok toevoegen',
    composer_send: 'Verzenden',
    wizard_next: 'Doorgaan',
    wizard_back: 'Terug',
    wizard_progress: 'Stap :current van :total',
});

createInertiaApp({
    // ...your existing setup
});
```

:::

For a full language, keep the strings in their own file and import it. The [Dutch starter file](/translations/dutch-starter) has all keys:

```ts
import nl from './lang/inertia-forms/nl';

setTranslations(nl);
```

## Merging and calling it again

`setTranslations()` merges what you pass over what is already set. Keys you leave out keep their current text, which starts as the English default. You can call it as often as you like: every rendered form updates right away, without a reload or remount.

```ts
setTranslations({ action_clear: 'Wissen' });
setTranslations({ date_today: 'Vandaag' });
// Both are now Dutch; everything else is still English.
```

A key with no translation falls back to the English default, then to the key name itself. Values that are not a string or a function are ignored.


## Reset and read the current text

```ts
import { getTranslations, resetTranslations } from '@erag/inertia-forms-vue'; // or -react / -svelte

resetTranslations(); // back to the English defaults; rendered forms update

const current = getTranslations(); // defaults merged with everything set so far
current.wizard_next; // 'Doorgaan'
```

`getTranslations()` returns a copy, so changing it does nothing. Use `defaultTranslations` when you need the original English.


## Overriding a single label from PHP

A few buttons get their text from PHP when you set it, and from a frontend key when you don't. A PHP value always wins, so use it for a one-off label and translate it with `__()`:

| Text | PHP method | Frontend key when not set |
| ---- | ---------- | ------------------------- |
| Wizard Continue / Back | `wizard(nextLabel: ..., backLabel: ...)` | `wizard_next`, `wizard_back` |
| Repeater add button | `addActionLabel()` | `repeater_add` |
| Blocks add button | `addActionLabel()` | `blocks_add` |
| Key Value add button | `addActionLabel()` | `key_value_add` |
| Key Value column headings | `keyLabel()`, `valueLabel()` | `key_value_key`, `key_value_value` |
| Composer Send button | `sendLabel()` | `composer_send` |

```php
class OnboardingForm extends Form
{
    protected bool $wizard = true;

    public function __construct()
    {
        $this->wizard(nextLabel: __('onboarding.next'), backLabel: __('onboarding.back'));
    }

    public function fields(): array
    {
        return [
            Repeater::make('contacts')
                ->itemLabel(__('onboarding.contact'))
                ->addActionLabel(__('onboarding.add_contact')),
            KeyValue::make('headers')
                ->keyLabel(__('onboarding.header'))
                ->valueLabel(__('onboarding.value'))
                ->addActionLabel(__('onboarding.add_header')),
            Composer::make('message')->sendLabel(__('onboarding.post')),
        ];
    }
}
```

Without these calls, PHP sends `null` and the browser shows the translated key. So you don't need them just to translate: `setTranslations()` already covers every form.
