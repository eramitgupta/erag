---
title: 'File Upload'
description: 'Drag-and-drop file uploads with image previews, allowed extensions, size limits, and multiple files. Sent as multipart form data.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/file-upload.md
</div>


<div class="doc-category">Fields</div>

# File Upload

`Erag\InertiaForms\Fields\FileUpload` renders a drop zone. Users can drag files onto it, click it, or press Enter/Space to open the file dialog. Selected files are listed with their name, size, and a remove button. Image uploads show a thumbnail preview.

**When to use:** avatars, attachments, documents, image galleries.

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

One image up to 2 MB. `image()` limits the file dialog to images and shows a thumbnail after picking.

<Example id="fields/file-upload/basic">

<<< @/../examples/fields/file-upload/basic.php#example

</Example>

### Allowed types

`accept()` limits the extensions, and the hint under the drop zone lists them together with the size limit. The submitted data shows the file by name.

<Example id="fields/file-upload/documents">

<<< @/../examples/fields/file-upload/documents.php#example

</Example>

### Advanced: several files

An insurance claim with two upload fields. `multiple()` turns the value into a list, `maxFiles()` caps its length and `maxSize()` applies to each file.

<Example id="fields/file-upload/multiple">

<<< @/../examples/fields/file-upload/multiple.php#example

</Example>

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `multiple(bool $multiple = true)`

Allow several files. The value becomes an array. New files are added to the list instead of replacing it.

```php
FileUpload::make('photos')->multiple()->image();
```

### `image(bool $image = true)`

Accept only images. Uses Laravel's `image` rule instead of `file`, limits the file dialog to images (unless `accept()` is set), and shows previews.

```php
FileUpload::make('cover')->image();
```

### `accept(array|string $extensions)`

Allowed file extensions. Leading dots are removed, so `'.pdf'` and `'pdf'` are the same. Adds an `extensions:` rule and filters the file dialog.

```php
FileUpload::make('resume')->accept(['pdf', 'doc', 'docx']);
FileUpload::make('data')->accept('csv');
```

### `maxSize(?int $kilobytes)`

Maximum size **per file**, in kilobytes. Adds a `max:` rule and a size hint inside the drop zone ("up to 2.0 MB").

```php
FileUpload::make('video')->maxSize(50 * 1024); // 50 MB
```

### `maxFiles(?int $count)`

With `multiple()`, the maximum number of files. Adds `max:<count>` to the array rule. In the browser, extra files beyond the limit are dropped.

```php
FileUpload::make('attachments')->multiple()->maxFiles(5);
```

### `placeholder(?string $placeholder)`

The main text inside the drop zone. Defaults to "**Click to upload** or drag and drop", with the first part in the accent color. Below it, a hint lists the allowed types, the size limit, and (with `multiple()`) the file limit, for example "PDF, DOCX · up to 5.0 MB · max 3 files".

```php
FileUpload::make('logo')->image()->placeholder('Drop your logo here');
```

## Validation rules

**Single file**

| Configuration | Rules on `name` |
| ------------- | --------------- |
| default | `file` |
| `image()` | `image` instead of `file` |
| `accept(['pdf'])` | adds `extensions:pdf` |
| `maxSize(1024)` | adds `max:1024` |

```php
FileUpload::make('avatar')->image()->maxSize(1024);
// ['nullable', 'image', 'max:1024']
```

**Multiple files**

| Key | Rules |
| --- | ----- |
| `name` | `array`, `max:<maxFiles>` if set, plus your own rules |
| `name.*` | `file`/`image`, `extensions:`, `max:<maxSize>` |

```php
FileUpload::make('documents')->multiple()->accept(['pdf'])->maxFiles(3);
// 'documents'   => ['nullable', 'array', 'max:3']
// 'documents.*' => ['file', 'extensions:pdf']
```

## How files are sent

When a form has at least one file upload, `hasFiles` is `true` in the schema and `<Form>` sends the request as `multipart/form-data`.

Browsers and PHP can't send multipart bodies with `PUT`, `PATCH`, or `DELETE`, so in that case `<Form>` sends a `POST` with `_method` set to the real verb. Laravel routes it to your `put`/`patch`/`delete` route as usual.

## Value

- Single: a `File` object in the browser, an `UploadedFile` on the server. Empty value: `null`.
- `multiple()`: an array of files. Empty value: `[]`.
- Bound values are always ignored. A file field starts empty even when editing, because existing files can't be put back into a file input.

## Storing the upload

```php
public function update(Request $request)
{
    $data = ProfileForm::make()->validate($request);

    if ($data['avatar'] ?? null) {
        $request->user()->update([
            'avatar_path' => $data['avatar']->store('avatars', 'public'),
        ]);
    }

    return back();
}
```

::: tip Edit forms
Don't mark a file field `required()` on edit screens. Since the field always starts empty, the user would have to upload the file again every time.
:::

## Standalone use

::: code-group

```vue [Vue]
<FileUpload v-model="avatar" :field="avatarField" id="avatar" :disabled="false" />
```

```tsx [React]
<FileUpload field={avatarField} id="avatar" value={avatar} disabled={false} onChange={setAvatar} />
```

```svelte [Svelte]
<FileUpload field={avatarField} id="avatar" bind:value={avatar} disabled={false} />
```

:::

The value is a `File` (or `File[]`). When you submit it yourself with Inertia, use `forceFormData: true`. See [Standalone Components](/frontend/standalone).
