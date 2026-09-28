---
title: 'Artisan Command & Config'
description: 'Generate form classes with php artisan make:form, customize the stub, and publish the inertia-forms config file.'
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

It does three things:

1. Publishes the config to `config/inertia-forms.php` (see [Configuration](#configuration)).
2. Publishes the form stub to `stubs/inertia-form.stub` (see [Customizing the stub](#customizing-the-stub)).
3. Prints the next steps: the npm package to install, the Tailwind `@source` line, and `make:form`. It picks the package from the Inertia adapter in your `package.json` (`@inertiajs/vue3`, `@inertiajs/react` or `@inertiajs/svelte`) and lists all three when it finds none.

```
   INFO  Installing Inertia Forms.

  config/inertia-forms.php ............................. PUBLISHED
  stubs/inertia-form.stub .............................. PUBLISHED
```

Files that already exist are kept and shown as `SKIPPED`. Pass `--force` to replace them with the package's current version:

```bash
php artisan erag:install-inertia-forms --force
```

| Option | Description |
| ------ | ----------- |
| `--force` | Overwrite files that were already published. |

## `make:form`

Generate a new form class:

```bash
php artisan make:form CreateUserForm
```

This creates `app/Forms/CreateUserForm.php` in the `App\Forms` namespace:

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

### Customizing the stub

Publish the stub to change what new forms look like:

```bash
php artisan vendor:publish --tag=inertia-forms-stubs
```

This copies it to `stubs/inertia-form.stub` in your project. When that file exists, `make:form` uses it instead of the package's stub. The placeholders <code v-pre>{{ namespace }}</code> and <code v-pre>{{ class }}</code> are replaced when the file is generated.

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
