---
title: Translate Laravel Pagination in Vue and React
headline: "Translate Laravel Pagination Links and \"Showing 1 to 10 of 50 Results\" in Vue and React"
description: "Laravel pagination translation for Inertia Vue and React: share pagination.php with syncLangFiles() and render Previous, Next and Showing 1 to 10 of 50 results."
date: 2026-10-25
package: laravel-lang-sync-inertia
category: Tutorial
tags: [laravel, inertia, vue, react, translations]
image: /images/laravel-pagination-translation-vue-react.jpg
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-pagination-translation-vue-react.md
</div>

![Laravel pagination links and a Showing results line translated into Spanish in Vue and React](/images/laravel-pagination-translation-vue-react.jpg)

To translate Laravel pagination in an Inertia Vue or React app, share Laravel's `pagination` language file and one file of your own with `syncLangFiles()` from Laravel Lang Sync Inertia, then render Previous, Next and "Showing 1 to 10 of 50 results" with `__()` and `transChoice()` in your pagination component. You use the same `pagination.previous` and `pagination.next` keys as Laravel's Blade pagination view, so the `lang/es/pagination.php` you already have, written by hand or installed from laravel-lang/lang, works in your pages without copying anything into JSON.

Install Laravel Lang Sync Inertia first:

```bash
composer require erag/laravel-lang-sync-inertia
npm install @erag/lang-sync-inertia
php artisan erag:install-lang
```

It has more than 50,000 installs on Packagist, runs on Laravel 8 to 13 and gives you the same helpers in Vue, React and Svelte. This guide uses Laravel 13 and Inertia v3.

## The short version

1. Install the package with the three commands above.
2. Make sure `lang/en/pagination.php` and `lang/es/pagination.php` exist.
3. Add your own `lang/en/listing.php` and `lang/es/listing.php` with a `summary` line that uses `:from`, `:to` and `:total`.
4. Set the locale in a middleware, then call `syncLangFiles(['pagination', 'listing'])` in the controller.
5. In the component, use `vueLang()` or `reactLang()`: `__('pagination.previous')`, `__('pagination.next')` and `transChoice('listing.summary', ...)`.
6. Turn entities like `&laquo;` into plain characters and print the result as text, not HTML.

## Where does Laravel pagination text come from?

From two lines in `lang/{locale}/pagination.php`:

```php
<?php

// lang/es/pagination.php

return [
    'previous' => '&laquo; Anterior',
    'next' => 'Siguiente &raquo;',
];
```

Since Laravel 11, new apps don't have a `lang` folder ([here is why](./laravel-lang-folder-missing.md)). Run `php artisan lang:publish` to get `lang/en/pagination.php`, then add a file for each language, like the Spanish one above. If your language files come from laravel-lang/lang, it's already in place.

Laravel reads these lines in two places. Blade's pagination view calls `__('pagination.previous')`. The paginator also calls it when it builds the `links` array for JSON, so the first and last items in `links` carry the same labels. In an Inertia page you can't call Laravel's `__()`, and the `links` array doesn't exist at all for `simplePaginate()` or `cursorPaginate()`. That's the gap Laravel Lang Sync Inertia fills: it sends the `pagination` group to your page, and you call `__('pagination.previous')` in Vue or React exactly as you would in Blade.

## Share pagination.php with your page using syncLangFiles()

First, the locale. A small middleware sets it for every request:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * @var array<int, string>
     */
    public const SUPPORTED = ['en', 'es'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->session()->get('locale', config('app.locale'));

        App::setLocale(in_array($locale, self::SUPPORTED, true) ? $locale : config('app.locale'));

        return $next($request);
    }
}
```

Register it in the `web` group in `bootstrap/app.php`, before `HandleInertiaRequests`. Keep any other middleware your starter kit already lists there:

```php
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetLocale;

->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [
        SetLocale::class,
        HandleInertiaRequests::class,
    ]);
})
```

It has to be in the `web` group, because global middleware runs before the session starts and can't read the saved language.

Now the controller. One line shares the two groups this page needs:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        syncLangFiles(['pagination', 'listing']);

        $posts = Post::query()
            ->when(
                $request->string('search')->toString(),
                fn ($query, string $search) => $query->where('title', 'like', "%{$search}%"),
            )
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Post $post) => [
                'id' => $post->id,
                'title' => $post->title,
            ]);

        return Inertia::render('posts/Index', [
            'posts' => $posts,
        ]);
    }
}
```

And the route in `routes/web.php`:

```php
use App\Http\Controllers\PostController;

Route::get('posts', [PostController::class, 'index'])->name('posts.index');
```

`syncLangFiles()` reads `lang/{current locale}/pagination.php` and `lang/{current locale}/listing.php` and shares them as the `lang` prop. With Spanish active, the page receives:

```json
{
    "lang": {
        "pagination": {
            "previous": "&laquo; Anterior",
            "next": "Siguiente &raquo;"
        },
        "listing": {
            "summary": "{0} No se encontraron resultados.|[1,*] Mostrando :from al :to de :total resultados",
            "navigation": "Navegación por los enlaces de paginación",
            "go_to_page": "Ir a la página :page"
        }
    }
}
```

Three things make this work well:

- **Only what the page needs.** Your list pages get `pagination` and `listing`. Your settings page doesn't.
- **It reads the locale when you call it.** That's why it sits in the controller, after the middleware. Don't load the same group twice in one request, because the package caches each group by name.
- **Nested folders work too.** If you keep list text in `lang/es/admin/listing.php`, call `syncLangFiles('admin.listing')` and use keys like `admin.listing.summary`.

## Translate "Showing 1 to 10 of 50 results" with transChoice()

Laravel's Blade view builds this sentence from four loose JSON strings: `__('Showing')`, `__('to')`, `__('of')` and `__('results')`. That doesn't suit an Inertia page. Laravel Lang Sync Inertia loads PHP group files, not JSON string files like `lang/es.json`, and four separate words force English word order onto every language. One sentence with placeholders lets each translator put the numbers where they belong.

Create `lang/en/listing.php`:

```php
<?php

return [
    'summary' => '{0} No results found.|{1} Showing 1 result|[2,*] Showing :from to :to of :total results',
    'navigation' => 'Pagination Navigation',
    'go_to_page' => 'Go to page :page',
];
```

And `lang/es/listing.php`. If your language files come from laravel-lang/lang, the Spanish words "Mostrando", "al", "de" and "resultados" are the ones its `lang/es.json` already uses for the Blade view:

```php
<?php

return [
    'summary' => '{0} No se encontraron resultados.|[1,*] Mostrando :from al :to de :total resultados',
    'navigation' => 'Navegación por los enlaces de paginación',
    'go_to_page' => 'Ir a la página :page',
];
```

The numbers come from the paginator: `from`, `to` and `total`. Pass `total` as the count and all three as placeholders:

```ts
transChoice('listing.summary', paginator.total, {
    from: paginator.from ?? 0,
    to: paginator.to ?? 0,
    total: paginator.total,
});
// "Mostrando 11 al 20 de 50 resultados"
```

Write explicit conditions like `{0}`, `{1}` and `[2,*]`. The frontend `transChoice()` doesn't know each language's plural rules: without conditions it uses the first form for 1 and the last form for everything else. Conditions let you decide which text each count gets, and each language can have its own number of forms.

Also watch for empty pages. `from` and `to` are `null` when a page has no rows, for example `?page=99` on 50 posts. The components below pass 0 as the count then, so you see "No results found." instead of a sentence with blanks.

## How do I render `&laquo;` safely in Vue and React?

`__('pagination.previous')` returns `&laquo; Anterior`. Print that as text and the user sees `&laquo;` on screen. You have three options.

**`v-html` or `dangerouslySetInnerHTML`.** It works, but the browser now treats the label as HTML. Translation files are edited by many people, and one bad line with an `<img onerror>` in it becomes a script on your page. eslint-plugin-vue has a `vue/no-v-html` rule that warns about exactly this.

**A string replace for `&laquo;`.** Safe, but it only fixes the entities you thought of. Some language files use the entity, others use the real `«` character.

**Decode entities to plain characters and print text.** Vue and React escape text for you, so even a stray `<` stays harmless. This helper doesn't touch the DOM, so it also works when Inertia renders on the server:

```ts
// resources/js/lib/html-entities.ts
const namedEntities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    laquo: '«',
    raquo: '»',
    lsaquo: '‹',
    rsaquo: '›',
    larr: '←',
    rarr: '→',
    hellip: '…',
};

/**
 * Turn HTML entities like &laquo; into plain characters,
 * so a label can be rendered as text instead of HTML.
 */
export function decodeEntities(text: string): string {
    return text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, entity: string) => {
        if (entity.startsWith('#')) {
            const isHex = entity[1] === 'x' || entity[1] === 'X';
            const codePoint = Number.parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);

            return codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
        }

        return namedEntities[entity] ?? match;
    });
}
```

`&laquo; Anterior` becomes `« Anterior`. A label that already uses `«` passes through unchanged, and unknown entities are left alone.

## Vue pagination component with vueLang()

Start with a type for what the paginator sends:

```ts
// resources/js/types/pagination.ts
export type PaginationLink = {
    url: string | null;
    label: string;
    page?: number | null;
    active: boolean;
};

/** What ->paginate() sends to your page. */
export type LengthAwarePaginated<T> = {
    data: T[];
    current_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
    last_page: number;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
};
```

Then `resources/js/components/ListPagination.vue`. Previous and Next come from the shared `pagination` group. The page numbers come from `links`, without its first and last items:

```vue
<script setup lang="ts">
import { vueLang } from '@erag/lang-sync-inertia/vue';
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import { decodeEntities } from '@/lib/html-entities';
import type { LengthAwarePaginated } from '@/types/pagination';

const props = defineProps<{
    paginator: LengthAwarePaginated<unknown>;
}>();

const { __, transChoice } = vueLang();

const previousLabel = computed(() => decodeEntities(__('pagination.previous')));
const nextLabel = computed(() => decodeEntities(__('pagination.next')));

// The first and last items in `links` are Previous and Next. Keep the numbers and the "..." gaps.
const pageLinks = computed(() => props.paginator.links.slice(1, -1));

const summary = computed(() =>
    transChoice('listing.summary', props.paginator.from === null ? 0 : props.paginator.total, {
        from: props.paginator.from ?? 0,
        to: props.paginator.to ?? 0,
        total: props.paginator.total,
    }),
);
</script>

<template>
    <nav
        :aria-label="__('listing.navigation')"
        class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
    >
        <p class="text-sm text-muted-foreground">{{ summary }}</p>

        <div class="flex flex-wrap items-center gap-1 text-sm">
            <Link v-if="paginator.prev_page_url" :href="paginator.prev_page_url" rel="prev" preserve-scroll class="rounded-md px-3 py-1.5 hover:bg-muted">
                {{ previousLabel }}
            </Link>
            <span v-else aria-disabled="true" class="px-3 py-1.5 text-muted-foreground">{{ previousLabel }}</span>

            <template v-for="(link, index) in pageLinks" :key="index">
                <Link
                    v-if="link.url"
                    :href="link.url"
                    preserve-scroll
                    :aria-current="link.active ? 'page' : undefined"
                    :aria-label="__('listing.go_to_page', { page: link.label })"
                    class="rounded-md px-3 py-1.5"
                    :class="link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
                >
                    {{ link.label }}
                </Link>
                <span v-else class="px-3 py-1.5 text-muted-foreground">{{ link.label }}</span>
            </template>

            <Link v-if="paginator.next_page_url" :href="paginator.next_page_url" rel="next" preserve-scroll class="rounded-md px-3 py-1.5 hover:bg-muted">
                {{ nextLabel }}
            </Link>
            <span v-else aria-disabled="true" class="px-3 py-1.5 text-muted-foreground">{{ nextLabel }}</span>
        </div>
    </nav>
</template>
```

Use it in `resources/js/pages/posts/Index.vue`:

```vue
<script setup lang="ts">
import ListPagination from '@/components/ListPagination.vue';
import type { LengthAwarePaginated } from '@/types/pagination';

defineProps<{
    posts: LengthAwarePaginated<{ id: number; title: string }>;
}>();
</script>

<template>
    <div class="space-y-6">
        <ul>
            <li v-for="post in posts.data" :key="post.id">{{ post.title }}</li>
        </ul>

        <ListPagination :paginator="posts" />
    </div>
</template>
```

`vueLang()` reads translations from the page props, and `computed()` keeps the labels in step with them. When the user switches language and Inertia loads the next page, Previous, Next, the summary and the screen reader labels change together.

::: tip New to Laravel Lang Sync Inertia?
Install it with `composer require erag/laravel-lang-sync-inertia` and `npm install @erag/lang-sync-inertia`, then run `php artisan erag:install-lang`. The [Vue guide](https://erag.in/laravel-lang-sync-inertia/vue.html) and [React guide](https://erag.in/laravel-lang-sync-inertia/react.html) cover every helper.
:::

## React pagination component with reactLang()

The same component for React 19, `resources/js/components/list-pagination.tsx`. It uses the same `html-entities.ts` and `pagination.ts` files:

```tsx
import { reactLang } from '@erag/lang-sync-inertia/react';
import { Link } from '@inertiajs/react';
import { decodeEntities } from '@/lib/html-entities';
import type { LengthAwarePaginated } from '@/types/pagination';

type ListPaginationProps = {
    paginator: LengthAwarePaginated<unknown>;
};

export default function ListPagination({ paginator }: ListPaginationProps) {
    const { __, transChoice } = reactLang();

    const previousLabel = decodeEntities(__('pagination.previous'));
    const nextLabel = decodeEntities(__('pagination.next'));

    // The first and last items in `links` are Previous and Next. Keep the numbers and the "..." gaps.
    const pageLinks = paginator.links.slice(1, -1);

    const summary = transChoice('listing.summary', paginator.from === null ? 0 : paginator.total, {
        from: paginator.from ?? 0,
        to: paginator.to ?? 0,
        total: paginator.total,
    });

    return (
        <nav
            aria-label={__('listing.navigation')}
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
        >
            <p className="text-sm text-muted-foreground">{summary}</p>

            <div className="flex flex-wrap items-center gap-1 text-sm">
                {paginator.prev_page_url ? (
                    <Link href={paginator.prev_page_url} rel="prev" preserveScroll className="rounded-md px-3 py-1.5 hover:bg-muted">
                        {previousLabel}
                    </Link>
                ) : (
                    <span aria-disabled="true" className="px-3 py-1.5 text-muted-foreground">
                        {previousLabel}
                    </span>
                )}

                {pageLinks.map((link, index) =>
                    link.url ? (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            aria-current={link.active ? 'page' : undefined}
                            aria-label={__('listing.go_to_page', { page: link.label })}
                            className={
                                link.active
                                    ? 'rounded-md bg-primary px-3 py-1.5 text-primary-foreground'
                                    : 'rounded-md px-3 py-1.5 hover:bg-muted'
                            }
                        >
                            {link.label}
                        </Link>
                    ) : (
                        <span key={index} className="px-3 py-1.5 text-muted-foreground">
                            {link.label}
                        </span>
                    ),
                )}

                {paginator.next_page_url ? (
                    <Link href={paginator.next_page_url} rel="next" preserveScroll className="rounded-md px-3 py-1.5 hover:bg-muted">
                        {nextLabel}
                    </Link>
                ) : (
                    <span aria-disabled="true" className="px-3 py-1.5 text-muted-foreground">
                        {nextLabel}
                    </span>
                )}
            </div>
        </nav>
    );
}
```

And the page, `resources/js/pages/posts/index.tsx`. The React starter kit uses lowercase page names, so render it with `Inertia::render('posts/index')`:

```tsx
import ListPagination from '@/components/list-pagination';
import type { LengthAwarePaginated } from '@/types/pagination';

type Post = { id: number; title: string };

export default function PostsIndex({ posts }: { posts: LengthAwarePaginated<Post> }) {
    return (
        <div className="space-y-6">
            <ul>
                {posts.data.map((post) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>

            <ListPagination paginator={posts} />
        </div>
    );
}
```

`reactLang()` reads the page props through Inertia's `usePage()`, so call it at the top of the component like any other hook. Every Inertia response re-renders the component with that response's translations.

If you wrap the paginator in an API Resource collection, `from`, `to`, `total` and `links` move under `posts.meta`, and the two URLs become `posts.links.prev` and `posts.links.next`. Point the component at those instead.

## What about simplePaginate and cursorPaginate?

Both skip the `COUNT` query, which helps on big tables. They also send less data:

| Field | `paginate()` | `simplePaginate()` | `cursorPaginate()` |
| --- | --- | --- | --- |
| `links` | Yes | No | No |
| `from` and `to` | Yes | Yes | No |
| `total` | Yes | No | No |
| `prev_page_url` and `next_page_url` | Yes | Yes | Yes |

Because the components above take Previous and Next from `__('pagination.previous')` and `__('pagination.next')`, not from `links`, the same idea works here. In Vue, `resources/js/components/SimplePagination.vue`:

```vue
<script setup lang="ts">
import { vueLang } from '@erag/lang-sync-inertia/vue';
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import { decodeEntities } from '@/lib/html-entities';

defineProps<{
    prevUrl: string | null;
    nextUrl: string | null;
}>();

const { __ } = vueLang();

const previous = computed(() => decodeEntities(__('pagination.previous')));
const next = computed(() => decodeEntities(__('pagination.next')));
</script>

<template>
    <nav :aria-label="__('listing.navigation')" class="flex justify-between">
        <Link v-if="prevUrl" :href="prevUrl" rel="prev" preserve-scroll>{{ previous }}</Link>
        <span v-else aria-disabled="true">{{ previous }}</span>

        <Link v-if="nextUrl" :href="nextUrl" rel="next" preserve-scroll>{{ next }}</Link>
        <span v-else aria-disabled="true">{{ next }}</span>
    </nav>
</template>
```

In React, `resources/js/components/simple-pagination.tsx`:

```tsx
import { reactLang } from '@erag/lang-sync-inertia/react';
import { Link } from '@inertiajs/react';
import { decodeEntities } from '@/lib/html-entities';

type SimplePaginationProps = {
    prevUrl: string | null;
    nextUrl: string | null;
};

export default function SimplePagination({ prevUrl, nextUrl }: SimplePaginationProps) {
    const { __ } = reactLang();

    const previous = decodeEntities(__('pagination.previous'));
    const next = decodeEntities(__('pagination.next'));

    return (
        <nav aria-label={__('listing.navigation')} className="flex justify-between">
            {prevUrl ? (
                <Link href={prevUrl} rel="prev" preserveScroll>
                    {previous}
                </Link>
            ) : (
                <span aria-disabled="true">{previous}</span>
            )}

            {nextUrl ? (
                <Link href={nextUrl} rel="next" preserveScroll>
                    {next}
                </Link>
            ) : (
                <span aria-disabled="true">{next}</span>
            )}
        </nav>
    );
}
```

Pass `posts.prev_page_url` and `posts.next_page_url` as the two props. With `simplePaginate()` you can add a short summary such as `'Showing :from to :to'` to `listing.php`, because `from` and `to` are there. With `cursorPaginate()`, the two buttons are all you need.

## Keep the language on page 2 with withQueryString

Some apps read the language from the URL, like `/posts?lang=es`, instead of the session. Laravel builds page links from the path and the `page` parameter only, so the link to page 2 is `/posts?page=2`, and page 2 shows up in English.

`->withQueryString()` in the controller above fixes that. It copies the current query string, `lang=es` and `search=...` included, into every page URL. To keep only the language, use `->appends(['lang' => app()->getLocale()])`. With a session-based locale you still want `withQueryString()` for search and filters.

## Share pagination text on every page with erag:generate-lang

If pagination shows up on most of your pages, you may not want `syncLangFiles(['pagination', 'listing'])` in every controller. One command exports your PHP language files to JSON:

```bash
php artisan erag:generate-lang
```

It writes files like `resources/js/lang/es/pagination.json` and `resources/js/lang/es/listing.json`, the `output_lang` path in `config/inertia-lang.php`. The package then merges the exported files for the active locale into the `lang` prop on every response, and anything you load with `syncLangFiles()` wins over them. The trade-off is size: every exported group goes to every page. Run the command again after you edit a language file.

## Test it with Pest

One test proves the Spanish groups reach the page:

```php
<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('shares Spanish pagination text with the posts page', function () {
    $this->actingAs(User::factory()->create())
        ->withSession(['locale' => 'es'])
        ->get(route('posts.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('lang.pagination.previous', '&laquo; Anterior')
            ->where('lang.listing.go_to_page', 'Ir a la página :page')
        );
});
```

If `lang.pagination.previous` is `&laquo; Previous`, `syncLangFiles()` ran before the locale was set.

## Common problems and fixes

### Previous and Next stay in English

`syncLangFiles()` loaded the files before `App::setLocale()` ran. Set the locale in a middleware in the `web` group and call `syncLangFiles()` in the controller, or right after `App::setLocale()` in the same middleware.

### I see `pagination.previous` on the page

The key wasn't found, so the helper returns the key itself. Check that `syncLangFiles()` includes `'pagination'` and that `lang/{locale}/pagination.php` exists. There is no fallback language on the frontend: if `lang/es/pagination.php` is missing, the whole group is empty in Spanish.

### I see `&laquo;` as text

You're printing the raw string. Run it through `decodeEntities()` first.

### The summary shows `:from` and `:to`

A placeholder name doesn't match. Use the same names in the PHP line and in the replacements object, without the colon: `{ from, to, total }`.

### The old language comes back after switching

Inertia can prefetch pages before you click them, and those cached copies carry the old language. Call `router.flushAll()` after the language switch request succeeds.

### Page 2 loses the language or the search

Add `->withQueryString()` to the paginator, and link to the URLs Laravel sends instead of building page URLs yourself.

## Frequently asked questions

### Where does Laravel's "« Previous" text come from?

It comes from the `previous` and `next` lines in `lang/{locale}/pagination.php`. Blade's pagination view and the paginator's `links` array both read them with `__('pagination.previous')` and `__('pagination.next')`. Laravel Lang Sync Inertia lets your Vue or React component read the same keys.

### How do I translate Laravel pagination in Inertia Vue or React?

Call `syncLangFiles(['pagination', 'listing'])` in your controller after the locale is set. In the component, use `__('pagination.previous')` and `__('pagination.next')` from `vueLang()` or `reactLang()` for the buttons, and `transChoice()` for the summary line.

### How do I translate "Showing 1 to 10 of 50 results" in Inertia?

Add a key like `'summary' => '[1,*] Showing :from to :to of :total results'` to a PHP language file and load it with `syncLangFiles()`. Then call `transChoice('listing.summary', total, { from, to, total })` with the paginator's values. A full sentence lets each language choose its own word order.

### How do I remove `&laquo;` from Laravel pagination labels?

Leave the language file as it is and decode the entity in your component, as the `decodeEntities()` helper above does. If you'd rather show icons, render them yourself and use `__('pagination.previous')` as the screen reader label.

### Is it safe to use v-html or dangerouslySetInnerHTML for pagination labels?

It works, but every label becomes HTML, so a bad line in any translation file can inject markup or scripts. Decoding the entities and printing plain text looks the same without that risk.

### Can Laravel Lang Sync Inertia read lang/es.json?

No. `syncLangFiles()` loads PHP group files like `lang/es/pagination.php`. Put text your pages need, such as the summary sentence, in a PHP file like `lang/es/listing.php`.

### Does simplePaginate return translated Previous and Next labels?

No. `simplePaginate()` and `cursorPaginate()` send no `links` array, only `prev_page_url` and `next_page_url`. Share the `pagination` group with `syncLangFiles()` and use `__('pagination.previous')` and `__('pagination.next')` for the buttons.

### Does this work with Laravel 13 and Inertia v3?

Yes. This guide was written against Laravel 13 and Inertia v3. The Laravel package supports Laravel 8 to 13, and the Vue and React helpers work with Inertia v2 and v3.

## Install Laravel Lang Sync Inertia

Translated pagination takes three commands and one `syncLangFiles()` call:

```bash
composer require erag/laravel-lang-sync-inertia
npm install @erag/lang-sync-inertia
php artisan erag:install-lang
```

You keep one set of language files in Laravel, use the same keys as Blade, and load only the groups each page needs. Placeholders, plurals, nested folders, TypeScript types and JSON export are built in.

- Documentation: [Laravel Lang Sync Inertia docs](https://erag.in/laravel-lang-sync-inertia/), including the [Laravel setup](https://erag.in/laravel-lang-sync-inertia/laravel.html) and the [helper API](https://erag.in/laravel-lang-sync-inertia/api.html)
- Source: [GitHub](https://github.com/eramitgupta/laravel-lang-sync-inertia)
- Package: [Packagist](https://packagist.org/packages/erag/laravel-lang-sync-inertia)

Keep reading:

- [The complete Laravel Lang Sync Inertia setup for Vue and React](./laravel-lang-inertia-vue-react.md), with a language switcher and saved user language.
- [Laravel React CRUD with Inertia](./laravel-react-crud-inertia.md), for a full list page with search and pagination.
- [Laravel Svelte translations with Inertia](./laravel-svelte-translations-inertia.md), if your frontend is Svelte.
- [Sharing Laravel lang files with your frontend](./laravel-lang-files-frontend-json.md), on per-page loading versus JSON export.
