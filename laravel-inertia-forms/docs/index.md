---
title: "Laravel Inertia Forms - PHP Forms for Vue, React & Svelte"
titleTemplate: false
description: 'Define Laravel forms in PHP and render them in Inertia with one Form component for Vue, React, or Svelte. Validation, conditional fields, and uploads included.'
layout: home

hero:
    name: 'Laravel Inertia Forms'
    text: 'Build Inertia forms in PHP.'
    tagline: 'Define fields, layout and validation in one Laravel class. Render it in Vue, React or Svelte with a single component, with custom pickers, conditional fields and server validation built in.'
    actions:
        - theme: brand
          text: Get Started
          link: /guide/introduction.html
        - theme: alt
          text: Live Demo
          link: /demo.html
        - theme: alt
          text: GitHub
          link: https://github.com/erag-labs/laravel-Inertia-forms
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/index.md
</div>


<section class="inertia-features home-demo" aria-labelledby="home-demo-heading">
<div class="inertia-features-intro">
  <div class="bg-points" aria-hidden="true"></div>
  <div class="inertia-features-intro-content">
    <div class="features-badge">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 3l14 9-14 9V3Z" />
      </svg>
      <span>Live demo</span>
    </div>
    <h2 id="home-demo-heading">Try a real form right here</h2>
    <p>These forms come from PHP classes and render with the Vue component. Switch forms, change the accent color, and submit to see the data.</p>
  </div>
</div>

<div class="home-demo-body">
  <FormPlayground initial="event-session" />
  <p class="home-demo-more"><a href="./demo.html">Open the full demo and the PHP source →</a></p>
</div>
</section>

<section class="inertia-features" aria-labelledby="features-heading">
<div class="inertia-features-intro">
  <div class="bg-points" aria-hidden="true"></div>
  <div class="inertia-features-intro-content">
    <div class="features-badge">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M4.5 0.5H0.5V4.5H4.5V0.5Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M11.5 0.5H7.5V4.5H11.5V0.5Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4.5 7.5H0.5V11.5H4.5V7.5Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M11.5 7.5H7.5V11.5H11.5V7.5Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>Features</span>
    </div>
    <h2 id="features-heading">Forms without the wiring</h2>
    <p>Stop repeating labels, inputs, rules, and error handling in two places. One PHP class drives the page and the validation.</p>
  </div>
</div>

<div class="inertia-feature-stats" aria-label="Package capabilities">
  <div class="small-square small-square-top max-md:hidden"></div>
  <div class="small-square small-square-bottom max-md:hidden"></div>
  <div class="small-square small-square-right-top max-md:hidden"></div>
  <div class="small-square small-square-right-bottom max-md:hidden"></div>

  <div class="stat-cell"><strong>1</strong><span>PHP class per form</span></div>
  <div class="stat-cell"><strong>22</strong><span>Built-in fields</span></div>
  <div class="stat-cell"><strong>3</strong><span>Frontend frameworks</span></div>
  <div class="stat-cell"><strong>13</strong><span>Visibility operators</span></div>
</div>

<div class="inertia-feature-grid">
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4h7l3 3v13H7z"/><path d="M14 4v4h4"/><path d="M9 13h6"/><path d="M9 17h4"/></svg></div>
  <span class="inertia-feature-badge">ONE CLASS</span>
  <h3>Forms in PHP</h3>
  <p>Fields, fieldsets, the submit route, and validation live together in a form class you can reuse and test.</p>
</article>
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 8 3 12l4 4"/><path d="m17 8 4 4-4 4"/><path d="m14 4-4 16"/></svg></div>
  <span class="inertia-feature-badge">VUE REACT SVELTE</span>
  <h3>One component</h3>
  <p>Render the whole form with <code>&lt;Form&gt;</code>. The same PHP class works with Vue, React, and Svelte packages.</p>
</article>
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/></svg></div>
  <span class="inertia-feature-badge">RULES FROM FIELDS</span>
  <h3>Validation built in</h3>
  <p><code>required()</code>, <code>email()</code>, options, and file types become Laravel rules. Validate with <code>#[Validate]</code>.</p>
</article>
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></div>
  <span class="inertia-feature-badge">VISIBLEWHEN</span>
  <h3>Conditional fields</h3>
  <p>Show fields based on other values. Hidden fields are skipped by validation, so the browser and server agree.</p>
</article>
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></div>
  <span class="inertia-feature-badge">AUTHORIZEDWHEN</span>
  <h3>Authorization</h3>
  <p>Remove fields, fieldsets, or a whole form for users who should not see them. Their rules disappear too.</p>
</article>
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg></div>
  <span class="inertia-feature-badge">BIND()</span>
  <h3>Model binding</h3>
  <p>Fill edit forms from an Eloquent model or array, including nested paths, dates, enums, and booleans.</p>
</article>
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></svg></div>
  <span class="inertia-feature-badge">MULTIPART</span>
  <h3>File uploads</h3>
  <p>Drag and drop, image previews, size and type rules. Update forms with files are sent the way Laravel expects.</p>
</article>
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="8" height="7" rx="1.5"/><rect x="13" y="4" width="8" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/></svg></div>
  <span class="inertia-feature-badge">COLUMNS</span>
  <h3>Fieldsets and grids</h3>
  <p>Group fields with legends and descriptions, lay them out in columns, and span wide fields across the row.</p>
</article>
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg></div>
  <span class="inertia-feature-badge">SEARCHABLE</span>
  <h3>Combobox and search</h3>
  <p>One dropdown for single and multiple values, with local search or options loaded from the server, fed by arrays, collections, or enums.</p>
</article>
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v3"/><path d="M12 18v3"/><path d="M4 12H3"/><path d="M21 12h-1"/><circle cx="12" cy="12" r="5"/></svg></div>
  <span class="inertia-feature-badge">TAILWIND 4</span>
  <h3>Styled and themeable</h3>
  <p>Clean Tailwind CSS 4 classes with dark mode. Add your own classes to fields, fieldsets, and the form.</p>
</article>
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg></div>
  <span class="inertia-feature-badge">YOUR COMPONENTS</span>
  <h3>Custom fields</h3>
  <p>Add a PHP field class and register its Vue, React, or Svelte component. It gets labels, errors, and layout for free.</p>
</article>
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M5 9h14"/><path d="M12 9v5"/><path d="m8 21 4-7 4 7"/></svg></div>
  <span class="inertia-feature-badge">A11Y</span>
  <h3>Accessible by default</h3>
  <p>Labels, <code>aria</code> attributes, keyboard support, and focus moves to the first error after a failed submit.</p>
</article>

<div class="small-square small-square-bottom max-md:hidden"></div>
<div class="small-square small-square-right-bottom max-md:hidden"></div>
</div>
</section>

<section class="home-split" aria-labelledby="home-ai-heading">
<div class="home-split-copy">
  <div class="features-badge">
    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>
    <span>Laravel Boost + AI agents</span>
  </div>
  <h2 id="home-ai-heading">Your AI agent already knows the form API.</h2>
  <p class="home-split-lead">The package ships Laravel Boost guidelines and a skill. After <code>php artisan boost:install</code>, your agent knows the form class, so “an edit profile form with an avatar” comes back as one PHP class, not a page of inputs, state and error handling.</p>
  <div class="home-split-points">
    <div>
      <h3>Less code to generate</h3>
      <p>A form is a short list of fields. That is less for an agent to write and less for you to review, and validation comes with it.</p>
    </div>
    <div>
      <h3>Docs written for agents too</h3>
      <p>Every page has a Markdown version and <a href="/laravel-inertia-forms/llms.txt">llms.txt</a> lists them all, so agents read the real API instead of guessing.</p>
    </div>
  </div>
  <p class="home-split-tools"><span>Laravel Boost</span><span>Claude Code</span><span>Cursor</span><span>Codex</span><span>Gemini CLI</span><span>GitHub Copilot</span></p>
</div>
<div class="home-split-art">
  <img src="/home-ai-agents.svg" alt="A prompt card above a PHP form class, next to the form it renders" width="640" height="480" loading="lazy" />
</div>
</section>

<section class="home-split home-split-reverse" aria-labelledby="home-core-heading">
<div class="home-split-copy">
  <div class="features-badge">
    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>
    <span>Shared core</span>
  </div>
  <h2 id="home-core-heading">Written once. Rendered three ways.</h2>
  <p class="home-split-lead">Visibility rules, dates and times, the combobox search, wizard steps, file handling and every Tailwind class live in one TypeScript core. The Vue, React and Svelte packages are thin renderers on top of it, so a form behaves the same in each.</p>
  <div class="home-split-zero" aria-label="What the packages depend on">
    <div><strong>0</strong><span>runtime dependencies</span><small>Only Inertia and your framework, as peers.</small></div>
    <div><strong>0</strong><span>UI kits</span><small>Every control is built from plain elements.</small></div>
    <div><strong>0</strong><span>icon libraries</span><small>210 icons drawn for the package.</small></div>
    <div><strong>0</strong><span>date libraries</span><small>Calendar and time math live in the core.</small></div>
  </div>
</div>
<div class="home-split-art">
  <img src="/home-shared-core.svg" alt="Vue, React and Svelte renderers floating above one shared core" width="640" height="480" loading="lazy" />
</div>
<div class="home-split-nolibs">
  <p>Nothing underneath. Every control is ours.</p>
  <ul aria-label="Libraries the packages do not use"><li>Headless UI</li><li>Radix</li><li>Reka UI</li><li>Bits UI</li><li>React Aria</li><li>Floating UI</li><li>Popper.js</li><li>VueUse</li><li>date-fns</li><li>Day.js</li><li>Flatpickr</li><li>Lucide</li></ul>
</div>
</section>

<section class="home-saas" aria-labelledby="home-sponsors-heading">
<div class="home-sponsors-intro">
  <div class="features-badge">
    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11z"/></svg>
    <span>Sponsors</span>
  </div>
  <h2 id="home-sponsors-heading">Backed by our sponsors</h2>
  <p>Inertia Forms is free and open source. Sponsors keep it maintained, documented and growing.</p>
</div>
<div class="home-saas-card">
  <div class="home-saas-copy">
    <span class="home-saas-eyebrow">Featured sponsor</span>
    <h3 class="home-saas-title">Building a SaaS? Start with SaaS Laravel.</h3>
    <p>Production-ready, multi-tenant starter kits for Laravel 13 and Inertia 3, in Vue, React or Svelte. Tenancy, sign-in with passkeys and two-factor, roles, translations and an admin dashboard come ready, so you start on your own product on day one.</p>
    <div class="home-saas-actions">
      <a class="home-saas-primary" href="https://saas-laravel.com" target="_blank" rel="noopener">Explore SaaS Laravel<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>
      <a class="home-saas-secondary" href="https://saas-laravel.com/pricing.html" target="_blank" rel="noopener">See pricing</a>
    </div>
  </div>
  <ul class="home-saas-features" aria-label="What SaaS Laravel includes"><li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Multi-tenancy, a database per tenant</li><li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Passkeys and two-factor sign-in</li><li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Roles and permissions</li><li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>17 languages</li><li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Per-domain branding</li><li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Admin dashboard</li></ul>
</div>
<div class="home-sponsor-cta">
  <div>
    <strong>Your company here</strong>
    <span>Support the project and reach Laravel developers building with Inertia.</span>
  </div>
  <a href="https://github.com/sponsors/eramitgupta" target="_blank" rel="noopener">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11z"/></svg>
    Become a sponsor
  </a>
</div>
</section>

<section class="home-flow" aria-labelledby="home-flow-heading">
  <div class="small-square small-square-top max-md:hidden"></div>
  <div class="small-square small-square-bottom max-md:hidden"></div>
  <div class="small-square small-square-right-top max-md:hidden"></div>
  <div class="small-square small-square-right-bottom max-md:hidden"></div>

  <div class="home-flow-copy">
    <div class="workflow-badge">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <path d="M6.5 10v4a2 2 0 0 0 2 2h5.5" />
      </svg>
      <span>Workflow</span>
    </div>
    <h2 id="home-flow-heading">From a PHP class to<br>a working form</h2>
    <p>You describe the form once. Laravel turns it into a JSON schema for the page, the frontend renders it, and the same class validates the submission.</p>
  </div>
  <div class="home-flow-steps">
    <div>
      <strong>1</strong>
      <h3>Define the form</h3>
      <p>Run <code>php artisan make:form</code> and list your fields, fieldsets, and route.</p>
    </div>
    <div>
      <strong>2</strong>
      <h3>Pass it to the page</h3>
      <p>Send <code>CreateUserForm::make()</code> as an Inertia prop and render it with <code>&lt;Form&gt;</code>.</p>
    </div>
    <div>
      <strong>3</strong>
      <h3>Validate on submit</h3>
      <p>Type-hint the form with <code>#[Validate]</code> and use <code>$form-&gt;validated()</code>.</p>
    </div>
  </div>
</section>

<div class="home-container">
  <div class="small-square small-square-top max-md:hidden"></div>
  <div class="small-square small-square-right-top max-md:hidden"></div>
  <div class="small-square small-square-bottom max-md:hidden"></div>
  <div class="small-square small-square-right-bottom max-md:hidden"></div>

  <section class="home-desc">
    <h2>Server-driven forms for Inertia apps</h2>
    <p>Laravel Inertia Forms is an open-source package for building forms in Laravel and Inertia.js applications. Instead of writing the same labels, inputs, validation rules, and error messages in a controller and again in a Vue, React, or Svelte page, you describe the form once in a PHP class. The package serializes that class into a schema, renders it with one component styled with Tailwind CSS 4, handles conditional fields and file uploads, and validates the request with the same rules on the server.</p>
  </section>

  <section class="home-faq" aria-labelledby="faq-heading">
    <h2 id="faq-heading">Frequently Asked Questions</h2>
    <p class="faq-subtext">Common questions about Laravel Inertia Forms, validation, frontends, and customization.</p>

<details class="faq-item" open>
<summary>Which frameworks and versions are supported?</summary>
<div class="faq-content">
<p>Laravel 13 with Inertia 3 and PHP 8.3+. On the frontend, pick the package for your stack: <code>@erag/inertia-forms-vue</code> (Vue 3.5+), <code>@erag/inertia-forms-react</code> (React 19), or <code>@erag/inertia-forms-svelte</code> (Svelte 5). Styling uses Tailwind CSS 4.</p>
</div>
</details>

<details class="faq-item">
<summary>Do I still write validation rules?</summary>
<div class="faq-content">
<p>Most rules are generated from the field setup, like <code>required()</code>, <code>email()</code>, <code>maxLength()</code>, option lists, and file types. Add anything else with <code>->rule()</code> or <code>->rules()</code>, for example <code>unique:users,email</code>. Validate with the <code>#[Validate]</code> attribute or <code>$form-&gt;validate($request)</code>.</p>
</div>
</details>

<details class="faq-item">
<summary>What happens to fields that are hidden by visibleWhen()?</summary>
<div class="faq-content">
<p>They are removed from the page in the browser and skipped during validation, so a hidden required field never blocks a submission and its value is left out of <code>validated()</code>. Add <code>clearWhenHidden()</code> to reset the value when the field disappears.</p>
</div>
</details>

<details class="faq-item">
<summary>Can I use it for edit forms?</summary>
<div class="faq-content">
<p>Yes. Call <code>->bind($model)</code> to fill the form from an Eloquent model or an array, and point it at an update route with <code>->route('users.update', $user)</code>. The HTTP method is read from the route.</p>
</div>
</details>

<details class="faq-item">
<summary>How do I add my own field type?</summary>
<div class="faq-content">
<p>Create a PHP class that extends <code>Field</code> and returns a component name, then register a matching component on <code>&lt;Form&gt;</code> with the <code>components</code> prop. Your component receives the field, its value, and its error, and is wrapped with the label and help text automatically.</p>
</div>
</details>

<details class="faq-item">
<summary>Can I change the look of the form?</summary>
<div class="faq-content">
<p>Yes. Every field, fieldset, and the form accept extra CSS classes, and dark mode follows Tailwind's <code>dark:</code> variant. Point Tailwind at the package with one <code>@source</code> line so its classes are generated.</p>
</div>
</details>

<details class="faq-item">
<summary>How do I install it?</summary>
<div class="faq-content">
<p>Install the Laravel package and the frontend package for your stack:</p>
<div class="faq-install-box">
<div class="faq-install-row"><span class="faq-install-tag">Backend</span><code>composer require erag/inertia-forms</code></div>
<div class="faq-install-row"><span class="faq-install-tag">Frontend</span><code>npm install @erag/inertia-forms-vue</code></div>
</div>
<p>Use <code>@erag/inertia-forms-react</code> or <code>@erag/inertia-forms-svelte</code> for React or Svelte, then follow the <a href="./guide/quick-start.html">Quick Start</a>.</p>
</div>
</details>
  </section>
</div>
