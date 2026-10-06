---
title: Build Email Templates With Merge Tags in React
headline: "Build an Email Template Editor in React With Merge Tags and Laravel"
description: Let your team edit transactional emails in a React email template editor with merge tags and starter templates, then resolve and send them safely from Laravel.
date: 2026-09-29
package: text-editor-react
category: Use case
tags: [react, email, merge-tags, laravel, inertia]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/email-templates-merge-tags-react.md
</div>

Transactional emails usually start life as Blade views. That works until the support team wants to reword the invoice reminder, and every wording change becomes a ticket, a pull request and a deploy.

The fix is to let them edit the emails themselves. That needs three things: a React email template editor that's pleasant to write in, placeholders like "client name" that non-developers can insert without typing syntax, and a backend that fills those placeholders in without opening an XSS hole.

This post builds that with `@erag/text-editor-react` on an Inertia page and Laravel on the backend. The example is an invoice reminder, but the pattern works for any templated email. If the editor isn't installed yet, the [React WYSIWYG editor tutorial](./react-rich-text-editor-wysiwyg.md) covers setup.

## What we're building

- An `email_templates` table with a `subject` and an HTML `body`.
- An edit page where staff write the email, insert merge tags from a sidebar or by typing <code>&#123;&#123;</code>, and start from ready-made templates.
- A save rule that rejects placeholders the backend can't fill.
- A resolver that swaps tags for real values, sanitizes the result and sends it.

## Define the merge tags once, in PHP

The list of available tags has to match what the backend can fill. So I define it in Laravel and send it to the page as a prop, instead of hard-coding it in React:

```php
namespace App\Mail\MergeTags;

use App\Models\Invoice;
use Illuminate\Support\Number;

class InvoiceMergeTags
{
    /**
     * @return array<string, array{name: string, group: string}>
     */
    public static function definitions(): array
    {
        return [
            '{{client.name}}' => ['name' => 'Client name', 'group' => 'Client'],
            '{{invoice.number}}' => ['name' => 'Invoice number', 'group' => 'Invoice'],
            '{{invoice.amount}}' => ['name' => 'Amount due', 'group' => 'Invoice'],
            '{{invoice.due_date}}' => ['name' => 'Due date', 'group' => 'Invoice'],
            '{{company.name}}' => ['name' => 'Company name', 'group' => 'Company'],
        ];
    }

    /**
     * @return array<int, array{value: string, name: string, group: string}>
     */
    public static function forEditor(): array
    {
        return collect(self::definitions())
            ->map(fn (array $tag, string $value): array => ['value' => $value, ...$tag])
            ->values()
            ->all();
    }

    /**
     * @return array<string, string>
     */
    public static function valuesFor(Invoice $invoice): array
    {
        return [
            '{{client.name}}' => $invoice->client->name,
            '{{invoice.number}}' => $invoice->number,
            '{{invoice.amount}}' => Number::currency($invoice->total, 'USD'),
            '{{invoice.due_date}}' => $invoice->due_at->toFormattedDateString(),
            '{{company.name}}' => config('app.name'),
        ];
    }
}
```

The shape of `forEditor()` matches the editor's `MergeTagItem`: a `value` that gets stored, a friendly `name`, and a `group` for the sidebar. The edit controller passes it along:

```php
return Inertia::render('email-templates/edit', [
    'template' => $emailTemplate->only(['id', 'name', 'subject', 'body']),
    'mergeTags' => InvoiceMergeTags::forEditor(),
]);
```

## The React email template editor

Here's `resources/js/pages/email-templates/edit.tsx`:

```tsx
import type { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Editor,
    type EditorInit,
    type EditorTemplateItem,
    type MergeTagItem,
} from '@erag/text-editor-react';

interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    body: string;
}

interface EditEmailTemplateProps {
    template: EmailTemplate;
    mergeTags: MergeTagItem[];
}

const starterTemplates: EditorTemplateItem[] = [
    {
        id: 'reminder-friendly',
        label: 'Friendly reminder',
        description: 'A polite nudge a few days after the due date.',
        group: 'Reminders',
        content:
            '<p>Hi {{client.name}},</p>' +
            '<p>Just a reminder that invoice {{invoice.number}} for {{invoice.amount}} was due on {{invoice.due_date}}.</p>' +
            '<p>Thanks,<br>{{company.name}}</p>',
    },
    {
        id: 'reminder-final',
        label: 'Final notice',
        description: 'A firmer message for invoices that are well overdue.',
        group: 'Reminders',
        content:
            '<p>Hi {{client.name}},</p>' +
            '<p>Invoice {{invoice.number}} is now overdue. Please arrange payment of {{invoice.amount}} this week.</p>' +
            '<p>Regards,<br>{{company.name}}</p>',
    },
];

export default function EditEmailTemplate({ template, mergeTags }: EditEmailTemplateProps) {
    const { data, setData, put, processing, errors } = useForm({
        subject: template.subject,
        body: template.body,
    });

    const editorConfig: EditorInit = {
        height: 480,
        menubar: ['edit', 'insert', 'format', 'merge-tags', 'templates'],
        toolbar: 'undo redo | blocks | bold italic underline | bullist numlist | link | removeformat | preview',
        placeholder: 'Write the email. Type {{ to insert a merge tag.',
        mergeTags: { enabled: true, limit: 10, items: mergeTags },
        templates: { enabled: true, items: starterTemplates },
    };

    function save(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        put(`/email-templates/${template.id}`);
    }

    return (
        <form className="space-y-4" onSubmit={save}>
            <label className="block">
                <span>Subject</span>
                <input
                    className="w-full"
                    value={data.subject}
                    onChange={(event) => setData('subject', event.target.value)}
                />
            </label>
            {errors.subject && <p className="text-sm text-red-600">{errors.subject}</p>}

            <Editor
                value={data.body}
                onChange={(value) => setData('body', value)}
                init={editorConfig}
                disabled={processing}
                ariaLabel={`${template.name} email body`}
            />
            {errors.body && <p className="text-sm text-red-600">{errors.body}</p>}

            <button type="submit" disabled={processing}>
                Save template
            </button>
        </form>
    );
}
```

A few choices worth explaining:

- **The menubar is an explicit array**, so it must include `'merge-tags'` and `'templates'`. Leave either out and that entry disappears.
- **The toolbar is short on purpose.** Email clients support far less HTML and CSS than browsers. Headings, bold, lists and links survive almost everywhere. I leave out media, font pickers and colors for that reason.
- **The config is rebuilt on every render**, and that's fine. The editor compares `init` structurally, so there's no need for `useMemo` here.

Staff can now type <code>&#123;&#123;</code> to get an autocomplete filtered by name, value and group, or open the **Merge tag** sidebar and click a tag. Each inserted tag becomes an atomic chip that deletes as one unit. The **Templates** menu opens a searchable picker with a live preview of each starter template, and inserting one puts it at the cursor.

## Two forms of placeholder in the saved HTML

Look at what ends up in `body`. A tag inserted from the sidebar or autocomplete is a chip:

```html
<span class="erag-merge-tag" data-erag-merge-tag="true" data-erag-merge-tag-value="{{client.name}}" contenteditable="false">{{client.name}}</span>
```

The starter templates above write placeholders as plain text inside the HTML, which is how the [templates docs](https://erag.in/text-editor-react/templates.html) write them too. I don't depend on either form. The backend below handles both, and treats <code>&#123;&#123; client.name &#125;&#125;</code> with spaces the same as without.

## Reject tags the backend can't fill

A typo like <code>&#123;&#123;client.nmae&#125;&#125;</code> in plain text would go out to a real customer as-is. Catch it on save. One regular expression finds tokens in both chip attributes and plain text, so the check is short:

```php
namespace App\Mail\MergeTags;

use DOMDocument;
use DOMText;
use DOMXPath;

class MergeTagResolver
{
    private const TOKEN_PATTERN = '/\{\{\s*([A-Za-z0-9_.]+)\s*\}\}/';

    /**
     * @return array<int, string>
     */
    public static function tokensIn(string $content): array
    {
        preg_match_all(self::TOKEN_PATTERN, $content, $matches);

        return array_values(array_unique(array_map(
            fn (string $name): string => '{{'.$name.'}}',
            $matches[1],
        )));
    }

    /**
     * @param  array<string, string>  $values
     */
    public static function resolveText(string $text, array $values): string
    {
        return preg_replace_callback(
            self::TOKEN_PATTERN,
            fn (array $match): string => $values['{{'.$match[1].'}}'] ?? $match[0],
            $text,
        );
    }

    /**
     * @param  array<string, string>  $values
     */
    public static function resolveHtml(string $html, array $values): string
    {
        $previous = libxml_use_internal_errors(true);

        $document = new DOMDocument();
        $document->loadHTML(
            '<meta charset="utf-8"><body>'.$html.'</body>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );

        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $xpath = new DOMXPath($document);

        foreach ($xpath->query('//body//text()') as $textNode) {
            if ($textNode instanceof DOMText) {
                $textNode->data = self::resolveText($textNode->data, $values);
            }
        }

        foreach ($xpath->query('//span[@data-erag-merge-tag="true"]') as $chip) {
            $token = self::resolveText($chip->getAttribute('data-erag-merge-tag-value'), $values);
            $chip->parentNode?->replaceChild($document->createTextNode($token), $chip);
        }

        $body = $document->getElementsByTagName('body')->item(0);
        $output = '';

        foreach ($body?->childNodes ?? [] as $child) {
            $output .= $document->saveHTML($child);
        }

        return $output;
    }
}
```

The validation rule in the form request then compares against the definitions:

```php
use App\Mail\MergeTags\InvoiceMergeTags;
use App\Mail\MergeTags\MergeTagResolver;
use Closure;

public function rules(): array
{
    $knownTags = array_keys(InvoiceMergeTags::definitions());

    $onlyKnownTags = function (string $attribute, mixed $value, Closure $fail) use ($knownTags): void {
        $unknown = array_diff(MergeTagResolver::tokensIn(is_string($value) ? $value : ''), $knownTags);

        if ($unknown !== []) {
            $fail('Unknown merge tags: '.implode(', ', $unknown));
        }
    };

    return [
        'subject' => ['required', 'string', 'max:255', $onlyKnownTags],
        'body' => ['required', 'string', 'max:100000', $onlyKnownTags],
    ];
}
```

The subject gets the same check. People put <code>&#123;&#123;invoice.number&#125;&#125;</code> in subject lines constantly, and it's a plain string, so `resolveText()` handles it when sending.

Sanitize the body on save as well. The editor cleans HTML in the browser, but that's not a security boundary. [Storing rich text safely](./sanitize-rich-text-html-laravel.md) sets up an `HtmlSanitizer` contract that keeps the merge-tag attributes intact.

## Why the resolver works on the DOM

The tempting version is <code>str_replace('&#123;&#123;client.name&#125;&#125;', $name, $body)</code>. The [merge tags docs](https://erag.in/text-editor-react/merge-tags.html) warn against it: the token also lives inside `data-erag-merge-tag-value`, so a global replace rewrites the attribute and leaves stale chip markup behind.

Working on the DOM fixes that, and it fixes escaping too. Plain-text placeholders are resolved first, then each chip is swapped for a text node, so a value is never run through the resolver twice. Values go in through `createTextNode()` and text node data, so a client named `<script>` comes out as harmless text when the document is serialized. No manual `e()` calls to forget.

Unknown tokens are left alone rather than blanked. With the validation rule in place they shouldn't exist, and if one does, a visible placeholder is easier to spot and report than a sentence with a silent hole in it.

## Sending the email

The resolved HTML goes into a small Mailable:

```php
namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class TemplatedMail extends Mailable
{
    public function __construct(
        public string $subjectLine,
        public string $bodyHtml,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->subjectLine);
    }

    public function content(): Content
    {
        return new Content(htmlString: $this->bodyHtml);
    }
}
```

And the send, for example in a queued job that runs for overdue invoices:

```php
use App\Contracts\HtmlSanitizer;
use App\Mail\MergeTags\InvoiceMergeTags;
use App\Mail\MergeTags\MergeTagResolver;
use App\Mail\TemplatedMail;
use App\Models\EmailTemplate;
use Illuminate\Support\Facades\Mail;

$template = EmailTemplate::where('key', 'invoice-reminder')->firstOrFail();
$values = InvoiceMergeTags::valuesFor($invoice);

Mail::to($invoice->client->email)->send(new TemplatedMail(
    subjectLine: MergeTagResolver::resolveText($template->subject, $values),
    bodyHtml: app(HtmlSanitizer::class)->sanitize(
        MergeTagResolver::resolveHtml($template->body, $values),
    ),
));
```

Resolve first, then sanitize. That's the order the docs recommend. If you want a shared header and footer, render a Blade view with `new Content(view: ...)` and output the resolved body inside it.

## Let people check their work before it goes out

The `preview` button in the toolbar opens a sanitized preview of the body, which catches layout mistakes. It can't show what the email looks like with real data, though, because merge tags are still placeholders at that point.

For that, add a "Send me a test" button next to Save. It posts to a small route that loads a sample invoice (or builds one with a factory in non-production environments), runs the same `valuesFor()`, `resolveHtml()` and sanitize steps, and sends the result to the signed-in user. Because it goes through the exact code path that real emails use, a test that looks right means the real one will too.

## Trade-offs to know about

**It's a text editor, not an email designer.** You get well-structured HTML for text-heavy emails: reminders, receipts, onboarding. If marketing needs multi-column layouts that look identical in every email client, use a dedicated email builder.

**Images need absolute URLs.** Email clients can't resolve `/storage/...`. If you allow images, make your upload endpoint return full URLs.

**Merge tags are plain substitution.** No loops, no conditionals. "List every line item" or "show this paragraph only for annual plans" belongs in a Blade view, not in an editable template.

## When you don't need this

If you have three emails that change twice a year, keep them in code. Blade or Markdown mailables are versioned, reviewed and covered by tests, and there's no editing UI to maintain. Build the editor when the people who own the wording aren't developers and changes are frequent enough to hurt.

## Where to go next

Start with one email. Move its wording into an `email_templates` row, define its merge tags in one PHP class, and wire the editor page. Once the validation rule and resolver have tests, adding the next email is mostly writing copy. The [Laravel integration guide](https://erag.in/text-editor-react/laravel-integration.html) shows the rest of the editor config, including mentions and image uploads.
