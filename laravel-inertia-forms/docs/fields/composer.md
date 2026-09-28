---
title: 'Composer'
description: 'A chat-style message box that grows as you type, sends with Enter, takes file attachments and quick replies, and has its own Send button.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/composer.md
</div>


<div class="doc-category">Fields</div>

# Composer

`Erag\InertiaForms\Fields\Composer` is a message box like the one at the bottom of a chat. It grows as the user types, sends the form with Enter, can take file attachments, and offers ready-made replies as chips. Its value holds the message and the files together. Like every other field, it is built into the package with Tailwind CSS and needs no extra library.

**When to use:** support replies, comments, chat messages, notes on a record, and any form whose main job is sending a short message, often with a file.

```php
use Erag\InertiaForms\Fields\Composer;
use Erag\InertiaForms\Form;

class ReplyForm extends Form
{
    protected ?string $actionRoute = 'tickets.replies.store';

    protected bool $resetOnSuccess = true;

    public function fields(): array
    {
        return [
            Composer::make('reply')
                ->placeholder('Write a reply…')
                ->required()
                ->accept(['pdf', 'png', 'jpg'])
                ->maxFiles(3)
                ->maxSize(5120)
                ->quickReplies(['Thanks, looking into it now.', 'Could you send a screenshot?']),
        ];
    }
}
```

Try it on the **Support chat** form in the [Live Demo](/demo).

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

A one-line message box. Enter sends it and Shift+Enter adds a line. `required()` blocks empty messages.

<Example id="fields/composer/basic">

<<< @/../examples/fields/composer/basic.php#example

</Example>

### Comment box

A taller box with a character limit. `submitOnEnter(false)` makes Enter add a line, so only the renamed button sends.

<Example id="fields/composer/comment">

<<< @/../examples/fields/composer/comment.php#example

</Example>

### Advanced: attachments and quick replies

`accept()` turns attachments on: attach files with the paperclip or drop them on the box. Clicking a quick reply fills in the message. The data holds both, with files shown by name.

<Example id="fields/composer/support-reply">

<<< @/../examples/fields/composer/support-reply.php#example

</Example>

## How it works

- The text area starts at `rows()` lines and grows as the user types.
- **Enter** sends the form and **Shift+Enter** adds a new line. Turn this off with `submitOnEnter(false)`; then Enter adds a line and only the button sends.
- With attachments on, a **paperclip** button opens the file picker, and files can also be dropped onto the composer. Each attached file shows as a chip with a × button to remove it.
- Quick replies appear as chips next to the box. Clicking one fills in the message, ready to edit or send.
- The composer has its own **Send** button (the `sendLabel()`), which submits the form. A form with a Composer doesn't get the default "Submit" button, so you don't need a [Submit](/fields/submit) field.

::: tip Clear the box after sending
Turn on [`resetOnSuccess`](/concepts/form-class#form-options) for composer forms. The message and attachments are then cleared after each successful send, like in a chat app.
:::

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `attachments(bool $attachments = true)`

Let users attach files. Off by default. When it is on, the whole form is submitted as multipart, like a form with a [file upload](/fields/file-upload).

### `accept(array|string $extensions)`

Allowed file extensions, as an array or a comma-separated string (`'pdf,png'`). Leading dots are removed and case is ignored. Also turns on attachments.

### `maxFiles(?int $count)`

The most files per message. Defaults to 5; `null` removes the limit.

### `maxSize(?int $kilobytes)`

The largest file allowed, in kilobytes, like Laravel's `max` rule for files.

### `maxLength(?int $characters)`

The longest message allowed.

### `submitOnEnter(bool $submitOnEnter = true)`

Send with Enter (and add lines with Shift+Enter). On by default.

### `sendLabel(string $label)`

Text of the send button. Defaults to "Send".

### `rows(int $rows)`

The starting height in lines. Defaults to 1.

### `quickReplies(array $replies)`

Ready-made messages shown as chips.

## Validation rules

| Attribute | Rules |
| --------- | ----- |
| `reply` | `nullable` (or `required`), `array:message,attachments`, plus a content check when required |
| `reply.message` | `nullable`, `string`, `max:<maxLength>` |
| `reply.attachments` | `nullable`, `array`, `max:<maxFiles>`; `prohibited` when attachments are off |
| `reply.attachments.*` | `file`, `extensions:<accept>`, `max:<maxSize>` |

- With `required()`, the user must write a message **or** attach a file. An empty send fails with *"Write a message or attach a file."*
- A file with the wrong type or size fails on its own item, like `reply.attachments.0`, and the message names the field: "Reply attachment".
- Files sent to a composer without `attachments()` are rejected.

## Value

In the browser the value is an object with the message and the selected files:

```json
{ "message": "Here is the invoice.", "attachments": [] }
```

`$form->validated()` trims the message and returns the files as `UploadedFile` instances:

```php
$reply = $form->validated('reply');
// ['message' => 'Here is the invoice.', 'attachments' => [UploadedFile, ...]]

foreach ($reply['attachments'] as $file) {
    $file->store('ticket-attachments');
}
```

Empty value: `['message' => '', 'attachments' => []]`. A bound string (or an array with a `message` key) fills in the message; files are never filled in from a model.

## Standalone use

::: code-group

```vue [Vue]
<Composer v-model="reply" :field="replyField" id="reply" :disabled="false" />
```

```tsx [React]
<Composer field={replyField} id="reply" value={reply} disabled={false} onChange={setReply} />
```

```svelte [Svelte]
<Composer field={replyField} id="reply" bind:value={reply} disabled={false} />
```

:::

Start with `{ message: '', attachments: [] }` as the value. Enter and the Send button submit the surrounding `<Form>`, so on its own the component only edits the value; send it with your own code. See [Standalone Components](/frontend/standalone).
