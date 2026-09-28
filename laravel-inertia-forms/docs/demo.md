---
title: 'Live Demo'
aside: false
description: 'Try real Laravel form classes rendered by the Inertia Forms Vue component: switch forms, change the accent color, and inspect the submitted data.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/demo.md
</div>


<div class="doc-category">Overview</div>

# Live Demo

Every form below is a real PHP form class from this page, serialized with `json_encode()` and rendered by the Vue `<Form>` component. Pick a form, change the accent color, fill it in, and press submit.

<FormPlayground />

::: info What happens on submit
The demo passes an `onBeforeSubmit` callback to `<Form>`. It checks required fields in the browser and returns `false`, so nothing is sent to a server. In your app, the same form posts to Laravel and the `#[Validate]` attribute validates it on the server.
:::

## The form classes

Fifteen form classes: one that shows every field type, one built from custom fields, three that show the newer features, and ten real-world forms with conditional fields.

- **Onboarding wizard** is a three-step [wizard](/concepts/wizard): each fieldset is a step with an icon, and Continue checks the step on the server. It also uses a [Slug](/fields/slug), an [OTP Input](/fields/otp-input) and a [Callout](/fields/display#callout).
- **Landing page** combines a [Slug](/fields/slug), a structured [Link](/fields/link), [Blocks](/fields/blocks), a [Repeater](/fields/repeater), [display helpers](/fields/display), and two [Submit](/fields/submit#intent-string-value-string-key-intent) buttons with different intents.
- **Support chat** is a single [Composer](/fields/composer) with attachments and quick replies. It uses `resetOnSuccess`, so the box clears after each send.

::: code-group

<<< ../demo/AllFieldsForm.php [AllFieldsForm.php]

<<< ../demo/CustomFieldsForm.php [CustomFieldsForm.php]

<<< ../demo/OnboardingWizardForm.php [OnboardingWizardForm.php]

<<< ../demo/LandingPageForm.php [LandingPageForm.php]

<<< ../demo/SupportChatForm.php [SupportChatForm.php]

<<< ../demo/ProductLaunchForm.php [ProductLaunchForm.php]

<<< ../demo/ProjectKickoffForm.php [ProjectKickoffForm.php]

<<< ../demo/SupportTriageForm.php [SupportTriageForm.php]

<<< ../demo/EventSessionForm.php [EventSessionForm.php]

<<< ../demo/CampaignPlanForm.php [CampaignPlanForm.php]

<<< ../demo/HiringPipelineForm.php [HiringPipelineForm.php]

<<< ../demo/SubscriptionBillingForm.php [SubscriptionBillingForm.php]

<<< ../demo/ClinicIntakeForm.php [ClinicIntakeForm.php]

<<< ../demo/PropertyBookingForm.php [PropertyBookingForm.php]

<<< ../demo/EditorialCalendarForm.php [EditorialCalendarForm.php]

:::

## Custom fields in this demo

The **Custom fields** form uses three field types that are not part of the package: `Rating`, `CodeInput` and `QuantityStepper`. Each one is a small PHP class plus a frontend component registered through the `components` prop. See [Custom Fields](/frontend/custom-fields) for the full guide.

::: code-group

<<< ../demo/Fields/Rating.php [Rating.php]

<<< ../demo/Fields/CodeInput.php [CodeInput.php]

<<< ../demo/Fields/QuantityStepper.php [QuantityStepper.php]

<<< ./.vitepress/theme/components/fields/Rating.vue [Rating.vue]

<<< ./.vitepress/theme/components/fields/CodeInput.vue [CodeInput.vue]

<<< ./.vitepress/theme/components/fields/QuantityStepper.vue [QuantityStepper.vue]

:::

```vue
<Form :form="form" :components="{ Rating, CodeInput, QuantityStepper }" />
```

## Render it in your app

Pass the form from a controller, then render it with one component. The `accent` prop sets the theme color, and you can also set it in PHP with `->accent('#059669')`.

::: code-group

```php [Controller]
use App\Forms\EventSessionForm;
use Inertia\Inertia;

public function create()
{
    return Inertia::render('EventSession', [
        'form' => EventSessionForm::make(),
    ]);
}
```

```vue [Vue]
<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();
</script>

<template>
    <Form :form="form" accent="#059669" />
</template>
```

```tsx [React]
import { Form, type FormSchema } from '@erag/inertia-forms-react';

export default function EventSession({ form }: { form: FormSchema }) {
    return <Form form={form} accent="#059669" />;
}
```

```svelte [Svelte]
<script lang="ts">
    import { Form, type FormSchema } from '@erag/inertia-forms-svelte';

    let { form }: { form: FormSchema } = $props();
</script>

<Form {form} accent="#059669" />
```

:::

Next, follow the [Quick Start](/guide/quick-start) to build your first form, or read about [styling](/frontend/styling).
