---
title: Laravel Translations in Inertia Vue 3
description: Use Laravel Lang Sync Inertia helpers in Inertia Vue 3 pages and components for translation keys, replacements, pluralization, and locale-aware text.
head:
    - [
          'meta',
          {
              name: 'keywords',
              content: 'Laravel translations Inertia Vue 3, Vue Laravel i18n, Vue lang helper, trans helper Vue, Laravel localization Vue',
          },
      ]
---

# Vue

Use the Vue entry point to access Laravel translations inside Inertia Vue 3 pages and components.

The package reads translations from `page.props.lang`, then gives you these helpers:

- `__()` for simple lookups
- `trans()` for placeholder replacement
- `transChoice()` and `trans_choice()` for pluralization

## Import the helper

```ts
import { lang } from '@erag/lang-sync-inertia/vue';

const { trans, __, transChoice } = lang();
```

## Full example

::: code-group

```php [DashboardController.php]
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        syncLangFiles('auth');

        return Inertia::render('Dashboard');
    }
}
```

```php [lang/en/auth.php]
return [
    'greeting' => 'Hello!',
    'welcome' => 'Welcome, :name!',
    'apples' => 'There is one apple|There are :count apples',
];
```

```vue [js/Pages/Dashboard.vue]
<script setup>
import { lang } from '@erag/lang-sync-inertia/vue';

const { trans, __, transChoice } = lang();
</script>

<template>
    <section>
        <h1>{{ __('auth.greeting') }}</h1>
        <p>{{ trans('auth.welcome', { name: 'John' }) }}</p>
        <p>{{ transChoice('auth.apples', 3) }}</p>
    </section>
</template>
```

```text [Output]
Hello!
Welcome, John!
There are 3 apples
```

:::

## Component example

```vue
<script setup lang="ts">
import { lang } from '@erag/lang-sync-inertia/vue';

const { trans, __, transChoice } = lang();
</script>

<template>
    <h1>{{ __('auth.greeting') }}</h1>
    <p>{{ trans('auth.welcome', { name: 'Amit' }) }}</p>
    <p>{{ transChoice('auth.apples', 1) }}</p>
</template>
```

## How it works

1. Laravel loads `lang/{locale}/auth.php` with `syncLangFiles('auth')`.
2. Inertia shares that data under `page.props.lang`.
3. `lang()` reads from those props inside your Vue component.
4. Keys like `auth.greeting` and `auth.welcome` resolve automatically.

## `trans()` vs `__()`

| Function  | Best for       | Description                                |
| --------- | -------------- | ------------------------------------------ |
| `trans()` | Dynamic values | Use when passing placeholders like `:name` |
| `__()`    | Simple lookups | Shortcut for quick string access           |

```ts
__('auth.greeting');
// Hello!

trans('auth.welcome', { name: 'Amit' });
// Welcome, Amit!
```

All frontend helpers support placeholder replacement, but `trans()` is the clearer choice when replacements are always present.

## Pluralization

Use `transChoice()` or the Laravel-style `trans_choice()` alias for plural strings.

```ts
transChoice('auth.apples', 1);
// There is one apple

transChoice('auth.apples', 5);
// There are 5 apples

trans_choice('No items|:count items', 0);
// 0 items
```

Laravel-style exact and interval choices are supported:

```php
'notifications' => '{0} No notifications|{1} One notification|[2,*] :count notifications',
```

## Laravel Key Examples

File: `lang/en/messages.php`

```php
<?php

return [
    'greeting' => [
        'name' => 'Welcome, :name',
        'welcome_with_message' => 'Welcome, :name. :message',
        'legacy_welcome' => 'Welcome, {name}',
    ],

    'fruit' => [
        'apples' => '{0} No apples available|{1} One apple available|[2,*] :count apples available',
    ],

    'time' => [
        'minutes_ago' => '{1} :value minute ago|[2,*] :value minutes ago',
    ],
];
```

```php
syncLangFiles('messages');
```

```ts
const { __, trans, transChoice, trans_choice } = lang();
```

### Frontend calls

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

```ts
__('I love programming.');
```

```text
I love programming.
```

## Placeholder replacements

Always pass an object when you want `:name` or `{name}` style placeholders replaced:

```ts
trans('auth.welcome', { name: 'Amit' });
__('auth.welcome', { name: 'Amit' });
```

Use `:name` for new translation strings. `{name}` is still supported for existing language files.

If you pass a plain string instead:

```ts
__('auth.welcome', 'Amit');
```

The placeholder is not replaced.

## Access raw Inertia props

If you need the full translation object directly in Vue:

```ts
import { usePage } from '@inertiajs/vue3';

const { lang } = usePage().props;
```

## Legacy API

The older Vue helper still works:

```ts
import { vueLang } from '@erag/lang-sync-inertia';

const { trans, __ } = vueLang();
```

Use `@erag/lang-sync-inertia/vue` for new code.
