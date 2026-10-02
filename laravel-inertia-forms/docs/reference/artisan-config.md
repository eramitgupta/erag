---
title: 'Artisan Command & Config'
description: 'Install with php artisan erag:install-inertia-forms, generate form classes with php artisan make:form, and publish the inertia-forms config file.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/reference/artisan-config.md
</div>


<div class="doc-category">Reference</div>

# Artisan Command & Config

## `erag:install-inertia-forms`

Run it once after `composer require erag/inertia-forms`:

```bash
php artisan erag:install-inertia-forms
```

It does two things:

1. Publishes the config to `config/inertia-forms.php` (see [Configuration](#configuration)).
2. Prints the next steps: the npm package for Vue, React or Svelte, the Tailwind `@source` line, and `make:form`.

```
   INFO  Installing Inertia Forms.

  config/inertia-forms.php ............................. PUBLISHED
```

If the config already exists it is kept and shown as `SKIPPED`. Pass `--force` to replace it with the package's current version:

```bash
php artisan erag:install-inertia-forms --force
```

| Option | Description |
| ------ | ----------- |
| `--force` | Overwrite the config if it was already published. |

## `make:form`

Generate a new form class:

```bash
php artisan make:form CreateUserForm
```

This creates `app/Forms/CreateUserForm.php` in the `App\Forms` namespace, straight from the stub inside the package. Nothing needs to be published first:

```php
<?php

namespace App\Forms;

use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class CreateUserForm extends Form
{
    /**
     * Named route the form submits to.
     */
    protected ?string $actionRoute = null;

    /**
     * @return array<int, \Erag\InertiaForms\Fields\Field|\Erag\InertiaForms\Fields\Fieldset>
     */
    public function fields(): array
    {
        return [
            TextInput::make('name')->required(),
            Submit::make('Save'),
        ];
    }
}
```

Set `$actionRoute` to your route name and replace the fields.

Use a slash for sub-folders:

```bash
php artisan make:form Billing/UpdatePlanForm
# app/Forms/Billing/UpdatePlanForm.php, namespace App\Forms\Billing
```

The command refuses to overwrite an existing file.

## Configuration

Publish the config file:

```bash
php artisan vendor:publish --tag=inertia-forms-config
```

This creates `config/inertia-forms.php`:

```php
return [
    'throw_on_unauthorized' => false,

    'search' => [
        'uri' => '_inertia-forms/search',
        'middleware' => ['web', 'throttle:60,1'],
    ],

    'wizard' => [
        'uri' => '_inertia-forms/validate-step',
        'middleware' => ['web', 'throttle:60,1'],
    ],
];
```

### `throw_on_unauthorized`

**Default:** `false`

Controls what happens when a form whose [authorization](/concepts/authorization) check fails is serialized (passed to Inertia).

| Value | Behavior |
| ----- | -------- |
| `false` | The form serializes to an empty structure: no fieldsets, no data, `action: null`. |
| `true` | An `Illuminate\Auth\Access\AuthorizationException` is thrown (HTTP 403). |

This setting only affects serialization. `validate()` and `#[Validate]` always throw for unauthorized forms.

### `search`

The endpoint that [`Combobox::searchUsing()`](/fields/combobox#searchusing-closure-callback) fields load options from.

| Key | Default | Purpose |
| --- | ------- | ------- |
| `uri` | `'_inertia-forms/search'` | The path of the `POST` endpoint (route name `inertia-forms.search`). |
| `middleware` | `['web', 'throttle:60,1']` | Middleware for the endpoint. Add `'auth'` when the options are private. |

Every request carries an encrypted form class, so only your form classes can be searched, and each form's `authorize()` checks still run.

### `wizard`

The endpoint that [wizard](/concepts/wizard) forms call when the user presses **Continue**, to check the current step before moving on.

| Key | Default | Purpose |
| --- | ------- | ------- |
| `uri` | `'_inertia-forms/validate-step'` | The path of the `POST` endpoint (route name `inertia-forms.validate-step`). |
| `middleware` | `['web', 'throttle:60,1']` | Middleware for the endpoint. Add `'auth'` when the wizard is only for signed-in users. |

Like the search endpoint, each request carries an encrypted form class. The endpoint only answers for wizard forms, runs the form's `authorize()` check, validates the fields of one step, and returns `204` or the usual `422` errors. It never saves anything.

A busy wizard sends one request per **Continue**, so raise the `throttle` limit if users hit it.
