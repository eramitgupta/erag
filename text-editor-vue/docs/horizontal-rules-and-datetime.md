---
title: Horizontal Rules and Date-Time
description: 'Insert horizontal rules and current date or time values using configurable Intl.DateTimeFormat options generated at insertion time.'
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

# Horizontal Rules & Date-Time

Learn how to insert horizontal divider lines (`<hr>`) and current date/time stamps into your content.

---

## Configuration

Include `horizontal-rule` and `date-time` plugins:

```ts
const editorConfig: EditorInit = {
    plugins: ['horizontal-rule', 'date-time'],
    menubar: ['insert'],
    toolbar: 'undo redo | blocks | bold italic | hr removeformat',
};
```

---

## Horizontal Rules (`hr`)

Clicking the **Horizontal Rule** (`hr`) button inserts a thematic section break line (`<hr>` element) at the cursor position.

```html
<hr />
<p><br /></p>
```

The trailing paragraph gives the caret a valid place to continue typing after the divider.

---

## Date & Time Stamps (`date-time`)

Open **Insert → Date/time** and choose a configured value. Date and time values are generated when the menu opens, so they do not become stale. `date-time` is a plugin name, not a toolbar keyword.

```ts
const editorConfig: EditorInit = {
    dateFormats: [
        {
            label: 'Long date',
            type: 'date',
            options: { year: 'numeric', month: 'long', day: 'numeric' },
        },
    ],
    timeFormats: [
        {
            label: '24-hour time',
            type: 'time',
            options: { hour: '2-digit', minute: '2-digit', hour12: false },
        },
    ],
};
```
