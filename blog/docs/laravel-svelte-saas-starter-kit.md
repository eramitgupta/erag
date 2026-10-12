---
title: Laravel Svelte SaaS Starter Kit
headline: "Laravel Svelte SaaS Starter Kit: Build a Multi-Tenant SaaS with Svelte 5 Runes"
description: A plain-English tour of the SaaS Laravel Svelte starter kit, with Svelte 5 runes, multi-tenancy, login, roles and 17 languages ready on day one, for $33 once.
date: 2026-10-12
category: Guide
tags: [laravel, svelte, saas, inertia, starter-kit]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-svelte-saas-starter-kit.md
</div>

If you love Svelte, you already know the feeling. You write less code, the code you write is easy to read and your components do exactly what they say. Then you look for a serious SaaS starter kit with a Laravel backend, and most of what you find assumes React or Vue.

The [SaaS Laravel Svelte Starter Kit](https://saas-laravel.com/kits/svelte.html) was built for you. It is a complete, working SaaS with a Laravel 13 backend and a Svelte 5 frontend written with runes and TypeScript. Multi-tenancy, secure login, users, roles, permissions, custom domains and 17 languages all work from the first install.

You pay once, clone it and start building the part of your product that is actually yours.

In this post, I will walk you through the app the way the three people who use it will see it: you, your customer's admin and your customer's team. Then we will look at what makes this a true Svelte 5 codebase.

## The short version

- **What it is:** a production-ready SaaS foundation with a Laravel 13 backend and a Svelte 5 + TypeScript frontend.
- **What is ready:** login with two-factor and passkeys, a private database for every customer, invitations, roles, permissions, custom domains, 17 languages, maintenance mode, menus and layouts.
- **Price:** $33, paid once. No subscription.
- **What you keep:** lifetime access to the private GitHub repository and weekly updates.
- **License:** unlimited projects, for yourself or for clients.

**[Get the Svelte Starter Kit for $33 →](https://saas-laravel.com/pricing/svelte.html)**

## Why Svelte and Laravel work so well together

Svelte is great at the interface. Laravel is great at everything behind it: routing, validation, authentication, queues, email and the database. The kit joins them with **Inertia v3**.

Here is what that means in practice. Your Laravel controller sends data straight to a Svelte page as props. There is no REST API to design, no tokens to manage and no second app to deploy. You get the instant, app-like feel of a single-page app, while your project stays one simple Laravel codebase.

For a solo developer or small team, this is the sweet spot: Svelte's tiny, readable components on the front, and Laravel's batteries-included backend behind them.

## A tour of the app, through three pairs of eyes

### 1. You, the SaaS owner

You run the central admin app. This is where your business lives.

**Create customers in one step.** When you add a new tenant, the kit creates a brand-new database just for them, runs the migrations and seeders, creates their admin account and emails the admin a signed invitation link. If the email gets lost, you resend it. If they forget their password, you send a reset link or set one yourself.

**See every customer at a glance.** Your tenant list has search, a status filter and stats. Each workspace shows a status: **Active**, **Trial**, **Pending Invitation** or **Suspended**.

**Keep their data truly separate.** Every tenant gets its own database, chosen automatically from the address in the browser. `acme.your-app.com` uses Acme's database, `globex.your-app.com` uses Globex's. There is no shared table where one forgotten filter could leak private data. Cache, file uploads and background jobs are separated per tenant too, so a queued job always runs against the right customer's database. This is all handled by stancl/tenancy, a trusted Laravel package, already set up.

**Update safely.** Need to run a big migration? Put every tenant workspace into maintenance with your own message on a friendly 503 page. A secret bypass link unlocks a workspace for 12 hours so you can test, and you can let specific IP addresses through. Your central app stays online the whole time.

**Handle non-paying customers.** Suspend a single workspace with a message. Nobody else is affected.

**Brand each customer's space.** Each tenant can have a primary domain and extra domains. Every domain gets its own app name (shown in the sidebar, sign-in pages and emails), default language and sign-in options. One customer can have open registration while another is invite-only with two-factor required. You change settings, not code.

### 2. Your customer's admin

The person who runs a company's workspace inside your SaaS.

**A real users page.** Search, stats and pagination. They choose a role when adding or editing someone.

**Invite the team by email.** Invitations go out as emails with a signed link that is valid for 7 days. Until someone accepts, they show an "Invitation pending" badge. When they click the link, they set their own password.

**Roles that make sense.** Built on spatie/laravel-permission. System roles are protected and come with default permissions. Custom roles start empty, so nobody gets access by mistake. The admin can give one person a few extra permissions without inventing a new role.

**Permissions that hold everywhere.** Routes, menu items and buttons all check permissions. If someone is not allowed to delete users, they do not see the button, they do not see the menu item and the server refuses the request anyway.

**A workspace that fits them.** Menus live in the database and can be reordered with drag and drop, with a one-click "Reset Defaults". Menu items hide when a user lacks the permission. The app can use a sidebar or a top header, an inset, regular or floating sidebar, an icon rail, slide-out or always-open menu and card, simple or split sign-in pages.

### 3. Your customer's team

The people who use your product every day.

**Secure, modern sign-in.** Login, password reset and email verification, plus **two-factor authentication** with a QR code and recovery codes, and **passkeys** for signing in with a fingerprint, face or device. Everything runs on Laravel Fortify, the same package behind Laravel's official starter kits.

**Their own settings.** Profile, password, appearance, layout and account deletion pages are ready. Light, dark or system mode, remembered for them.

**Their own language.** The interface ships in **17 languages**, including English, Hindi, Spanish, French, German, Japanese and Korean. Each person picks their language, and even validation errors are translated.

Translations live in normal Laravel language files, and your Svelte components read them with [Laravel Lang Sync Inertia](https://erag.in/laravel-lang-sync-inertia/), an open source package I maintain:

```ts
import { svelteLang } from '@erag/lang-sync-inertia/svelte'

const { __ } = svelteLang()

__('modules.tenant.index.title')
```

One set of translations, shared by Laravel and Svelte.

## What makes this a true Svelte 5 kit

The backend is the same in all three SaaS Laravel kits. The Svelte kit is not a quick port of the React or Vue version. It is written the Svelte 5 way.

### Runes for clear, focused state

Pages use runes: `$props` for the data coming from Laravel, `$state` for local state, `$derived` for computed values and `$effect` for things like debounced searches. Here is a search box over a tenant list:

```svelte
<script lang="ts">
    let { tenants }: { tenants: Tenant[] } = $props();
    let query = $state('');
    let filtered = $derived(
        tenants.filter((tenant) => tenant.name.includes(query)),
    );
</script>
```

No stores to wire up and no boilerplate. The state is exactly where you read it.

### Shared logic in `.svelte.ts` modules

Reusable behavior, such as permission checks, the confirm dialog and layout state, lives in shared modules under `resources/js/lib`. Files that use runes end in `.svelte.ts`, so you can share reactive logic across pages without a store library.

### Small, idiomatic touches

- Modals expose their actions through `bind:this`, so a page can open a form modal with one call.
- `CommonTooltip` passes trigger props into a `children` snippet, the Svelte 5 way of composing components.
- A page can opt out of the app layout entirely with an empty layout, which is handy for full-screen pages.

### A form kit built on shadcn-svelte

The kit includes its own `Common*` form components on top of **shadcn-svelte and Bits UI**: inputs, password fields with a show and hide toggle, textareas, selects, radios, checkboxes, labels, error messages, buttons with a loading spinner, tooltips and a global confirm dialog.

Labels can show a required star, a translated "Optional" tag and a hint. Errors appear in an accessible alert and disappear when there is nothing to show. `CommonButtonRow` gives edit forms a tidy **Save / Discard bar**. Validation messages come back from Laravel already translated.

### Familiar Svelte tooling

- **shadcn-svelte** components on Bits UI, with every file in your project
- **Tailwind CSS v4** for styling
- **svelte-sonner** for toast notifications after every save
- **lucide-svelte** icons
- **sortablejs** for the drag-and-drop menu builder
- **svelte-check** for type checking, with ESLint, Prettier and an SSR build if you need it

Routes are typed with Laravel Wayfinder, and page props are typed from Laravel Data classes. When something changes in Laravel, `svelte-check` points to the Svelte pages that need updating.

## Built to stay clean as you grow

The Laravel code is organised into **modules**: Auth, Dashboard, Menu, RolePermission, Settings, Tenant and User. Each module keeps its routes, controllers, validation and business logic together. When you add your own feature, or billing, it becomes a new module beside the others instead of another file in a crowded folder.

Pest tests, Larastan, Pint, ESLint, Prettier and a GitHub Actions workflow are set up from the start. You only need three commands:

```bash
composer setup   # install everything, migrate and build
composer dev     # server, queue, logs and Vite together
composer test    # lint, type check and run the tests
```

The kit also includes Laravel Boost guidelines and skills, so AI coding agents understand the project's Svelte 5 and Laravel conventions from the first prompt.

## What is not included

Good to know before you buy:

- **No billing module.** This is deliberate. Every SaaS needs a different payment provider, currency and pricing model. Add Stripe, Paddle, Lemon Squeezy, Razorpay or anything else as its own module.
- **MySQL is required** for the database-per-tenant setup. Laravel Herd is recommended locally because it handles subdomains for you.
- **Some Laravel experience helps.** You will build your features in Laravel and Svelte.
- **No refunds.** The complete source code is yours the moment you pay, and GitHub Sponsors does not refund sponsorships. The docs are public, so read as much as you like before buying.

## Is $33 worth it?

Building all of this yourself, properly and with tests, takes an experienced developer several weeks: secure auth with two-factor and passkeys, database-per-tenant multi-tenancy, tenant setup, invitations, roles, permissions, domains, translations, maintenance mode and layouts.

The Svelte kit costs $33, once. That is less than an hour of most developers' time, and you can reuse it on every project you start.

For that, you get:

- The complete Laravel backend and Svelte frontend source code
- **Lifetime access** to the private repository
- **Weekly updates**, released for Vue, React and Svelte at the same time, which you merge when you are ready
- A commercial license for **unlimited projects**, including client work
- Support through GitHub issues

The kits launched on 28 September 2026 and had four releases in the first two weeks, including upgrades to Laravel 13.35, Inertia Laravel 3.5 and Pest 5.3. Every change is in the public [release notes](https://saas-laravel.com/releases.html).

The only rule is that you cannot resell, share or publish the kit's source code itself.

## Who should buy the Svelte kit?

- **Svelte developers** who want a serious Laravel backend without building it from scratch
- **Indie hackers and solo founders** who value small, readable code they can move fast in
- **Laravel developers curious about Svelte 5**, who want to learn it on a real, structured app
- **Agencies** offering Svelte to clients alongside Vue and React

Want to compare? Read about the [Laravel Vue SaaS starter kit](./laravel-vue-saas-starter-kit.md) and the [Laravel React SaaS starter kit](./laravel-react-saas-starter-kit.md). They share the same backend, and the [All Starter Kits bundle](https://saas-laravel.com/pricing/all-kits.html) gives you all three for $79.

## Getting started

1. Visit the [Svelte kit pricing page](https://saas-laravel.com/pricing/svelte.html) and pay $33 through GitHub Sponsors.
2. Accept the GitHub invitation to the private repository. It is sent automatically.
3. Clone the kit and run `composer setup`.
4. Run `composer dev`, open the app and sign in as the super admin.
5. Create your first tenant, then build your own feature.

The [Svelte kit documentation](https://saas-laravel.com/docs/svelte.html) explains each step, and it is open for you to read before you buy.

## Frequently asked questions

### Is it a subscription?

No. You pay $33 once and keep lifetime access, with weekly updates included.

### Does it use Svelte 5 runes or the old syntax?

Svelte 5 runes throughout: `$props`, `$state`, `$derived` and `$effect`, with shared reactive logic in `.svelte.ts` modules.

### Is this SvelteKit?

No. Laravel handles routing, data, authentication and the database, and Svelte handles the interface. Inertia connects the two, so you do not need a separate API or a JavaScript server.

### Can I use it for client projects?

Yes, unlimited projects for yourself or clients. You cannot resell or share the kit's code on its own.

### Can I change the design?

Completely. Every component, page and layout is in your project, built with shadcn-svelte and Tailwind CSS v4.

### What if I do not want the weekly updates?

That is fine. Your code keeps working. Merge updates whenever you like, or not at all.

## Less code, more product

Svelte lets you build interfaces with less code. This kit lets you skip the weeks of backend groundwork too. Put the two together and you reach your first real customer weeks sooner than if you built the foundation yourself.

A working, secure, multi-tenant SaaS in Svelte 5, on day one. For $33, once.

**[Get the Laravel Svelte SaaS Starter Kit →](https://saas-laravel.com/pricing/svelte.html)** · **[See everything in the kit](https://saas-laravel.com/kits/svelte.html)** · **[Read the docs first](https://saas-laravel.com/docs/svelte.html)**
