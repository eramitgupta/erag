---
title: Svelte
description: Use Laravel Lang Sync Inertia translations in Inertia Svelte 5 pages and components.
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

# Svelte

Use the Svelte entry point to access Laravel translations inside Inertia Svelte 5 pages and components.

::: info Requirements
Requires `@inertiajs/svelte` v3 and Svelte 5. The helper reads from the reactive `page` state exposed by `@inertiajs/svelte`.
:::

The package reads translations from `page.props.lang`, then gives you these helpers:

- `__()` for simple lookups
- `trans()` for placeholder replacement
- `transChoice()` and `trans_choice()` for pluralization

## Import the helper

```ts
import { svelteLang } from '@erag/lang-sync-inertia';

const { trans, __, transChoice } = svelteLang();
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

```svelte [js/Pages/Dashboard.svelte]
<script module lang="ts">
import { svelteLang } from '@erag/lang-sync-inertia';

const { trans, __, transChoice } = svelteLang();
</script>

<section>
    <h1>{__('auth.greeting')}</h1>
    <p>{trans('auth.welcome', { name: 'John' })}</p>
    <p>{transChoice('auth.apples', 3)}</p>
</section>
```

```text [Output]
Hello!
Welcome, John!
There are 3 apples
```

:::

## Component example

```svelte
<script module lang="ts">
import { svelteLang } from '@erag/lang-sync-inertia';

const { trans, __, transChoice } = svelteLang();
</script>

<h1>{__('auth.greeting')}</h1>
<p>{trans('auth.welcome', { name: 'Amit' })}</p>
<p>{transChoice('auth.apples', 1)}</p>
```

## How it works

1. Laravel loads `lang/{locale}/auth.php` with `syncLangFiles('auth')`.
2. Inertia shares that data under `page.props.lang`.
3. `svelteLang()` reads from those props via the reactive `page` state from `@inertiajs/svelte`.
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
const { __, trans, transChoice, trans_choice } = svelteLang();
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

## Reactive usage

Because `svelteLang()` reads from the `page` reactive state at call time, helpers work correctly inside Svelte 5 `$derived` expressions:

```svelte
<script lang="ts">
import { svelteLang } from '@erag/lang-sync-inertia';

const { __ } = svelteLang();

const greeting = $derived(__('auth.greeting'));
</script>

<h1>{greeting}</h1>
```

## Access raw Inertia props

If you need the full translation object directly in Svelte:

```ts
import { page } from '@inertiajs/svelte';

const lang = $derived(page.props.lang);
```

## Package-root API

Import the Svelte helper from the package root:

```ts
import { svelteLang } from '@erag/lang-sync-inertia';

const { trans, __ } = svelteLang();
```
