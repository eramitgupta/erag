---
title: 'Serialized Schema'
description: 'The JSON shape Form::toArray() sends to your page: action, method, fieldsets, fields, data, and visibility conditions.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/reference/schema.md
</div>


<div class="doc-category">Reference</div>

# Serialized Schema

When you pass a form to Inertia, it is turned into JSON by `Form::toArray()`. This is the `FormSchema` object your page receives. You rarely need to read it directly, but it helps when writing [custom fields](/frontend/custom-fields) or [standalone components](/frontend/standalone).

The excerpts below come from the demo form in the repository (`playground/DemoForm.php`), exported with `php playground/export-schema.php`.

## Form

```json
{
    "action": "/demo",
    "method": "post",
    "fieldsets": [ ... ],
    "data": { ... },
    "hasFiles": true,
    "scrollToFirstError": true,
    "resetOnSuccess": false,
    "class": null,
    "accent": null,
    "wizard": null
}
```

| Key | Type | Description |
| --- | ---- | ----------- |
| `action` | `string \| null` | Submit URL. `null` when no route/URL is set or the form is unauthorized. |
| `method` | `'get' \| 'post' \| 'put' \| 'patch' \| 'delete'` | Lowercase HTTP method. |
| `fieldsets` | `FieldsetSchema[]` | Every authorized fieldset. Loose fields are wrapped in fieldsets with `legend: null`. |
| `data` | `object` | Initial values, keyed by field name (nested for dot names). |
| `hasFiles` | `boolean` | `true` when the form contains a file upload. |
| `scrollToFirstError` | `boolean` | Scroll to the first invalid field after a failed submit. |
| `resetOnSuccess` | `boolean` | Reset data after a successful submit. |
| `class` | `string \| null` | Extra classes for the `<form>` element. |
| `accent` | `string \| null` | Accent color from `Form::accent()`, applied as `--erag-form-accent`. `null` uses the default. The `<Form>` `accent` prop overrides it. |
| `wizard` | `WizardSettings \| null` | `null` for normal forms. For a [wizard](/concepts/wizard): `{ nextLabel, backLabel, validateUrl, token }`, the button texts, the step validation URL and the encrypted form token. |

An unauthorized form serializes to `action: null`, `method: 'post'`, empty `fieldsets` and `data`, `false` for the three flags, and `null` for `class`, `accent` and `wizard`.

### `data` example

```json
{
    "name": "",
    "email": "",
    "role": null,
    "contact_method": "email",
    "skills": [],
    "topics": [],
    "notifications": true,
    "volume": 40,
    "starts_on": "",
    "brand_color": "#4f46e5",
    "avatar": null,
    "terms": false,
    "source": "playground"
}
```

## Fieldset

```json
{
    "id": null,
    "legend": "Account",
    "description": "Basic details for the new user.",
    "icon": null,
    "columns": 2,
    "class": null,
    "visibility": null,
    "fields": [ ... ]
}
```

| Key | Type | Description |
| --- | ---- | ----------- |
| `id` | `string \| null` | HTML id. |
| `legend` | `string \| null` | Heading. `null` renders a plain group. |
| `description` | `string \| null` | Text under the legend. |
| `icon` | `string \| null` | Step icon from `Fieldset::icon()`, used by [wizards](/concepts/wizard). |
| `columns` | `number` | Grid columns (at least 1). |
| `class` | `string \| null` | Extra classes. |
| `visibility` | `VisibilityCondition[] \| null` | Conditions, or `null` when always visible. |
| `fields` | `FieldSchema[]` | Authorized fields. |

## Field

Every field has these common keys:

```json
{
    "component": "TextInput",
    "name": "phone",
    "label": "Phone",
    "help": null,
    "placeholder": null,
    "required": true,
    "disabled": false,
    "readonly": false,
    "autofocus": false,
    "columnSpan": null,
    "class": null,
    "visibility": [
        {
            "field": "contact_method",
            "operator": "=",
            "value": "phone",
            "negate": false
        }
    ],
    "clearWhenHidden": true,
    "clearable": false,
    "emptyValue": "",
    "type": "tel",
    "minLength": null,
    "maxLength": null,
    "min": null,
    "max": null,
    "step": null,
    "prefix": null,
    "suffix": null,
    "autocomplete": null
}
```

| Key | Type | Description |
| --- | ---- | ----------- |
| `component` | `string` | Frontend component name. |
| `name` | `string` | Data key (dot notation for nested). For `Submit`, the button text. |
| `label` | `string` | Label text (generated from the name when not set). |
| `help` | `string \| null` | Help text. |
| `placeholder` | `string \| null` | Placeholder. |
| `required` | `boolean` | Shows the `*` marker. |
| `disabled` | `boolean` | Disabled state. |
| `readonly` | `boolean` | Read-only state. |
| `autofocus` | `boolean` | Focus on load. |
| `columnSpan` | `number \| null` | Grid span inside the fieldset. |
| `class` | `string \| null` | Extra classes on the field wrapper. |
| `visibility` | `VisibilityCondition[] \| null` | Conditions. |
| `clearWhenHidden` | `boolean` | Reset to `emptyValue` when hidden. |
| `clearable` | `boolean` | Show a × button that resets the value. Used by `TextInput`, `Combobox`, `DatePicker`, `TimePicker`, and `ColorPicker`. |
| `emptyValue` | `unknown` | The field's empty value (`[]` for multi-value fields, `{ "start": "", "end": "" }` for a date range). |

### Keys per field type

| Component | Extra keys |
| --------- | ---------- |
| `TextInput` | `type`, `minLength`, `maxLength`, `min`, `max`, `step`, `prefix`, `suffix`, `autocomplete` |
| `Textarea` | `rows`, `autoResize`, `minLength`, `maxLength`, `showCharacterCount` |
| `Hidden` | none |
| `Combobox` | `options`, `multiple`, `searchable`, `search` (`{ url, token, field }` for [`searchUsing()`](/fields/combobox#searchusing-closure-callback), otherwise `null`). `Select` fields serialize as `Combobox` too. |
| `Radio` | `options`, `inline`, `columns`, `buttons` |
| `Checkbox` | `trueValue`, `falseValue` |
| `CheckboxGroup` | `options`, `inline`, `columns`, `buttons` |
| `Toggle` | `trueValue`, `falseValue`, `onLabel`, `offLabel` |
| `DatePicker` | `withTime`, `range`, `months`, `firstDayOfWeek`, `minDate`, `maxDate` |
| `TimePicker` | `withSeconds`, `minTime`, `maxTime`, `minuteStep` |
| `ColorPicker` | `swatches` |
| `Slider` | `min`, `max`, `step`, `showValue`, `suffix` |
| `FileUpload` | `multiple`, `image`, `accept`, `maxSize`, `maxFiles` |
| `TagsInput` | `suggestions`, `maxTags`, `maxTagLength`, `reorderable` |
| `Blocks` | `blocks` (each: `name`, `label`, `description`, `icon`, `columns`, `titleFrom`, `fields`, `defaults`), `addActionLabel`, `reorderable`, `addable`, `deletable`, `collapsible`, `collapsed`, `minItems`, `maxItems` |
| `Repeater` | Same keys as `Blocks`, with exactly one entry in `blocks` (the item: its `label`, `columns`, `titleFrom` and `fields`) |
| `KeyValue` | `keyLabel`, `valueLabel`, `keyPlaceholder`, `valuePlaceholder`, `addActionLabel`, `reorderable`, `addable`, `deletable`, `editableKeys`, `maxItems` |
| `Link` | `structured`, `withLabel`, `withTarget`, `requireScheme`, `allowedSchemes`, `labelPlaceholder` |
| `Slug` | `from`, `separator`, `lowercase`, `maxLength`, `prefix` |
| `OtpInput` | `length`, `alphanumeric`, `masked`, `groupSize`, `autoSubmit` |
| `Composer` | `attachments`, `accept`, `maxFiles`, `maxSize`, `maxLength`, `submitOnEnter`, `sendLabel`, `rows`, `quickReplies` |
| `Heading` | `text`, `level` |
| `Text` | `text` |
| `Html` | `html` |
| `Separator` | `spacing` |
| `Callout` | `title`, `body`, `tone`, `icon` |
| `Submit` | `processingLabel`, `variant`, `size`, `fullWidth`, `icon`, `iconPosition`, `intent` (`{ key, value }` or `null`) |

`FileUpload.accept` is already in HTML form: extensions become `".pdf,.docx"`, and `image()` without extensions becomes `"image/*"`.

Some keys are adjusted when the form is serialized:

- `DatePicker.withTime` is always `false` when `range` is `true`.
- `DatePicker.months` is `1` or `2`. It becomes `2` when `range()` is called while it is still `1`.
- `DatePicker.firstDayOfWeek` is `0` (Sunday) to `6` (Saturday).
- `TimePicker.minuteStep` is between `1` and `30` (default `5`).
- `TagsInput.suggestions` are strings; `reorderable` defaults to `true`.
- `Blocks` data is a list of `{ "type": "section", "data": { ... } }` blocks; each block's `fields` use the same schema as top-level fields, with names relative to the block.
- `Repeater` data is a plain list of row objects, like `[{ "question": "...", "answer": "..." }]`; `addActionLabel` defaults to `"Add "` plus the item label in lower case.
- `Link` data is a string, or `{ "url": "" }` plus the enabled `label` / `target` keys when `structured` is `true`.
- `Composer` data is `{ "message": "", "attachments": [] }`.
- `OtpInput.length` is between `2` and `12`.
- `Heading`, `Text`, `Html`, `Separator` and `Callout` have a generated `name`, `columnSpan: 12`, and no entry in `data`.
- `KeyValue` data is a list of `{ "key": "...", "value": "..." }` rows; `addActionLabel` defaults to `"Add row"`.

For example, a range picker and a tags field:

```json
{
    "component": "DatePicker",
    "name": "stay",
    "withTime": false,
    "range": true,
    "months": 2,
    "firstDayOfWeek": 1,
    "minDate": null,
    "maxDate": null,
    "emptyValue": { "start": "", "end": "" }
}
```

```json
{
    "component": "TagsInput",
    "name": "tags",
    "suggestions": ["travel", "carry-on"],
    "maxTags": 5,
    "maxTagLength": null,
    "reorderable": true,
    "emptyValue": []
}
```

Both excerpts leave out the common keys.

### Options

Option fields (`Combobox`, `Radio`, `CheckboxGroup`) always send a normalized list:

```json
"options": [
    {
        "value": "email",
        "label": "Email",
        "description": "We reply within a day.",
        "disabled": false
    },
    {
        "value": "phone",
        "label": "Phone",
        "description": "Business hours only.",
        "disabled": false
    }
]
```

### Submit

```json
{
    "component": "Submit",
    "name": "Create user",
    "label": "Create user",
    "help": null,
    "placeholder": null,
    "required": false,
    "disabled": false,
    "readonly": false,
    "autofocus": false,
    "columnSpan": null,
    "class": null,
    "visibility": null,
    "clearWhenHidden": false,
    "clearable": false,
    "emptyValue": "",
    "processingLabel": "Creating…"
}
```

## Visibility condition

```json
{ "field": "contact_method", "operator": "=", "value": "phone", "negate": false }
```

| Key | Type | Description |
| --- | ---- | ----------- |
| `field` | `string` | The field whose value is checked (dot notation allowed). |
| `operator` | `string` | One of the [visibility operators](/reference/visibility-operators). |
| `value` | `unknown` | Compared value. Enums are sent as their backing value. |
| `negate` | `boolean` | `true` for `hiddenWhen()`. |

## TypeScript

The same shapes are exported as types: `FormSchema`, `FieldsetSchema`, `FieldSchema`, `FieldOption`, `VisibilityCondition`, `DateRangeValue` (`{ start: string; end: string }`), and `FormErrors` (`Record<string, string>`).

Field-specific types are exported too: `BlocksSchema`, `BlockSchema`, `BlockItem`, `KeyValueSchema`, `KeyValueRow`, `LinkSchema`, `LinkValue`, `SlugSchema`, `OtpInputSchema`, `ComposerSchema`, `ComposerValue`, `DisplayFieldSchema`, `CalloutTone`, `SubmitVariant`, `SubmitSize` and `WizardSettings`.
