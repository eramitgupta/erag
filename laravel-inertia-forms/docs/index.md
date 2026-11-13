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
          link: https://github.com/eramitgupta/laravel-Inertia-forms
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
    - - script
      - type: application/ld+json
      - '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What is Laravel Inertia Forms?", "acceptedAnswer": {"@type": "Answer", "text": "It''s a free Laravel package that saves you from writing the same form over and over. You write the form once in PHP: which fields it has, how they''re laid out and what the rules are. Then you show it on your Vue, React or Svelte page with a single component. When someone submits it, the same PHP class checks the data."}}, {"@type": "Question", "name": "Is it free to use?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, completely. It''s open source under the MIT license, so you can use it in your own projects and in client or commercial work without paying anything."}}, {"@type": "Question", "name": "Which versions of Laravel and Inertia does it work with?", "acceptedAnswer": {"@type": "Answer", "text": "You need Laravel 13, Inertia 3 and PHP 8.3 or newer. For the frontend, it works with Vue 3.5, React 19 and Svelte 5, and the styling is done with Tailwind CSS 4."}}, {"@type": "Question", "name": "How do I install it?", "acceptedAnswer": {"@type": "Answer", "text": "You install two things: the Laravel package with Composer, and the package for your frontend (Vue, React or Svelte) with npm. After that you add one line to your CSS file so Tailwind picks up the styles. It takes a few minutes, and the installation guide and quick start walk you through it."}}, {"@type": "Question", "name": "Do I need to write my validation rules twice?", "acceptedAnswer": {"@type": "Answer", "text": "No, and that''s one of the main reasons the package exists. When you mark a field as required, as an email, or give it a maximum length, the rule is added for you. You can still add any extra Laravel rule you like. The form checks the data on the server, and any errors show up right under the field that caused them."}}, {"@type": "Question", "name": "Can a field show up only when it''s needed?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. For example, you can show a \"Company name\" field only when someone ticks \"I''m buying for a company\". Fields that are hidden aren''t checked and aren''t saved, so a hidden required field will never stop someone from submitting. Read more in conditional visibility."}}, {"@type": "Question", "name": "Can I use the same form for creating and editing?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. On the edit page you pass in the record, for example the user being edited, and the form opens with their current details already filled in. You don''t need a second form for editing. See model binding."}}, {"@type": "Question", "name": "Can I split a long form into steps?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Long forms like sign-ups or onboarding can be shown as steps, with a progress bar and Back and Continue buttons. Each step is checked before the person can move on, so they fix mistakes as they go instead of all at the end. See wizard forms."}}, {"@type": "Question", "name": "Can people upload files and images?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. People can drag and drop files or click to pick them, see a preview of images, and upload more than one file if you allow it. You decide the allowed file types and the maximum size. See file upload."}}, {"@type": "Question", "name": "What kinds of fields can I use?", "acceptedAnswer": {"@type": "Answer", "text": "There are 22 ready-made fields. You get the usual ones like text, textarea, select, radio buttons, checkboxes and toggles, plus date and time pickers, a color picker, a slider, file uploads and tags. For bigger forms there are repeating rows, content blocks, links, slugs, one-time codes and even a chat-style message box."}}, {"@type": "Question", "name": "Can my forms be shown in other languages?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Your own labels use Laravel''s normal translation files, just like the rest of your app. The text that comes with the package, like button labels, placeholders and the month names in the calendar, can be translated too, and it switches as soon as the user changes language. See translations."}}, {"@type": "Question", "name": "Can I make the forms match my design?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. You can add your own CSS classes to any field or section, change the main accent color, put fields side by side in columns, and dark mode works on its own. See styling."}}, {"@type": "Question", "name": "What if I need a field that isn''t included?", "acceptedAnswer": {"@type": "Answer", "text": "You can build your own. You make a small PHP class for the field and a matching component for your frontend, and the package takes care of the label, help text and error message for you, just like it does for the built-in fields. See custom fields."}}, {"@type": "Question", "name": "Do I need to install other UI or date libraries?", "acceptedAnswer": {"@type": "Answer", "text": "No. The dropdowns, calendar, time picker, color picker and upload box are all part of the package. Apart from Inertia and the framework you already use, there''s nothing else to install, and it even comes with its own icons."}}, {"@type": "Question", "name": "Are the forms accessible?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, we care about this a lot. Every field has a proper label, screen readers announce errors, the pickers can be used with just a keyboard, and after a failed submit the cursor jumps straight to the first mistake."}}, {"@type": "Question", "name": "Can AI tools like Claude Code or Cursor build forms with it?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The package comes with instructions for Laravel Boost, so tools like Claude Code, Cursor, Codex and GitHub Copilot know how to use it properly instead of guessing. You can simply describe the form you want in plain words. See the example agent sessions above."}}, {"@type": "Question", "name": "Why not just write Inertia forms by hand?", "acceptedAnswer": {"@type": "Answer", "text": "You can, but it gets repetitive fast. Every hand-written form needs its inputs, its state, its error messages and its validation rules, often spread over a few files. With this package a form is one short PHP class, so there''s less to write, less to test, and all your forms look and work the same way."}}]}'
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

<section class="home-prompts" aria-labelledby="home-prompts-heading">
  <div class="features-badge">
    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8"/><path d="M8 12h5"/></svg>
    <span>Prompts</span>
  </div>
  <h2 id="home-prompts-heading">Give a prompt. Get a working form.</h2>
  <p class="home-prompts-lead">Tell your coding agent what you need in plain words. It plans the work, writes the form class, controller and page, runs the tests and tells you what it added. Run <code>php artisan boost:install</code> once so Claude Code, Codex, Cursor and other agents know the form API.</p>
  <PromptLibrary />
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
    <p class="faq-subtext">Quick answers to the things people ask most before they try Laravel Inertia Forms.</p>

<details class="faq-item" open>
<summary>What is Laravel Inertia Forms?</summary>
<div class="faq-content">
<p>It's a free Laravel package that saves you from writing the same form over and over. You write the form once in PHP: which fields it has, how they're laid out and what the rules are. Then you show it on your Vue, React or Svelte page with a single component. When someone submits it, the same PHP class checks the data.</p>
</div>
</details>

<details class="faq-item">
<summary>Is it free to use?</summary>
<div class="faq-content">
<p>Yes, completely. It's open source under the MIT license, so you can use it in your own projects and in client or commercial work without paying anything.</p>
</div>
</details>

<details class="faq-item">
<summary>Which versions of Laravel and Inertia does it work with?</summary>
<div class="faq-content">
<p>You need Laravel 13, Inertia 3 and PHP 8.3 or newer. For the frontend, it works with Vue 3.5, React 19 and Svelte 5, and the styling is done with Tailwind CSS 4.</p>
</div>
</details>

<details class="faq-item">
<summary>How do I install it?</summary>
<div class="faq-content">
<p>You install two things: the Laravel package with Composer, and the package for your frontend (Vue, React or Svelte) with npm. After that you add one line to your CSS file so Tailwind picks up the styles. It takes a few minutes, and the <a href="./guide/installation.html">installation guide</a> and <a href="./guide/quick-start.html">quick start</a> walk you through it.</p>
</div>
</details>

<details class="faq-item">
<summary>Do I need to write my validation rules twice?</summary>
<div class="faq-content">
<p>No, and that's one of the main reasons the package exists. When you mark a field as required, as an email, or give it a maximum length, the rule is added for you. You can still add any extra Laravel rule you like. The form checks the data on the server, and any errors show up right under the field that caused them.</p>
</div>
</details>

<details class="faq-item">
<summary>Can a field show up only when it's needed?</summary>
<div class="faq-content">
<p>Yes. For example, you can show a "Company name" field only when someone ticks "I'm buying for a company". Fields that are hidden aren't checked and aren't saved, so a hidden required field will never stop someone from submitting. Read more in <a href="./concepts/visibility.html">conditional visibility</a>.</p>
</div>
</details>

<details class="faq-item">
<summary>Can I use the same form for creating and editing?</summary>
<div class="faq-content">
<p>Yes. On the edit page you pass in the record, for example the user being edited, and the form opens with their current details already filled in. You don't need a second form for editing. See <a href="./concepts/model-binding.html">model binding</a>.</p>
</div>
</details>

<details class="faq-item">
<summary>Can I split a long form into steps?</summary>
<div class="faq-content">
<p>Yes. Long forms like sign-ups or onboarding can be shown as steps, with a progress bar and Back and Continue buttons. Each step is checked before the person can move on, so they fix mistakes as they go instead of all at the end. See <a href="./concepts/wizard.html">wizard forms</a>.</p>
</div>
</details>

<details class="faq-item">
<summary>Can people upload files and images?</summary>
<div class="faq-content">
<p>Yes. People can drag and drop files or click to pick them, see a preview of images, and upload more than one file if you allow it. You decide the allowed file types and the maximum size. See <a href="./fields/file-upload.html">file upload</a>.</p>
</div>
</details>

<details class="faq-item">
<summary>What kinds of fields can I use?</summary>
<div class="faq-content">
<p>There are 22 ready-made fields. You get the usual ones like text, textarea, select, radio buttons, checkboxes and toggles, plus date and time pickers, a color picker, a slider, file uploads and tags. For bigger forms there are repeating rows, content blocks, links, slugs, one-time codes and even a chat-style message box.</p>
</div>
</details>

<details class="faq-item">
<summary>Can my forms be shown in other languages?</summary>
<div class="faq-content">
<p>Yes. Your own labels use Laravel's normal translation files, just like the rest of your app. The text that comes with the package, like button labels, placeholders and the month names in the calendar, can be translated too, and it switches as soon as the user changes language. See <a href="./translations/">translations</a>.</p>
</div>
</details>

<details class="faq-item">
<summary>Can I make the forms match my design?</summary>
<div class="faq-content">
<p>Yes. You can add your own CSS classes to any field or section, change the main accent color, put fields side by side in columns, and dark mode works on its own. See <a href="./frontend/styling.html">styling</a>.</p>
</div>
</details>

<details class="faq-item">
<summary>What if I need a field that isn't included?</summary>
<div class="faq-content">
<p>You can build your own. You make a small PHP class for the field and a matching component for your frontend, and the package takes care of the label, help text and error message for you, just like it does for the built-in fields. See <a href="./frontend/custom-fields.html">custom fields</a>.</p>
</div>
</details>

<details class="faq-item">
<summary>Do I need to install other UI or date libraries?</summary>
<div class="faq-content">
<p>No. The dropdowns, calendar, time picker, color picker and upload box are all part of the package. Apart from Inertia and the framework you already use, there's nothing else to install, and it even comes with its own icons.</p>
</div>
</details>

<details class="faq-item">
<summary>Are the forms accessible?</summary>
<div class="faq-content">
<p>Yes, we care about this a lot. Every field has a proper label, screen readers announce errors, the pickers can be used with just a keyboard, and after a failed submit the cursor jumps straight to the first mistake.</p>
</div>
</details>

<details class="faq-item">
<summary>Can AI tools like Claude Code or Cursor build forms with it?</summary>
<div class="faq-content">
<p>Yes. The package comes with instructions for Laravel Boost, so tools like Claude Code, Cursor, Codex and GitHub Copilot know how to use it properly instead of guessing. You can simply describe the form you want in plain words. See the <a href="#home-prompts-heading">example agent sessions</a> above.</p>
</div>
</details>

<details class="faq-item">
<summary>Why not just write Inertia forms by hand?</summary>
<div class="faq-content">
<p>You can, but it gets repetitive fast. Every hand-written form needs its inputs, its state, its error messages and its validation rules, often spread over a few files. With this package a form is one short PHP class, so there's less to write, less to test, and all your forms look and work the same way.</p>
</div>
</details>
  </section>
</div>
