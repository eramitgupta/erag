---
title: Laravel Inertia Conditional Forms
headline: "Permissions and Conditional Fields in a Laravel Inertia Form Builder"
description: Build secure Laravel Inertia conditional forms with server-side field visibility, authorization, conditional validation and reusable PHP form classes.
date: 2026-10-11
package: laravel-inertia-forms
category: Tutorial
tags: [laravel, inertia, forms, permissions, authorization, vue]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/inertia-forms-permissions-conditional-fields.md
</div>

Laravel Inertia conditional forms are easy to make look correct in the browser. A Vue component can hide a toggle when a user lacks permission, and a `v-if` can show a date field only when a status is selected. Neither one is a security boundary.

If a field controls billing, publishing, ownership or access, the server must decide whether the field exists and whether its submitted value can be accepted. The frontend should reflect that decision, not invent it.

Laravel Inertia Forms gives you a useful place for both concerns: the PHP form class. It can describe fields, visibility, conditional rules and authorization while the Inertia page renders the schema for Vue, React or Svelte.

## Authorization and visibility answer different questions

There are two kinds of conditions in a form:

- **Authorization:** may this user use this field at all?
- **Visibility:** is this field relevant for the answer currently selected?

For example, an editor may be allowed to publish posts, but a publish date is relevant only when the status is `scheduled`. Those conditions should not be collapsed into one frontend check.

The package supports authorization on fields and fieldsets. A field that fails authorization is removed from the serialized schema and receives no validation rules:

```php
Toggle::make('featured')
    ->label('Feature this post')
    ->help('Featured posts appear on the home page.')
    ->authorize(fn (): bool => auth()->user()?->can('feature', Post::class) ?? false),
```

The field is not merely disabled with CSS. A user who lacks the ability does not receive the control or its initial value in the page payload.

The controller or policy must still protect the action itself. Form authorization improves the schema and the user experience; it does not replace a policy on the update route.

## Build a form with an authorized field

Here is a small post form with a permission-aware featured toggle:

```php
class PostForm extends Form
{
    protected ?string $actionRoute = 'posts.store';

    public function fields(): array
    {
        return [
            Fieldset::make('Content')->fields([
                TextInput::make('title')->required()->maxLength(160),
                Textarea::make('body')->required()->rows(8),
            ]),
            Fieldset::make('Publishing')->fields([
                Radio::make('status')
                    ->buttons()
                    ->default('draft')
                    ->required()
                    ->options([
                        'draft' => 'Draft',
                        'published' => 'Published',
                    ]),
                Toggle::make('featured')
                    ->authorize(fn (): bool => auth()->user()?->can('feature', Post::class) ?? false),
            ]),
            Submit::make('Save post'),
        ];
    }
}
```

The authorization closure is evaluated when the form is serialized and validated. That late evaluation matters because the current authenticated user is available at request time, not necessarily when the class file is loaded.

You can also authorize an entire fieldset when every field inside it has the same permission:

```php
Fieldset::make('Internal controls')
    ->authorize(fn (): bool => auth()->user()?->isAdmin() ?? false)
    ->fields([
        Toggle::make('is_verified'),
        Combobox::make('plan')->options([
            'free' => 'Free',
            'pro' => 'Pro',
        ]),
    ]),
```

This keeps internal fields out of the browser instead of relying on a client-side role check.

## Add a conditional field with `visibleWhen`

Now add a publish date that matters only for scheduled posts:

```php
Radio::make('status')
    ->buttons()
    ->required()
    ->default('draft')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
    ]),

DatePicker::make('publish_at')
    ->withTime()
    ->minDate(now())
    ->required()
    ->visibleWhen('status', 'scheduled'),
```

The field appears when the current form value matches the condition. When it is hidden, its required rule does not block a draft submission and its value is left out of the validated result. If you want the value cleared as soon as the field disappears, use the package’s `clearWhenHidden()` option.

This is better than writing a separate `required_if` rule in a controller that can drift away from what the frontend displays. The condition and its validation behavior are described together.

## Do not trust a hidden field

A malicious client can still send `featured=true` or `publish_at` in a handcrafted request. Build the model from the form’s validated data and keep the policy boundary on the server:

```php
public function update(Request $request, Post $post): RedirectResponse
{
    $this->authorize('update', $post);

    $data = PostForm::make()->bind($post)->validate($request);

    $post->update($data);

    return to_route('posts.index');
}
```

An unauthorized field has no rules, so its submitted value is ignored by the form’s `validated()` result. The policy check on the controller also prevents an unauthorized user from reaching the update action in the first place.

For sensitive actions, add a model policy rather than relying only on the form class:

```php
public function update(User $user, Post $post): bool
{
    return $user->id === $post->author_id || $user->can('manage-posts');
}
```

The form controls what the user sees. The policy controls what the user may do. Keeping both makes the code easier to review.

## Keep the controller and page simple

The controller can pass the schema to an Inertia page:

```php
public function edit(Post $post): Response
{
    $this->authorize('update', $post);

    return Inertia::render('Posts/Form', [
        'form' => PostForm::make()
            ->route('posts.update', $post)
            ->bind($post),
    ]);
}
```

The Vue page renders the schema instead of repeating every conditional rule:

```vue
<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();
</script>

<template>
    <main class="mx-auto max-w-3xl p-6">
        <Form :form="form" />
    </main>
</template>
```

The same form schema can be rendered by the React adapter. The page does not need to know whether the current user can feature a post because the backend has already removed that field when appropriate.

## Think about values when a field becomes hidden

Suppose an administrator selects `scheduled`, enters a date and then switches back to `draft`. There are two reasonable behaviors:

1. Keep the date in the browser so switching back restores the draft value.
2. Clear it immediately because a draft should not carry scheduling data.

Choose based on the domain. For a small form, preserving the value can feel friendly. For a financial or publishing workflow, clearing hidden values avoids accidental reuse. The package’s visibility behavior and `clearWhenHidden()` option let you make that choice explicit.

The server should still normalize the final record. If a post is saved as `draft`, set `publish_at` to `null` even if an old value exists in the database. Conditional UI does not automatically clean up historical data.

## Avoid permissions hidden inside frontend props

A common first attempt is to pass `canFeature` to Vue and write:

```vue
<Toggle v-if="canFeature" name="featured" />
```

That can be useful for a custom screen, but it duplicates the permission rule and still requires server validation. In a form builder, putting the authorization closure beside the field keeps the schema, initial data and validation behavior aligned.

If the permission is used outside the form, share the underlying policy or ability name rather than copying a boolean calculation into several controllers and components.

## Authorize the whole form when the action is restricted

Some screens should not render for a user at all. In that case, authorize the route and the form before serializing it:

```php
public function edit(Request $request, BillingSettings $settings): Response
{
    $this->authorize('update', $settings);

    return Inertia::render('Billing/Edit', [
        'form' => BillingForm::make()
            ->authorize($request->user()->can('update-billing'))
            ->bind($settings),
    ]);
}
```

Field-level authorization is useful when a user can access the screen but only some controls. Form-level authorization is clearer when the entire action is restricted. Configure the package to throw on an unauthorized form if an empty schema would be misleading. In both cases, keep the policy on the route so a direct request cannot bypass the page.

## Test authorized and unauthorized behavior

Conditional forms need tests at two levels. First, verify the serialized schema:

- an editor without the ability does not receive `featured`;
- an authorized editor does receive it;
- a draft does not include a required `publish_at` field;
- a scheduled post includes the date field.

Then test the request:

- a user without update permission gets a 403;
- a forged `featured` value cannot change the post;
- a draft does not require `publish_at`;
- a scheduled post cannot be saved without a date;
- hidden values are omitted or cleared according to your policy.

These tests protect behavior that a browser screenshot cannot prove. They also make future permission changes safer because the expected schema is explicit.

## Common Laravel Inertia conditional form mistakes

### Hiding a field with CSS

CSS changes appearance, not authorization. The value can still be submitted and the field may still be present in the page data.

### Validating only in the browser

Client-side conditions improve feedback, but the request must be validated again in Laravel. A user can skip every JavaScript check.

### Adding `required` to every possible field

A hidden field should not block an unrelated workflow. Put the visibility condition and the field rules in the same form definition.

### Reusing one permission check everywhere

A user may edit a post but not feature it, or manage a workspace but not change billing. Use the actual policy ability for each action.

### Forgetting old data

When a field becomes hidden or a status changes, decide how existing database values are normalized. Form visibility does not update rows by itself.

Laravel Inertia conditional forms work well when they describe the same truth at every layer: policies decide access, the form class serializes only authorized fields, visibility controls relevant fields and Laravel validates the final request. That gives users a clean interface without treating the browser as a security system.
