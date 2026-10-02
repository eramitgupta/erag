<?php

/**
 * Builds the live previews for the <Example> blocks on the docs pages.
 *
 * Every examples/<page>/<name>.php file holds the code shown on the page
 * between `// #region example` and `// #endregion example`. That code is either
 * fields (one field, a fieldset or an array of them) or a Form class.
 * It is run here and the serialized form is written to
 * docs/.vitepress/theme/examples/<page>/<name>.json.
 *
 * It also writes the package's icon set (`IconSetEnum`, grouped by
 * category) to docs/.vitepress/theme/icon-set.json for the Icons gallery.
 *
 * Run from docs/laravel-inertia-forms with a local InertiaForms checkout:
 * php examples/export.php ../../InertiaForms
 */

use Erag\InertiaForms\Form;
use Erag\InertiaForms\Support\IconSetEnum;
use Orchestra\Testbench\Foundation\Application;

$package = rtrim($argv[1] ?? __DIR__.'/../../../InertiaForms', '/');

require $package.'/vendor/autoload.php';

$app = Application::create(basePath: Orchestra\Testbench\default_skeleton_path());
$app['config']->set('app.key', 'base64:'.base64_encode(str_repeat('e', 32)));
$app->register(Erag\InertiaForms\InertiaFormsServiceProvider::class);

/**
 * Wraps loose fields in a form for serialization.
 */
final class DocsExampleForm extends Form
{
    protected ?string $actionUrl = '/example';

    /**
     * @param  array<int, mixed>  $items
     */
    public function __construct(private array $items = []) {}

    public function fields(): array
    {
        return $this->items;
    }
}

$sourceDir = __DIR__;
$targetDir = realpath(__DIR__.'/../docs/.vitepress/theme').'/examples';
$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($sourceDir, FilesystemIterator::SKIP_DOTS));
$written = 0;
$failed = 0;

foreach ($files as $file) {
    $path = $file->getPathname();

    if ($file->getExtension() !== 'php' || $path === __FILE__) {
        continue;
    }

    $id = substr($path, strlen($sourceDir) + 1, -4);

    try {
        $schema = exampleSchema($path, $id);
    } catch (Throwable $exception) {
        fwrite(STDERR, "✗ {$id}: {$exception->getMessage()}\n");
        $failed++;

        continue;
    }

    $target = "{$targetDir}/{$id}.json";

    if (! is_dir(dirname($target))) {
        mkdir(dirname($target), 0755, true);
    }

    file_put_contents($target, json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE).PHP_EOL);
    $written++;
}

file_put_contents(
    realpath(__DIR__.'/../docs/.vitepress/theme').'/icon-set.json',
    json_encode(IconSetEnum::grouped(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE).PHP_EOL,
);

echo "Wrote {$written} example(s) and the icon set".($failed ? ", {$failed} failed" : '').".\n";
exit($failed ? 1 : 0);

/**
 * @return array<string, mixed>
 */
function exampleSchema(string $path, string $id): array
{
    $source = (string) file_get_contents($path);

    if (! preg_match('/\/\/ #region example\R(.*?)\R\s*\/\/ #endregion example/s', $source, $region)) {
        throw new RuntimeException('Missing // #region example ... // #endregion example.');
    }

    $code = $region[1];
    preg_match_all('/^use\s+[^;]+;\s*$/m', $code, $uses);
    $body = trim((string) preg_replace('/^use\s+[^;]+;\s*$\R?/m', '', $code));
    $namespace = 'DocsExamples\\E'.md5($id);
    $prelude = "namespace {$namespace};\n".implode("\n", $uses[0])."\n";

    if (preg_match('/^(?:final\s+)?class\s+(\w+)\s+extends\s+Form\b/m', $body, $class)) {
        // Code after the class (e.g. `ProfileForm::make()->bind([...])`) builds the form.
        if (preg_match('/^(.*\n\})\s*\n(\S.*?);?\s*$/s', $body, $parts)) {
            $form = eval($prelude.$parts[1]."\nreturn ".$parts[2].';');
        } else {
            eval($prelude.$body);
            $form = ($namespace.'\\'.$class[1])::make();
        }
    } else {
        // Statements before a blank line (e.g. `Icon::register(...)`) run first;
        // the last block is the fields expression.
        $statements = '';

        if (preg_match('/^(.*;)\s*\R\s*\R(\S.*)$/s', $body, $parts)) {
            [$statements, $body] = [$parts[1], $parts[2]];
        }

        $result = eval($prelude.$statements."\nreturn ".rtrim($body, "; \n").';');
        $form = $result instanceof Form ? $result : new DocsExampleForm(is_array($result) ? $result : [$result]);
    }

    $schema = $form->toArray();
    \Erag\InertiaForms\Support\Icon::flushRegistered();

    // The docs are static: wizard steps move on without the server check.
    if (($schema['wizard'] ?? null) !== null) {
        $schema['wizard']['validateUrl'] = null;
        $schema['wizard']['token'] = null;
    }

    return $schema;
}
