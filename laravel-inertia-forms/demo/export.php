<?php

/**
 * Regenerates the JSON schemas used by the live demo on the docs site.
 *
 * Run from docs/laravel-inertia-forms with a local InertiaForms checkout:
 * php demo/export.php ../../InertiaForms
 */

use Erag\InertiaForms\InertiaFormsServiceProvider;
use Orchestra\Testbench\Foundation\Application;

$package = rtrim($argv[1] ?? __DIR__.'/../../../InertiaForms', '/');

require $package.'/vendor/autoload.php';

$app = Application::create(basePath: Orchestra\Testbench\default_skeleton_path());
$app['config']->set('app.key', 'base64:'.base64_encode(str_repeat('d', 32)));
$app->register(InertiaFormsServiceProvider::class);

$forms = [
    'all-fields' => 'AllFieldsForm',
    'custom-fields' => 'CustomFieldsForm',
    'onboarding-wizard' => 'OnboardingWizardForm',
    'landing-page' => 'LandingPageForm',
    'support-chat' => 'SupportChatForm',
    'product-launch' => 'ProductLaunchForm',
    'project-kickoff' => 'ProjectKickoffForm',
    'support-triage' => 'SupportTriageForm',
    'event-session' => 'EventSessionForm',
    'campaign-plan' => 'CampaignPlanForm',
    'hiring-pipeline' => 'HiringPipelineForm',
    'subscription-billing' => 'SubscriptionBillingForm',
    'clinic-intake' => 'ClinicIntakeForm',
    'property-booking' => 'PropertyBookingForm',
    'editorial-calendar' => 'EditorialCalendarForm',
];

$target = __DIR__.'/../docs/.vitepress/theme/demo';

if (! is_dir($target)) {
    mkdir($target, 0755, true);
}

foreach (glob(__DIR__.'/Fields/*.php') as $field) {
    require_once $field;
}

foreach ($forms as $key => $class) {
    require_once __DIR__."/{$class}.php";

    $form = ("App\\Forms\\{$class}")::make();
    $schema = $form->toArray();

    // The docs site is static: wizard steps move on without the server check.
    if ($schema['wizard'] !== null) {
        $schema['wizard']['validateUrl'] = null;
        $schema['wizard']['token'] = null;
    }

    file_put_contents(
        "{$target}/{$key}.json",
        json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE).PHP_EOL,
    );

    echo "Wrote {$key}.json\n";
}
