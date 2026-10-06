---
title: "Store Rich Text Safely: Sanitizing Editor HTML"
headline: "Store Rich Text Safely: How to Sanitize Rich Text HTML in Laravel"
description: Why the editor's browser sanitizer is not enough, and how to sanitize rich text HTML in Laravel with an allow-list, a form request, Pest tests and a CSP header.
date: 2026-09-29
package: text-editor-react
category: Best practices
tags: [laravel, security, xss, rich-text-editor, react]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/sanitize-rich-text-html-laravel.md
</div>

Every rich text field ends up rendered somewhere as raw HTML. In Blade that's `{!! $post->body !!}`. In React it's `dangerouslySetInnerHTML`. Both do exactly what they say: they trust the string.

That makes every editor field a place to store an XSS payload. And the payload doesn't have to come through your editor. Anyone can open the browser dev tools, copy the request, and post whatever HTML they like to your route.

This post is about how to sanitize rich text HTML properly: what the editor does in the browser, why that isn't the boundary, and how I set up server-side sanitizing in a Laravel app. The examples use `@erag/text-editor-react`, but the backend half applies to any editor, including the Vue version.

## What the editor's sanitizer does

The editor ships a browser-side allow-list sanitizer built on `DOMParser` and `TreeWalker`. It's on by default (`sanitize: true`) and runs when content is inserted, previewed or exported. According to the [security docs](https://erag.in/text-editor-react/security.html), it:

- removes `<script>` tags, `javascript:` URIs, data URIs with executable content and inline event handlers like `onerror` and `onclick`,
- blocks unauthorized iframe protocols and dangerous style declarations such as `expression()` and `url()` injections,
- normalizes mention and merge-tag chips, keeping only their expected attributes,
- keeps only the configured tags and attributes (`allowedTags`, `allowedAttributes`) and filters `style` declarations to a safe set of properties.

That's useful. Pasted content from Word or a web page gets cleaned before it lands in the document, and your users see a preview that matches what will be saved.

## Why browser sanitizing is not the boundary

The docs say it directly: client-side sanitization is defense in depth and cannot replace server-side validation. The reasoning is simple.

Everything in the browser is under the user's control. Your `onChange` handler, your `useForm` state, the sanitizer itself: an attacker simply doesn't run any of it. They send a `POST /posts` with a body of their choosing. Your Laravel app sees a string and has no way to know whether an editor produced it.

There's also a practical limit. The exported `sanitizeHtml()` helper needs browser DOM APIs and returns an empty string when they're unavailable, so it can't run in Node during SSR, let alone in PHP.

So the rule is simple: **sanitize on the server, every time HTML comes in.**

## Where to sanitize rich text HTML in Laravel

You have two choices: sanitize on write (before saving) or on read (before rendering).

I sanitize on write. The database then only holds clean HTML, every place that renders it is safe by default, and validation rules run against what will actually be stored. If a body is nothing but `<script>` tags, it becomes empty after sanitizing and your `required` rule catches it.

The cost: if you later tighten the allow-list, old rows were cleaned with the old rules. When that happens, write a one-off Artisan command that re-sanitizes existing rows. It's a small price for not having to remember sanitizing at every render site.

## Build the allow-list from your real output

An allow-list sanitizer keeps only the tags and attributes you name and drops everything else. The question is what to name.

Don't guess. Open the editor with your production toolbar, use every control, then open the **Source code** dialog (the `code` toolbar item) and read the HTML. Allow what you see, and nothing more. A comment box with bold, italic, lists and links needs a much shorter list than a full article editor.

Here's a starting point for a typical article editor, kept as plain data in `config/rich-text.php`:

```php
return [

    'allowed_tags' => [
        'p', 'br', 'h2', 'h3', 'h4', 'blockquote', 'pre', 'code',
        'strong', 'em', 'u', 's', 'sub', 'sup', 'span',
        'ul', 'ol', 'li',
        'a', 'img', 'hr',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],

    'allowed_attributes' => [
        'a' => ['href', 'title'],
        'img' => ['src', 'alt', 'width', 'height'],
        'td' => ['colspan', 'rowspan'],
        'th' => ['colspan', 'rowspan'],
        'span' => [
            'class',
            'contenteditable',
            'data-erag-mention',
            'data-erag-mention-id',
            'data-erag-mention-label',
            'data-erag-mention-value',
            'data-erag-merge-tag',
            'data-erag-merge-tag-value',
            'data-erag-merge-tag-name',
        ],
    ],

    'allowed_span_classes' => ['erag-mention', 'erag-merge-tag'],

    'allowed_url_schemes' => ['http', 'https', 'mailto'],

];
```

Compare it against your own source view before you trust it. A few decisions are baked in:

- **Mention and merge-tag spans** keep their `data-erag-*` attributes, `class` and `contenteditable="false"`. These are exactly the attributes the security docs list. Strip them and mentions turn into plain text, and your backend can no longer find them.
- **URLs** only allow `http`, `https`, `mailto` and relative paths. That's the line that stops `javascript:` links.
- **No `style` attribute.** The editor keeps a filtered set of `style` declarations for formatting. If your toolbar includes controls that write inline styles, you have to allow `style` and your sanitizer must filter individual CSS properties. If it can't, remove those controls from the toolbar instead.
- **No iframes.** The editor's media control can insert HTTPS iframes. Unless you need embeds, keep them out. If you do, allow only specific hosts in `src`.

## Wire a sanitizer into Laravel

Please don't write the sanitizer yourself with regular expressions or `DOMDocument`. HTML parsing has edge cases that attackers know better than you or I do. Use a maintained library. The package's Laravel guide mentions HTMLPurifier as one example. Whatever you choose, configure it from the allow-list above.

I put the library behind a small contract so the rest of the app doesn't care which one it is:

```php
namespace App\Contracts;

interface HtmlSanitizer
{
    /**
     * Return HTML that only contains allow-listed tags, attributes and URLs.
     */
    public function sanitize(string $html): string;
}
```

`App\Services\RichTextSanitizer` is then a thin adapter: it reads `config('rich-text')`, passes it to the library in whatever format that library expects, and implements `sanitize()`. Bind it once in `AppServiceProvider`:

```php
use App\Contracts\HtmlSanitizer;
use App\Services\RichTextSanitizer;

public function register(): void
{
    $this->app->singleton(HtmlSanitizer::class, RichTextSanitizer::class);
}
```

Now sanitize in the form request, before validation runs:

```php
namespace App\Http\Requests;

use App\Contracts\HtmlSanitizer;
use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'max:100000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('content'))) {
            $this->merge([
                'content' => app(HtmlSanitizer::class)->sanitize($this->input('content')),
            ]);
        }
    }
}
```

The controller stays boring, which is the point: `Post::create($request->validated())` stores the sanitized HTML. The `max` rule also matters. Without a length limit, someone can post a 50 MB body just to see what happens.

## Test the contract, not the library

A few Pest tests pin down the behavior you rely on. They don't care which library sits behind the interface, so they keep passing when you swap it:

```php
use App\Contracts\HtmlSanitizer;

it('removes script vectors from editor html', function (string $payload, string $forbidden) {
    $clean = app(HtmlSanitizer::class)->sanitize($payload);

    expect(strtolower($clean))->not->toContain($forbidden);
})->with([
    'script tag' => ['<p>Hi</p><script>alert(1)</script>', '<script'],
    'event handler' => ['<img src="/a.png" onerror="alert(1)">', 'onerror'],
    'javascript url' => ['<a href="javascript:alert(1)">Click</a>', 'javascript:'],
    'inline click handler' => ['<p onclick="steal()">Hi</p>', 'onclick'],
]);

it('keeps mention chips intact', function () {
    $html = '<p>Hi <span class="erag-mention" data-erag-mention="true" '
        .'data-erag-mention-id="1" data-erag-mention-label="Damon Cross" '
        .'contenteditable="false">@Damon Cross</span></p>';

    expect(app(HtmlSanitizer::class)->sanitize($html))
        ->toContain('data-erag-mention-id="1"');
});
```

Add a case every time you allow something new. If you start allowing iframes, add a test proving an iframe from an unknown host is removed.

## Merge tags: replace first, then sanitize

If you resolve merge tags into real values before sending an email or rendering a PDF, the order matters. The [merge tags docs](https://erag.in/text-editor-react/merge-tags.html) say it clearly: replace the tokens, then pass the result through your server-side sanitizer. The replacement values often come from users too (a client name, a company name), so they need escaping as well. Inserting them as DOM text nodes, or wrapping them in `e()` for a string replacement, handles that. I cover the full flow in [email templates with merge tags](./email-templates-merge-tags-react.md).

## Add a Content Security Policy as a second net

Sanitizing is the main defense. A CSP is the net underneath it: even if a script sneaks through, the browser refuses to run it. The security docs suggest this policy as a starting point:

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ContentSecurityPolicy
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
        );

        return $response;
    }
}
```

Register it for web routes in `bootstrap/app.php`:

```php
use App\Http\Middleware\ContentSecurityPolicy;
use Illuminate\Foundation\Configuration\Middleware;

->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [ContentSecurityPolicy::class]);
})
```

Test it before you ship. A strict policy blocks the Vite dev server and any third-party script you load, so you'll likely need a looser policy locally and extra sources for analytics or payment widgets. See [MDN's CSP guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) for the directives.

## When can you skip this?

Almost never. "Only admins use this editor" isn't an exception, because admin accounts get phished too.

The one real exception is when you never render the HTML. If you only need text, store plain text (the editor's `getText()` gives you that) and escape it on output like any other string.

## FAQ

### Isn't the editor's built-in sanitizer enough?

No. It cleans content inside the browser. Requests can skip the browser completely, so the server has to sanitize independently.

### Can I use strip_tags with a list of allowed tags?

No. `strip_tags()` removes tags, but it keeps every attribute on the tags it allows. `<a href="javascript:...">` and `<p onclick="...">` survive untouched.

### Do I still need to escape output?

Escape everything except the sanitized HTML column. Titles, names and excerpts should still go through Blade's normal escaped output or React's default rendering.

## What to do next

Add the `HtmlSanitizer` contract, pick a maintained library, and write the four Pest tests before wiring it into your form requests. Then open your editor's source view and trim the allow-list to what your toolbar actually produces. If you haven't set up the editor yet, the [React WYSIWYG editor tutorial](./react-rich-text-editor-wysiwyg.md) and the [configuration reference](https://erag.in/text-editor-react/configuration.html) cover the client side.
