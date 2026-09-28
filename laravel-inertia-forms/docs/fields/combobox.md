---
title: 'Combobox'
description: 'A custom dropdown for one or many values, with search, option descriptions, chips, a clear button, and options from arrays or enums.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/combobox.md
</div>


<div class="doc-category">Fields</div>

# Combobox

`Erag\InertiaForms\Fields\Combobox` renders a dropdown list for one value or, with `multiple()`, several. The dropdown is built into the package with Tailwind CSS instead of using the browser's `<select>`, so it can show option descriptions, a check mark on selected options, removable chips, and a search box, and it looks the same in every browser.

**When to use:** picking one or more values from a list. Use `searchable()` once the list gets long.

::: tip `Select` still works
`Erag\InertiaForms\Fields\Select` is an alias of `Combobox`, so existing forms keep working without changes. Both serialize with the component name `Combobox`. The rest of this page uses `Combobox`.
:::

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

One required value from a key → label array.

<Example id="fields/combobox/basic">

<<< @/../examples/fields/combobox/basic.php#example

</Example>

### Descriptions and clearing

Options given as arrays can carry a description and a `disabled` flag. `clearable()` adds a × button that resets the value to `null`.

<Example id="fields/combobox/descriptions">

<<< @/../examples/fields/combobox/descriptions.php#example

</Example>

### Advanced: searchable and multiple

A searchable single choice, and a `multiple()` field that shows picked options as chips. Typing filters by label and description.

For lists too long to send with the page, such as users or products, use [`searchUsing()`](#searchusing-closure-callback) to load options from the server as the user types. It needs a server round trip, so it can't run in this static preview.

<Example id="fields/combobox/multiple-searchable">

<<< @/../examples/fields/combobox/multiple-searchable.php#example

</Example>

## How it works

- Click the field (or press Enter, Space, or Arrow Down while it has focus) to open the list.
- Each option shows its label and, when set, its description on a second line. Selected options have a check mark and their description turns the accent color.
- In single mode, picking an option closes the list. With `searchable()`, the picked option shows as a chip and the search box stays empty, ready for a new search. In `multiple()` mode the list stays open, and picked options appear as chips in the field, each with its own × button.
- Disabled options are dimmed and can't be picked.
- Click outside, press Escape, or Tab away to close. When there is no room below, the list opens above the field.

### Keyboard

| Key | Action |
| --- | ------ |
| Arrow Down / Up | Open the list, then move through the options |
| Home / End | Jump to the first / last option |
| Enter | Pick the highlighted option (or toggle it with `multiple()`) |
| Space | Same as Enter, unless the field is `searchable()` (then it types a space) |
| Backspace | With an empty search box: remove the last chip with `multiple()`, or clear the value of a `clearable()` single combobox |
| Escape | Close the list |

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `options(mixed $options)`

The list of choices. See [Option formats](#option-formats) below.

```php
Combobox::make('status')->options(['draft' => 'Draft', 'published' => 'Published']);
```

### `multiple(bool $multiple = true)`

Allow more than one value. The value becomes an array, and selected options show as chips.

```php
Combobox::make('languages')->multiple()->options(['en' => 'English', 'hi' => 'Hindi', 'fr' => 'French']);
```

### `searchable(bool $searchable = true)`

Turn the field into a search box. Typing filters the list by label and description (case-insensitive), and "No results" is shown when nothing matches. Use it once a list gets long.

```php
Combobox::make('timezone')->searchable()->options(timezone_identifiers_list());

Combobox::make('skills')->multiple()->searchable()->options(['Laravel', 'Vue', 'React', 'Svelte']);
```

### `clearable(bool $clearable = true)`

Show a × button in the field once something is selected. Clicking it resets the value to `null` (or `[]` with `multiple()`).

```php
Combobox::make('assignee')->options($users)->clearable();
```

### `placeholder(?string $placeholder)`

Text shown while nothing is selected. Defaults to "Select an option", or "Search…" for a searchable combobox.

```php
Combobox::make('role')->placeholder('Choose a role')->options([...]);
```

### `searchUsing(Closure $callback)`

Load options from the server as the user types, for lists that are too long to send with the page, like users or products. The callback receives the search text (an empty string when the list first opens) and returns options in any [option format](#option-formats). It also makes the field `searchable()`.

```php
use App\Models\User;

Combobox::make('author_id')
    ->label('Author')
    ->searchUsing(fn (string $search) => User::query()
        ->where('name', 'like', "%{$search}%")
        ->orderBy('name')
        ->limit(20)
        ->get()
        ->map(fn (User $user) => [
            'value' => $user->id,
            'label' => $user->name,
            'description' => $user->email,
        ]))
    ->selectedOptionsUsing(fn (array $ids) => User::whereIn('id', $ids)
        ->get()
        ->map(fn (User $user) => [
            'value' => $user->id,
            'label' => $user->name,
            'description' => $user->email,
        ]));
```

- You don't write a route. The package registers one endpoint (`POST /_inertia-forms/search`). Each request carries an encrypted form class name, so only your own form classes can be searched, and the form's and field's [authorization](/concepts/authorization) checks run on every request.
- Requests wait until the user pauses typing (250 ms), and older requests are cancelled. "Searching…" shows while the first results load.
- The endpoint rebuilds the form with `YourForm::make()`, so the callback must not depend on a bound model or constructor arguments.
- Only top-level fields can search remotely. A `searchUsing()` combobox inside a [Blocks](/fields/blocks) or [Repeater](/fields/repeater) item is not supported yet.

### `selectedOptionsUsing(Closure $callback)`

Return the options for the given values (an array of the selected values). It is used to:

- show the label of the current value when the form is rendered, e.g. when [binding a model](/concepts/model-binding);
- validate submitted values: a value is only accepted when this callback returns it.

Without it, a remote combobox has no options rule, so add your own, for example `->rule('exists:users,id')`.

## Option formats

`options()` accepts many shapes. They are all turned into a list of `value`, `label`, `description`, and `disabled`.

**Key → label array**

```php
->options(['admin' => 'Administrator', 'editor' => 'Editor'])
// value "admin", label "Administrator"
```

**Plain list** (value and label are the same)

```php
->options(['S', 'M', 'L', 'XL'])
```

**List of arrays** with `value`/`label` (or `id`/`name`), plus optional `description` and `disabled`

```php
->options([
    ['value' => 'basic', 'label' => 'Basic'],
    ['value' => 'pro', 'label' => 'Pro', 'description' => 'For growing teams'],
    ['value' => 'legacy', 'label' => 'Legacy', 'disabled' => true],
])
```

**Collections and query results**

```php
->options(Category::pluck('name', 'id'))           // id => name
->options(User::all(['id', 'name']))                // uses id and name
```

**Enum class**

```php
enum Plan: string
{
    case Free = 'free';
    case Team = 'team';

    public function label(): string
    {
        return ucfirst($this->value).' plan';
    }
}

->options(Plan::class)
// value "free", label "Free plan"
```

Backed enums use their value; pure enums use the case name. If the enum has a `label()` method it is used, otherwise the label is made from the case name (`InProgress` → "In progress"). A `description()` method, if present, fills the description.

**Closure** (resolved when needed)

```php
->options(fn () => Tag::orderBy('name')->pluck('name', 'id'))
```

Descriptions are shown under the label in the Combobox list, and by [Radio](/fields/radio) and [CheckboxGroup](/fields/checkbox-group) as cards.

## Validation rules

With `searchUsing()`, the options rule below is replaced by a check against `selectedOptionsUsing()` (or left out when that callback isn't set).

| Configuration | Rules |
| ------------- | ----- |
| single | `Rule::in(<option values>)` |
| `multiple()` | `array` on `name`, and `Rule::in(<option values>)` on `name.*` |

```php
Combobox::make('tags')->multiple()->options(['a', 'b']);
// 'tags'   => ['nullable', 'array']
// 'tags.*' => [Rule::in(['a', 'b'])]
```

Your own rules from `->rules()` / `->rule()` are added to `name` (not to `name.*`).

::: tip Disabled options
Disabled options can't be picked in the UI, and their values are left out of the `in` rule, so the server rejects them too.
:::

## Value

- Single: the selected option value. Empty value: `null`.
- `multiple()`: an array of option values. Empty value: `[]`.

Option values keep their type (numbers stay numbers) when the user picks them.

## Standalone use

::: code-group

```vue [Vue]
<Combobox v-model="country" :field="countryField" id="country" :disabled="false" />
```

```tsx [React]
<Combobox field={countryField} id="country" value={country} disabled={false} onChange={setCountry} />
```

```svelte [Svelte]
<Combobox field={countryField} id="country" bind:value={country} disabled={false} />
```

:::

The component shows the search box when `field.searchable` is `true`. The packages also export it as `Select`, so older imports keep working. See [Standalone Components](/frontend/standalone).
