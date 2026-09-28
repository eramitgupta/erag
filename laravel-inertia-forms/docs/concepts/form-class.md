---
title: 'Form Class'
description: 'Create a form class, list its fields, set the submit route or URL and HTTP method, and pass it to an Inertia page.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/concepts/form-class.md
</div>


<div class="doc-category">Core Concepts</div>

# Form Class

Every form is a class that extends `Erag\InertiaForms\Form` and implements one method: `fields()`.

```php
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class NewsletterForm extends Form
{
    protected ?string $actionRoute = 'newsletter.subscribe';

    public function fields(): array
    {
        return [
            TextInput::make('email')->email()->required(),
            Submit::make('Subscribe'),
        ];
    }
}
```

`fields()` returns a list of fields and [fieldsets](/concepts/fieldsets). Returning anything else throws a `LogicException`.

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

The smallest useful form: a target URL, one field and a button.

<Example id="concepts/form-class/basic">

<<< @/../examples/concepts/form-class/basic.php#example

</Example>

### Options on the instance

Everything set as a property can also be chained on the instance. Here the form sends a `PUT` to a plain URL, clears itself after success, and uses a teal accent.

<Example id="concepts/form-class/options">

<<< @/../examples/concepts/form-class/options.php#example

</Example>

### Advanced: constructor arguments

`make()` passes its arguments to the constructor, so one class can serve different contexts. The role list comes from outside, and `when()` adds the help text only when admins can be invited.

<Example id="concepts/form-class/constructor">

<<< @/../examples/concepts/form-class/constructor.php#example

</Example>

## Creating an instance

Use the static `make()` helper or `new`. Both work the same.

```php
$form = NewsletterForm::make();
```

`make()` forwards its arguments to the constructor, so you can give your form a constructor:

```php
class InviteForm extends Form
{
    public function __construct(private Team $team) {}

    public function fields(): array
    {
        return [
            Combobox::make('role')->options($this->team->roles()->pluck('name', 'id')),
        ];
    }
}

InviteForm::make($team);
```

When the form is resolved from the container (for example with the [`#[Validate]`](/concepts/validation#the-validate-attribute) attribute), constructor dependencies are injected by Laravel.

## Passing it to a page

A form is `Arrayable` and `JsonSerializable`. Pass the instance as an Inertia prop:

```php
return Inertia::render('Newsletter', [
    'form' => NewsletterForm::make(),
]);
```

The prop arrives in the page as a `FormSchema` object. See [Serialized Schema](/reference/schema) for its shape.

## Where the form submits

### Named route

Set the `$actionRoute` property, or call `route()`. The HTTP method is read from the route itself, so a `Route::put()` route submits with `PUT`.

```php
protected ?string $actionRoute = 'posts.store';
```

```php
EditPostForm::make()->route('posts.update', $post);
EditPostForm::make()->route('posts.update', ['post' => $post]);
```

The second argument is the route parameters. A single value is wrapped in an array for you.

You can also set default parameters with the `$actionRouteParameters` property.

### Plain URL

Set `$actionUrl` or call `url()`. Calling `url()` clears any named route.

```php
protected ?string $actionUrl = '/api/feedback';
```

```php
FeedbackForm::make()->url('/api/feedback')->put();
```

### HTTP method

When you use a URL, the method defaults to `post`. Change it with `method()` or one of the shortcuts:

| Method           | Sets method to |
| ---------------- | -------------- |
| `->post()`       | `post`         |
| `->put()`        | `put`          |
| `->patch()`      | `patch`        |
| `->delete()`     | `delete`       |
| `->method('get')`| any verb, lowercased |

You can also set the `$method` property. For named routes, the explicit method is ignored because the route decides.

::: tip File uploads with PUT or PATCH
When a form has a [file upload](/fields/file-upload) and uses `put`, `patch`, or `delete`, the frontend sends a `POST` request with a `_method` field. Laravel treats it as the original method. You don't need to do anything.
:::

## Form options

| Method / property                          | Default | What it does |
| ------------------------------------------ | ------- | ------------ |
| `scrollToFirstError(bool $scroll = true)` / `$scrollToFirstError` | `true`  | After a failed submit, scroll to and focus the first invalid field. |
| `resetOnSuccess(bool $reset = true)` / `$resetOnSuccess`         | `false` | Reset the form data to its initial values after a successful submit. |
| `class(?string $class)` / `$class`                                | `null`  | Extra CSS classes on the `<form>` element. |
| `accent(?string $color)` / `$accent`                              | `null`  | Accent color for this form's buttons, focus rings, and selected states, like `'#0f766e'`. `null` keeps the default indigo. See [Styling](/frontend/styling#accent-color). |
| `wizard(bool $wizard = true, ?string $nextLabel = null, ?string $backLabel = null)` / `$wizard` | `false` | Show one fieldset at a time as a step, with Back and Continue buttons and a server check per step. See [Wizard](/concepts/wizard). |

```php
ContactForm::make()
    ->resetOnSuccess()
    ->scrollToFirstError(false)
    ->class('max-w-xl')
    ->accent('#0f766e');
```

Or as properties:

```php
class ContactForm extends Form
{
    protected bool $resetOnSuccess = true;

    protected ?string $class = 'max-w-xl';

    protected ?string $accent = '#0f766e';
}
```

## Helpful methods

| Method | Returns |
| ------ | ------- |
| `getAction()` | The resolved URL, or `null` if no route or URL is set. |
| `getMethod()` | The lowercase HTTP method. |
| `getFields()` | Authorized top-level fields and fieldsets. |
| `getFieldsets()` | Authorized items, with loose fields grouped into unnamed fieldsets. |
| `getField(string $name)` | A single authorized field by name, or `null`. |
| `data()` | The initial values (bound model, defaults, or empty values). |
| `rules(?array $data = null)` | Validation rules for the fields visible with that data. |
| `hasFiles()` | `true` when the form contains a file upload. |
| `getModel()` | The bound model or array. |

## Conditional building

Forms and fields use Laravel's `Conditionable` and `Tappable` traits, so `when()`, `unless()`, and `tap()` are available:

```php
ProfileForm::make()
    ->when($user->isAdmin(), fn (ProfileForm $form) => $form->resetOnSuccess());

TextInput::make('nickname')
    ->when($locked, fn (TextInput $field) => $field->disabled());
```

Fields and fieldsets are also `Macroable`, so you can add your own fluent helpers with `Field::macro()`.

## Common field methods

Every field (except where noted on its page) supports these methods:

| Method | Description |
| ------ | ----------- |
| `make(string $name)` | Create the field. The name is the key in the form data. Dot notation (`address.city`) creates nested data. |
| `label(?string $label)` | Label text. Defaults to a readable version of the name (`first_name` → "First name"). |
| `help(?string $help)` | Help text shown under the control. |
| `placeholder(?string $placeholder)` | Placeholder text. |
| `default(mixed $value)` | Initial value when nothing is bound. A closure is called lazily. |
| `required(bool $required = true)` | Adds the `required` rule and a `*` marker. Without it, the field gets `nullable`. |
| `disabled(bool $disabled = true)` | Disable the control. |
| `readonly(bool $readonly = true)` | Make the control read-only. |
| `autofocus(bool $autofocus = true)` | Focus the control on page load. |
| `columnSpan(?int $columns)` | How many grid columns the field spans inside its fieldset. |
| `class(?string $class)` | Extra CSS classes on the field wrapper. |
| `rules(string\|array $rules)` / `rule($rule)` | Add validation rules. See [Validation](/concepts/validation). |
| `visibleWhen(...)` / `hiddenWhen(...)` | See [Conditional Visibility](/concepts/visibility). |
| `clearWhenHidden(bool $clear = true)` | Reset the value to empty when the field is hidden in the browser. |
| `clearable(bool $clearable = true)` | Show a × button that empties the value. Used by [TextInput](/fields/text-input#clearable-bool-clearable-true), [Combobox](/fields/combobox#clearable-bool-clearable-true), [DatePicker](/fields/date-picker#clearable-bool-clearable-true), [TimePicker](/fields/time-picker#clearable-bool-clearable-true), and [ColorPicker](/fields/color-picker#clearable-bool-clearable-true); other fields ignore it. |
| `authorize(...)` / `authorizedWhen(...)` / `authorizedUnless(...)` | See [Authorization](/concepts/authorization). |

```php
TextInput::make('billing.first_name')
    ->label('First name')
    ->placeholder('Jane')
    ->help('As printed on your card.')
    ->required()
    ->columnSpan(2);
```
