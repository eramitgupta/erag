import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMarkdownRenderer, defineLoader, type SiteConfig } from 'vitepress';

export type DemoFramework = 'vue' | 'react' | 'svelte';

export interface DemoCodeFile {
    name: string;
    html: string;
    /** Only shown for this frontend; backend files have none. */
    framework?: DemoFramework;
}

/**
 * Highlighted source files per demo, keyed by the demo slug (e.g. `event-session`).
 */
export type DemoCode = Record<string, DemoCodeFile[]>;

declare const data: DemoCode;
export { data };

const here = dirname(fileURLToPath(import.meta.url));
const demoDir = resolve(here, '../../../demo');

/**
 * Where each framework's custom field components live, and their file extension.
 */
const componentSources: Record<DemoFramework, { dir: string; extension: string; language: string }> = {
    vue: { dir: resolve(here, 'components/fields'), extension: 'vue', language: 'vue' },
    react: { dir: resolve(demoDir, 'components/react'), extension: 'tsx', language: 'tsx' },
    svelte: { dir: resolve(demoDir, 'components/svelte'), extension: 'svelte', language: 'svelte' },
};

const fence = (language: string, code: string): string => `\`\`\`${language}\n${code.trimEnd()}\n\`\`\``;

const controllerCode = (name: string): string => `<?php

namespace App\\Http\\Controllers;

use App\\Forms\\${name}Form;
use Erag\\InertiaForms\\Attributes\\Validate;
use Illuminate\\Http\\RedirectResponse;
use Inertia\\Inertia;
use Inertia\\Response;

class ${name}Controller extends Controller
{
    public function create(): Response
    {
        return Inertia::render('${name}', [
            'form' => ${name}Form::make(),
        ]);
    }

    public function store(#[Validate] ${name}Form $form): RedirectResponse
    {
        // Only visible, authorized fields are validated and returned.
        $data = $form->validated();

        // Save $data...

        return back();
    }
}
`;

const routesCode = (name: string, url: string): string => `<?php

use App\\Http\\Controllers\\${name}Controller;
use Illuminate\\Support\\Facades\\Route;

Route::get('${url}', [${name}Controller::class, 'create']);
Route::post('${url}', [${name}Controller::class, 'store']);
`;

function pageCode(framework: DemoFramework, name: string, fields: string[]): string {
    const list = fields.join(', ');

    if (framework === 'vue') {
        const imports = fields.map((field) => `import ${field} from '@/components/${field}.vue';\n`).join('');
        const components = fields.length ? ` :components="{ ${list} }"` : '';

        return `<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';
${imports}
defineProps<{ form: FormSchema }>();
</script>

<template>
    <Form :form="form"${components} />
</template>
`;
    }

    if (framework === 'react') {
        const imports = fields.map((field) => `import { ${field} } from '@/components/${field}';\n`).join('');
        const registry = fields.length ? `\nconst components = { ${list} };\n` : '';
        const components = fields.length ? ' components={components}' : '';

        return `import { Form, type FormSchema } from '@erag/inertia-forms-react';
${imports}${registry}
export default function ${name}({ form }: { form: FormSchema }) {
    return <Form form={form}${components} />;
}
`;
    }

    const imports = fields.map((field) => `    import ${field} from '@/components/${field}.svelte';\n`).join('');
    const components = fields.length ? ` components={{ ${list} }}` : '';

    return `<script lang="ts">
    import { Form, type FormSchema } from '@erag/inertia-forms-svelte';
${imports}
    let { form }: { form: FormSchema } = $props();
</script>

<Form {form}${components} />
`;
}

export default defineLoader({
    watch: ['../../../demo/**/*', './components/fields/*.vue'],
    async load(): Promise<DemoCode> {
        const config = (globalThis as { VITEPRESS_CONFIG?: SiteConfig }).VITEPRESS_CONFIG!;
        const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base, config.logger);
        const file = (name: string, language: string, code: string, framework?: DemoFramework): DemoCodeFile => ({
            name,
            html: md.render(fence(language, code)),
            ...(framework ? { framework } : {}),
        });
        const code: DemoCode = {};

        for (const formFile of readdirSync(demoDir).filter((entry) => entry.endsWith('Form.php'))) {
            const source = readFileSync(resolve(demoDir, formFile), 'utf8');
            const name = basename(formFile, 'Form.php');
            const key = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            const url = source.match(/\$actionUrl = '([^']+)'/)?.[1] ?? `/${key}`;
            const fields = [...source.matchAll(/^use App\\Forms\\Fields\\(\w+);$/gm)].map(([, field]) => field!);
            const files: DemoCodeFile[] = [
                file(formFile, 'php', source),
                ...fields.map((field) =>
                    file(`${field}.php`, 'php', readFileSync(resolve(demoDir, 'Fields', `${field}.php`), 'utf8')),
                ),
                file(`${name}Controller.php`, 'php', controllerCode(name)),
                file('web.php', 'php', routesCode(name, url)),
            ];

            for (const framework of ['vue', 'react', 'svelte'] as const) {
                const { dir, extension, language } = componentSources[framework];
                files.push(file(`${name}.${extension}`, language, pageCode(framework, name, fields), framework));

                for (const field of fields) {
                    const component = resolve(dir, `${field}.${extension}`);
                    if (existsSync(component)) {
                        files.push(file(`${field}.${extension}`, language, readFileSync(component, 'utf8'), framework));
                    }
                }
            }

            code[key] = files;
        }

        return code;
    },
});
