---
title: Laravel
description: Laravel-side usage of syncLangFiles() with controller examples and locale-based loading.
head:
    - [
          'meta',
          {
              name: 'keywords',
              content: 'Laravel Lang Sync Inertia Laravel guide, syncLangFiles Laravel, Inertia controller translations, Laravel localization example',
          },
      ]
---

# Laravel

Use `syncLangFiles()` inside any controller action that returns an Inertia response.

`syncLangFiles()` is a global Laravel helper from this package. It reads your backend language files and shares them with Inertia automatically, so you do not have to pass translation props manually in every response.

Think of `syncLangFiles()` as a bridge between your Laravel language files and your Inertia responses.

## Single file

```php
syncLangFiles('auth');
```

## Multiple files

```php
syncLangFiles(['auth', 'validation', 'pagination']);
```

## Dashboard example

```php
syncLangFiles('messages');

return Inertia::render('Dashboard');
```

## Full example

::: code-group

```php
<?php

// app/Http/Controllers/DashboardController.php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        syncLangFiles('messages');

        return Inertia::render('Dashboard');
    }
}
```

```php [lang/en/messages.php]
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

```vue [js/Pages/Dashboard.vue]
<script setup>
import { lang } from '@erag/lang-sync-inertia/vue';

const { __, trans, transChoice, trans_choice } = lang();
</script>

<template>
    <section>
        <p>{{ __('messages.greeting.name', { name: 'dayle' }) }}</p>
        <p>
            {{
                trans('messages.greeting.welcome_with_message', {
                    name: 'dayle',
                    message: 'Good to see you',
                })
            }}
        </p>
        <p>
            {{ trans('messages.greeting.legacy_welcome', { name: 'Taylor' }) }}
        </p>
        <p>{{ transChoice('messages.fruit.apples', 18) }}</p>
        <p>{{ trans_choice('messages.time.minutes_ago', 5) }}</p>
    </section>
</template>
```

```tsx [js/Pages/Dashboard.tsx]
import { lang } from '@erag/lang-sync-inertia/react';

export default function Dashboard() {
    const { __, trans, transChoice, trans_choice } = lang();

    return (
        <section>
            <p>{__('messages.greeting.name', { name: 'dayle' })}</p>
            <p>
                {trans('messages.greeting.welcome_with_message', {
                    name: 'dayle',
                    message: 'Good to see you',
                })}
            </p>
            <p>
                {trans('messages.greeting.legacy_welcome', { name: 'Taylor' })}
            </p>
            <p>{transChoice('messages.fruit.apples', 18)}</p>
            <p>{trans_choice('messages.time.minutes_ago', 5)}</p>
        </section>
    );
}
```

```text [Flow]
Controller -> syncLangFiles('messages')
Laravel -> lang/{locale}/messages.php
Inertia -> page.props.lang.messages
Frontend -> __('messages.greeting.name', { name: 'dayle' })
Output -> Welcome, dayle
```

:::

This loads `lang/{locale}/messages.php` based on Laravel's current locale and shares it with Inertia automatically.

## Laravel language keys

Use Laravel's placeholder style for new translation lines:

```php
'name' => 'Welcome, :name',
'welcome_with_message' => 'Welcome, :name. :message',
```

The frontend replacement object should use the placeholder names without the `:` prefix:

```ts
__('messages.greeting.name', { name: 'dayle' });

trans('messages.greeting.welcome_with_message', {
    name: 'dayle',
    message: 'Good to see you',
});
```

Output:

```text
Welcome, dayle
Welcome, dayle. Good to see you
```

Legacy `{name}` placeholders are still supported for older language files:

```php
'legacy_welcome' => 'Welcome, {name}',
```

```ts
trans('messages.greeting.legacy_welcome', { name: 'Taylor' });
```

Output:

```text
Welcome, Taylor
```

## Laravel pluralization

Use Laravel-style pluralization strings in your language files:

```php
'apples' => '{0} No apples available|{1} One apple available|[2,*] :count apples available',
'minutes_ago' => '{1} :value minute ago|[2,*] :value minutes ago',
```

Then call the pluralization helpers from Vue or React:

```ts
transChoice('messages.fruit.apples', 18);
trans_choice('messages.time.minutes_ago', 5);
```

Output:

```text
18 apples available
5 minutes ago
```

## Translation string keys

Laravel also supports using the translation string itself as the key. If no synced key is found, the frontend helper returns the original string unchanged:

```ts
__('I love programming.');
```

Output:

```text
I love programming.
```

## How it works

When you call `syncLangFiles('messages')`:

1. Laravel reads `lang/{locale}/messages.php` based on `App::getLocale()`.
2. The package shares that data through Inertia props.
3. Your frontend helper reads from `page.props.lang`.
4. Keys like `messages.greeting.name` resolve automatically.

## Locale-based loading

The package uses Laravel's current locale, so this structure works out of the box:

```text
lang/
├── en/
│   └── messages.php
└── hi/
    └── messages.php
```

If `App::getLocale()` returns `hi`, the package reads `lang/hi/messages.php`.
