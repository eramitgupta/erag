---
title: 'OTP Input'
description: 'One-time code input with one box per character, grouping, paste and autofill support, optional letters and masking, and auto-submit when complete.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/otp-input.md
</div>


<div class="doc-category">Fields</div>

# OTP Input

`Erag\InertiaForms\Fields\OtpInput` collects a short one-time code, showing one box per character. It handles typing, pasting and the browser's one-time-code autofill, and can submit the form on its own once the code is complete. Like every other field, it is built into the package with Tailwind CSS and needs no extra library.

**When to use:** email or SMS verification codes, two-factor codes, invite codes, and short PINs.

Try it on the **Onboarding wizard** and **All fields** forms in the [Live Demo](/demo).

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

Six numeric boxes, the default. Try pasting a code like `123-456`.

<Example id="fields/otp-input/basic">

<<< @/../examples/fields/otp-input/basic.php#example

</Example>

### Groups and auto submit

`groupSize(3)` adds a separator in the middle. With `autoSubmit()`, filling in the last box submits the form, so the data appears without pressing the button.

<Example id="fields/otp-input/auto-submit">

<<< @/../examples/fields/otp-input/auto-submit.php#example

</Example>

### Advanced: letters and hidden input

An eight-character invite code that accepts letters, shown in upper case, and a four-digit PIN hidden with `password()`.

<Example id="fields/otp-input/invite">

<<< @/../examples/fields/otp-input/invite.php#example

</Example>

## How it works

- Each character has its own box. Typing a character moves focus to the next box.
- **Backspace** removes a character and moves focus back. **Arrow Left / Right** move between boxes without changing anything.
- Pasting a code into any box spreads it over the boxes. Characters that aren't allowed (spaces, dashes, letters in a numeric code) are skipped, so a pasted `123-456` fills in `123456`.
- The boxes use `autocomplete="one-time-code"`, so phones can offer the code from an SMS and fill every box at once.
- With `groupSize()`, a small separator splits the boxes, like `123 – 456`.
- With `alphanumeric()`, letters are allowed and shown in upper case.
- With `password()`, the characters are hidden like a password.
- With `autoSubmit()`, the form is submitted as soon as the last box is filled in.

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `length(int $length)`

The number of characters, from 2 to 12. Defaults to 6.

### `groupSize(?int $size)`

Split the boxes into groups of this size. `null` (default) shows one row without separators.

### `alphanumeric(bool $alphanumeric = true)`

Allow letters as well as digits. Letters are upper-cased in the browser and on the server.

```php
OtpInput::make('invite_code')->length(8)->alphanumeric()->groupSize(4);
```

### `password(bool $masked = true)`

Hide the characters as they are typed.

### `autoSubmit(bool $autoSubmit = true)`

Submit the form once every box is filled in, so users don't have to press the button. The normal submit flow runs, including `onBeforeSubmit` and validation.

```php
OtpInput::make('code')->length(6)->autoSubmit()->required();
```

## Validation rules

| Attribute | Rules |
| --------- | ----- |
| `name` | `nullable` (or `required`), `string`, `size:<length>`, `regex` (digits only, or letters and digits with `alphanumeric()`) |

- A short code fails with *"The Code must be 6 characters."*
- A letter in a numeric code fails with *"The Code may only contain numbers."*
- With `alphanumeric()`: *"The Code may only contain letters and numbers."*

The field only checks the format. Checking that the code is correct is up to you, for example with a custom rule or in the controller after `validate()`.

## Value

A string, like `'123456'`. With `alphanumeric()`, `$form->validated()` returns it upper-cased (`'ab12'` becomes `'AB12'`). Empty value: `''`.

## Standalone use

::: code-group

```vue [Vue]
<OtpInput v-model="code" :field="codeField" id="code" :disabled="false" />
```

```tsx [React]
<OtpInput field={codeField} id="code" value={code} disabled={false} onChange={setCode} />
```

```svelte [Svelte]
<OtpInput field={codeField} id="code" bind:value={code} disabled={false} />
```

:::

Start with `''` as the value. `autoSubmit()` submits the surrounding `<Form>`, so it has no effect when the component is used on its own. See [Standalone Components](/frontend/standalone).
