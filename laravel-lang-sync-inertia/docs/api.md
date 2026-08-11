---
title: Laravel Lang Sync Inertia API Helpers
description: Reference syncLangFiles(), __(), trans(), and transChoice() for sharing Laravel translations with Inertia Vue, React, and Svelte apps.
head:
    - [
          'meta',
          {
              name: 'keywords',
              content: 'Laravel Lang Sync Inertia API, syncLangFiles helper, Laravel trans helper, Inertia translation API, transChoice',
          },
      ]
---

# API Helpers

This package exposes one Laravel helper and frontend translation helpers for lookups, replacements, and pluralization.

## `syncLangFiles()`

`syncLangFiles()` is a global Laravel helper provided by this package. Call it inside any controller method to load translation files and share them with your frontend via Inertia.

Think of `syncLangFiles()` as a bridge between your Laravel language files and your Inertia responses.

Single file:

```text
syncLangFiles('auth')
```

Multiple files:

```text
syncLangFiles(['auth', 'validation', 'pagination'])
```

Nested language directories:

```text
syncLangFiles('admin.auth')
```

This loads `lang/{locale}/admin/auth.php`, shares it as `page.props.lang.admin.auth`, and resolves with keys like `__('admin.auth.name')`.

## Full flow

::: code-group

```ts [Helper usage]
__('auth.greeting');
trans('auth.welcome', { name: 'Amit' });
```

```text [Flow]
Controller -> syncLangFiles('auth')
Laravel -> lang/{locale}/auth.php
Inertia -> page.props.lang.auth
Frontend -> __('auth.greeting')
Output -> Hello!
```

:::

## How it works

When you call `syncLangFiles('auth')` in your controller:

1. Laravel reads `lang/{locale}/auth.php` based on `App::getLocale()`.
2. The translation array is passed to Inertia as a shared prop under `page.props.lang`.
3. The frontend helper reads from `page.props.lang` and resolves keys like `auth.greeting`.
4. Placeholders like `:name` and `{name}` are replaced at runtime with the values you pass.

When you call `syncLangFiles('admin.auth')`, the same flow reads `lang/{locale}/admin/auth.php` and frontend helpers resolve the full nested key path, such as `admin.auth.name`.

## `__(key, replaces?)`

Use `__()` for direct translation lookups.

```ts
__('auth.greeting');
// "Hello!"

__('auth.welcome', { name: 'Amit' });
// "Welcome, Amit!"
```

## `trans(key, replaces)`

Use `trans()` when placeholders are expected.

```ts
trans('auth.welcome', { name: 'Amit' });
// "Welcome, Amit!"
```

## `transChoice(key, count, replaces?)`

Use `transChoice()` for pluralized translation strings. The Laravel-style `trans_choice()` alias is also available.

Assume these synced keys are available:

| Key                  | Translation value                                                        |
| -------------------- | ------------------------------------------------------------------------ |
| `auth.apples`        | `There is one apple\|There are :count apples`                            |
| `auth.notifications` | `{0} No notifications\|{1} One notification\|[2,*] :count notifications` |

```ts
transChoice('auth.apples', 1);
// "There is one apple"

transChoice('auth.apples', 5);
// "There are 5 apples"

trans_choice('auth.notifications', 0);
// "No notifications"

trans_choice('auth.notifications', 3);
// "3 notifications"
```

## `trans()` vs `__()`

| Helper                             | Best use                  | Notes                                                     |
| ---------------------------------- | ------------------------- | --------------------------------------------------------- |
| `__()`                             | Simple lookup             | Great for direct string access and optional replacements  |
| `trans()`                          | Placeholder-based strings | Clearer when replacement values are always required       |
| `transChoice()` / `trans_choice()` | Pluralized strings        | Chooses the correct segment by count and injects `:count` |

All frontend helpers support placeholder replacement, but `trans()` is the clearer choice when replacements are always present.

## Frontend Helper Examples

Use synced Laravel keys through the Vue, React, or Svelte helpers.

```ts
const { __, trans, transChoice, trans_choice } = lang();
```

Assume these synced keys are available:

| Key                                      | Translation value                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| `messages.greeting.name`                 | `Welcome, :name`                                                                  |
| `messages.greeting.welcome_with_message` | `Welcome, :name. :message`                                                        |
| `messages.greeting.legacy_welcome`       | `Welcome, {name}`                                                                 |
| `messages.fruit.apples`                  | `{0} No apples available\|{1} One apple available\|[2,*] :count apples available` |
| `messages.time.minutes_ago`              | `{1} :value minute ago\|[2,*] :value minutes ago`                                 |

### Calls

```ts
__('messages.greeting.name', { name: 'dayle' });

trans('messages.greeting.welcome_with_message', {
    name: 'dayle',
    message: 'Good to see you',
});

trans('messages.greeting.legacy_welcome', { name: 'Taylor' });

transChoice('messages.fruit.apples', 18);

trans_choice('messages.time.minutes_ago', 5);
```

### Output

```text
Welcome, dayle
Welcome, dayle. Good to see you
Welcome, Taylor
18 apples available
5 minutes ago
```

### Missing key fallback

If no Laravel translation key is found, the original key is returned unchanged.

```ts
__('I love programming.');
```

```text
I love programming.
```

## Placeholder replacement

Assume these synced keys are available:

| Key                   | Translation value  |
| --------------------- | ------------------ |
| `auth.welcome`        | `Welcome, :name!`  |
| `auth.legacy_welcome` | `Welcome, {name}!` |

This is correct:

```ts
trans('auth.welcome', { name: 'Amit' });
__('auth.welcome', { name: 'Amit' });
__('auth.legacy_welcome', { name: 'Amit' });
```

`{name}` placeholders are supported for older projects, but `:name` is the recommended style for new language lines because it matches Laravel's native placeholder format.

If you pass a plain string instead:

```ts
__('auth.welcome', 'Amit');
```

The placeholder is not replaced.

Use an object whenever placeholder replacement is needed.

## Access raw Inertia props

If you need the full translation object directly:

```ts
import { usePage } from '@inertiajs/vue3';

const { lang } = usePage().props;
```

```tsx
import { usePage } from '@inertiajs/react';

const { lang } = usePage().props;
```

```ts
import { page } from '@inertiajs/svelte';

const lang = $derived(page.props.lang);
```

## TypeScript types

```ts
type Replaces = Record<string, string | number>;
type LangValue = string | { [key: string]: string | LangValue };
type LangObject = Record<string, LangValue>;
```
