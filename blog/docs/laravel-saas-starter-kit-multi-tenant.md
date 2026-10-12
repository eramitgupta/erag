---
title: Laravel SaaS Starter Kit with Multi-Tenancy
headline: "Laravel SaaS Starter Kit: What You Get on Day One with SaaS Laravel"
description: Inside SaaS Laravel, a multi-tenant Laravel SaaS starter kit for Vue, React and Svelte, covering auth, tenants, roles, 17 languages, pricing and who it is for.
date: 2026-10-12
category: Guide
tags: [laravel, saas, inertia, multi-tenancy, starter-kit]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-saas-starter-kit-multi-tenant.md
</div>

Every SaaS idea starts the same way. You have a clear picture of the feature that will make customers pay, and then you open a fresh Laravel project and realise that feature is still weeks away.

First you need sign-in, password resets and email verification. Then two-factor authentication, because your first serious customer will ask for it. Then workspaces, so each customer's data stays separate. Then users, invitations, roles and permissions. Then a settings area, a menu that hides what people are not allowed to see, a way to put the app into maintenance without taking everyone offline, and translations if you sell outside one country.

None of that is the product. All of it has to work before anyone will pay for the product.

I built [SaaS Laravel](https://saas-laravel.com/) to remove that first month. It is a Laravel SaaS starter kit with multi-tenancy, authentication, roles and permissions and localization already finished, available with a Vue, React or Svelte frontend. This post is a deep look at what you actually get when you install it, how each part works, what it deliberately leaves out and whether it is a good fit for what you are building.

## SaaS Laravel at a glance

If you only have a minute, this is the short version:

| | |
| --- | --- |
| Backend | Laravel 13 on PHP 8.3+, identical in every kit |
| Frontend | Vue 3.5, React 19 or Svelte 5, all with TypeScript and Tailwind CSS v4 |
| Bridge | Inertia v3, so there is no separate API to maintain |
| Multi-tenancy | A separate database and subdomain for every tenant (stancl/tenancy) |
| Authentication | Laravel Fortify with two-factor authentication and passkeys |
| Permissions | spatie/laravel-permission, for the central app and every tenant |
| Languages | 17, chosen per user and defaulted per domain |
| Price | Vue $29, React $30, Svelte $33, or all three for $79 |
| Payment | Once, through GitHub Sponsors. No subscription |
| Access | Lifetime access to the kit repository, with weekly updates |
| License | Unlimited projects, for yourself or for clients |

The rest of this article explains what is behind each of those lines.

## You start with a working product, not an empty project

Most starter kits give you a login page and a dashboard with a "You're logged in!" message. That is useful, but it is not where SaaS projects lose their time.

When you install SaaS Laravel and run the seeders, you sign in to a central admin app that already does the things a real SaaS needs. You can create a tenant, give it a subdomain, invite its admin, manage its users and roles, switch its sign-in options, change its language and put it into maintenance. All of that works end to end, across both the central app and the tenant workspace.

That changes what your first day looks like. Instead of wiring up authentication, you open the codebase, read how one module is built and start adding the feature your customers will pay for.

Let's go through the pieces one at a time.

## Real multi-tenancy: one database per customer

Multi-tenancy is the part most teams underestimate, and the part that is most painful to change later.

There are two common approaches. In a single-database setup, every table has a `tenant_id` column and every query must remember to filter by it. Forget the filter once, in one report or one export, and one customer sees another customer's data. In a database-per-tenant setup, each customer's data lives in its own database, and the application switches connections based on who is making the request.

SaaS Laravel uses the second approach, built on stancl/tenancy in multi-database mode. Each tenant is identified by its subdomain:

```text
vue.test            → central app  (central database)
acme.vue.test       → tenant 1     (its own database)
globex.vue.test     → tenant 2     (its own database)
```

Because the data is separated at the database level, your tenant code does not need `where tenant_id = ...` on every query. When a tenant is identified, the kit also points the cache, the file storage disks and the queue at that tenant. A job dispatched inside a tenant remembers which tenant it belongs to and runs in that tenant's context when the worker picks it up. That last detail is easy to miss when you build tenancy yourself, and it usually shows up as a production bug.

### Creating a tenant actually provisions it

Creating a tenant from the admin screen does more than insert a row. The kit creates the tenant's database, runs the tenant migrations and seeders and creates the tenant's admin user. The admin receives a signed invitation link to set their password, and you can resend that invitation if the email gets lost. You can also reset the admin's password with an email link or set it yourself.

The tenant list shows search, a status filter and stats, and each workspace has a status: Active, Trial, Pending Invitation or Suspended. That gives you the basic lifecycle a SaaS needs from launch, without building an internal admin panel first.

### Maintenance and suspension without taking everyone offline

Two situations come up sooner than you expect.

The first is maintenance. You need to run a risky migration or a data fix across tenants, and you want customers to see a clear message instead of an error. SaaS Laravel lets you put every tenant workspace into maintenance from the setup screens with your own message, shown on a 503 page. You get a secret bypass link that unlocks a workspace for 12 hours, and you can allow specific IP addresses and CIDR ranges to skip the maintenance page. The central app stays online the whole time, and tenant login stays open so admins can still get in.

The second is suspension. A customer stops paying or breaks your terms, and you need to block one workspace without touching anyone else. You can suspend a single workspace with its own message or the default one.

Neither feature is exciting to build. Both are features you will need on the day you need them, not a week later.

## Authentication that is already finished

Authentication runs on Laravel Fortify, the same package behind Laravel's official starter kits, and it is complete:

- Login, registration and password reset
- Email verification and password confirmation
- Two-factor authentication with recovery codes
- Passwordless sign-in with passkeys
- Profile, password, appearance and account deletion settings

Two things make this more than a standard Fortify setup.

First, the central app and the tenants have their own guards and their own user tables. Your internal team signs in to the central app; your customers' users sign in to their own workspace. The two never share a session or a users table.

Second, you can switch registration, password reset, two-factor authentication and passkeys on or off per domain. One customer might want open registration; another might want invitation-only access with mandatory security features. You configure that per domain, without code changes.

If you are designing the signup side of your product, the [Laravel SaaS signup checklist](./laravel-saas-signup-checklist.md) covers the validation and abuse questions that sit on top of any auth system.

## Domains with their own name, language and sign-in options

Every tenant gets a primary domain and as many secondary domains as you need. The primary domain cannot be deleted by accident.

Each domain carries its own settings:

- An app name, shown in the sidebar, the sign-in pages and emails
- A default language, which users can still override for themselves
- Its own registration, password reset, two-factor and passkey options

That is a lot of flexibility for products sold to different customers or brands. A tenant's users see the name they recognise, in the language their team uses, with the sign-in rules their company expects.

## Users, invitations, roles and permissions

User management is where a SaaS starts to feel real to a customer, and where homemade solutions usually become messy.

In SaaS Laravel, the users screen has search, stats and pagination. You choose a role when you create or edit a user, and you can give a single user extra permissions, grouped by module, without creating a new role for one person. Invitations are sent as queued emails with a signed link that is valid for 7 days. Until the user accepts, they show an "Invitation pending" badge. When they accept, they land on a page where they set their own password.

Roles and permissions use spatie/laravel-permission, the package most Laravel developers already know. A few decisions make it practical in a multi-tenant app:

- System roles are protected and come with default permissions. Custom roles start empty, so nobody gets access by accident.
- Permissions are defined in config files, with separate files for the central app and for tenants.
- The super admin passes every permission check.
- Routes, menu items and buttons all check permissions, so a user never sees a link they cannot use.

That last point matters more than it sounds. Hiding the button, protecting the route and filtering the menu are three separate jobs. When one of them is missing, users either see broken links or, worse, reach pages they should not see.

## Navigation and layouts you can change without code

Menus are stored in the database, and you reorder them with a drag-and-drop builder. If you make a mess, a Reset Defaults action puts them back. A menu item automatically hides itself when the user lacks its permission.

You can also change how the app looks from the settings:

- A sidebar layout or a header layout with a top navigation bar
- Inset, sidebar or floating sidebar variants
- Icon rail, offcanvas or always-open collapse behaviour
- Card, simple or split sign-in pages
- Light, dark and system appearance

This is useful when you run more than one product on the kit, or when a client has opinions about how their dashboard should look.

## 17 languages, shared with the frontend

The interface ships in 17 languages, including English, Hindi, Spanish, French, German, Japanese and Korean. Each user picks their own language, each domain has a default and English is the application default.

Translations are organised as one file per feature, under `lang/<locale>/modules`, so they stay manageable as the app grows. Validation messages are translated too, which is the part most multilingual Laravel apps forget.

The frontend reads the same Laravel translation files through [Laravel Lang Sync Inertia](https://erag.in/laravel-lang-sync-inertia/), an open source package I maintain. Vue, React and Svelte all use the same `__()` helper:

```ts
import { vueLang } from '@erag/lang-sync-inertia/vue'

const { __ } = vueLang()

__('modules.tenant.index.title')
```

You maintain one set of translation files in Laravel, and every page in every frontend uses them. If you want the background on why this approach works, the guide on [Laravel translations in Inertia with Vue and React](./laravel-translations-inertia-vue-react.md) explains it in detail.

## A codebase you will still enjoy in a year

Features get you started. Structure decides whether the project is still pleasant to work on twelve months later.

The SaaS Laravel backend is split into modules. Each feature lives in its own folder under `Modules/`, with its own routes, controllers, Data objects, services, repositories, enums and service provider. The kit ships with `Auth`, `Dashboard`, `Menu`, `RolePermission`, `Settings`, `Tenant` and `User` modules. When you want to understand tenants, you open `Modules/Tenant`. When you add billing, it becomes `Modules/Billing`, without touching the existing modules.

Modules depend on each other in one direction only, towards the two foundation modules, `RolePermission` and `Settings`. That keeps you away from the circular dependencies that make large Laravel apps hard to change.

Every request follows the same path:

```text
Request
  → Tenancy check (central or tenant, decided by the host)
  → web middleware (locale, shared props, tenant status)
  → Module route
  → Controller → Data object → Service → Model / Repository
  → Inertia page, or redirect with a toast
```

Controllers stay thin. Validation lives in spatie/laravel-data classes, which also generate TypeScript types for your pages. Laravel Wayfinder generates typed route functions, so a renamed route breaks the TypeScript build instead of breaking a button in production. Success messages go through Inertia flash data and appear as toasts, the same pattern described in the guide to [Laravel flash messages as Inertia toasts](./laravel-flash-messages-inertia-toasts.md).

The result is typed from PHP to TypeScript. When the backend changes shape, your editor tells you where the frontend needs to change.

## Three frontends, one backend

The backend is identical in all three kits. You choose the frontend your team already knows:

| | Vue kit | React kit | Svelte kit |
| --- | --- | --- | --- |
| Framework | Vue 3.5, `<script setup>` | React 19.2 | Svelte 5 runes |
| Components | shadcn-vue on Reka UI | shadcn/ui on Radix UI | shadcn-svelte on Bits UI |
| Icons | Lucide | Lucide | Lucide |
| Toasts | vue-sonner | sonner | svelte-sonner |
| Type check | vue-tsc | tsc | svelte-check |
| Price | $29 | $30 | $33 |

Each kit is written the way that framework is meant to be written. The Vue kit uses composables, the React kit uses hooks and the React Compiler, and the Svelte kit uses runes and shared `.svelte.ts` modules. None of them is a quick port of another.

All three use TypeScript 5, Tailwind CSS v4, Vite, ESLint and Prettier, and the shadcn component collections mean every file is in your project for you to edit. There is no locked component library to fight with.

## Developer experience: three commands

Getting a kit running locally comes down to three Composer scripts:

```bash
# install dependencies, create .env, migrate and build assets
composer setup

# run the server, queue worker, logs and Vite together
composer dev

# lint, type check and run the Pest test suite
composer test
```

Quality tooling is set up from the start: Pest feature tests for the backend, Larastan static analysis, Pint formatting, ESLint and Prettier for the frontend, type checking and a GitHub Actions workflow that runs the test suite on pushes and pull requests.

Each kit also includes Laravel Boost guidelines and project skills for AI coding agents. If you use an AI coding agent, it understands the project's conventions from the first prompt: where modules live, how Data classes are written and how tests are structured. In practice, that means fewer suggestions you have to undo.

## What SaaS Laravel deliberately does not include

A starter kit should be honest about its edges. These are the ones that matter before you buy.

**There is no billing module.** This is a deliberate choice. Every SaaS has different payment needs: different countries, currencies, tax rules, pricing models and preferred providers. A kit that hard-codes one provider forces you to work around it or rip it out. SaaS Laravel leaves the billing layer open so you can add Stripe, Paddle, Lemon Squeezy, Razorpay or whichever provider suits your market, as its own module.

**Database-per-tenant needs MySQL.** The tenancy setup creates a database for every tenant, so you need MySQL and a database user that can create databases. Locally, Laravel Herd is recommended because it handles `*.test` domains and wildcard subdomains.

**It is a codebase, not a no-code builder.** You need to be comfortable with Laravel and one of the three frontends. The kit saves you the groundwork; it does not write your product for you.

**There are no refunds.** You receive the complete source code the moment your payment goes through, and GitHub Sponsors does not refund sponsorship payments. The documentation is public, so read it before you buy. If you are unsure which kit fits, you can email before purchasing.

## Build it yourself or start from the kit?

Building all of this yourself is absolutely possible. The question is what it costs.

Here is a rough, conservative estimate for an experienced Laravel developer building each part properly, with tests:

| Part | Rough time to build well |
| --- | --- |
| Fortify auth with 2FA, passkeys and settings | 3 to 5 days |
| Database-per-tenant setup and tenant provisioning | 5 to 8 days |
| Domains with per-domain name, language and auth options | 2 to 3 days |
| Roles, permissions and per-user permissions UI | 3 to 4 days |
| Users and signed invitations | 2 to 3 days |
| Database menus, layouts and appearance settings | 3 to 4 days |
| Localization across backend and frontend | 2 to 3 days |
| Maintenance mode and tenant suspension | 1 to 2 days |
| Tests, static analysis, CI and tooling | 2 to 3 days |

That adds up to somewhere between four and seven weeks before you write the first feature your customers care about. Even at a modest hourly rate, the kit costs less than a single afternoon of that time.

The bigger cost is not money. It is momentum. Most side projects and early startups do not fail because the founder could not build authentication. They fail because the founder spent the motivated first month on authentication, and the product reached customers too late.

If you want the long version of this decision, including when building from scratch is the better choice, read the [boilerplate vs scratch decision guide](https://saas-laravel.com/blog/laravel-saas-boilerplate-vs-scratch.html).

## Pricing: pay once, keep it forever

SaaS Laravel is a one-time purchase:

- **Vue Starter Kit:** $29
- **React Starter Kit:** $30
- **Svelte Starter Kit:** $33
- **All Starter Kits:** $79 for all three, $13 less than buying them separately

You pay through GitHub Sponsors. As soon as the payment goes through, your GitHub account receives an automatic invitation to the kit repository. Accept it and you can clone the code immediately. There is no license key and no activation server.

What you are paying for:

- **Lifetime access** to the kit repository
- **Weekly updates**, included at no extra cost
- **The commercial license**, which lets you build unlimited projects for yourself or for clients
- **Support** through GitHub issues on the kit repository

The license has one important limit: you cannot resell, share or publish the kit's source code. You can deliver a finished application to a client, including the parts of the kit it needs to run, but the client cannot reuse or resell the kit on its own. The full terms are on the [license page](https://saas-laravel.com/license.html).

## How weekly updates work

Updates are only useful if they do not break your project. SaaS Laravel handles them the way you would handle any upstream repository.

When you clone the kit, rename its remote to `upstream` and push your own copy to a private repository:

```bash
git remote rename origin upstream
git remote add origin git@github.com:your-org/my-saas.git
```

Each week, fixes, improvements and dependency upgrades land in the kit repository for Vue, React and Svelte at the same time. Nothing changes in your project until you choose to merge. When you are ready, you pull from `upstream` and merge on your own schedule.

The kits launched with version 1.0.0 on 28 September 2026 and reached 1.1.0 on 11 October 2026, with releases in between. The 1.1.0 release, for example, moved all three kits to Laravel 13.35, Inertia Laravel 3.5, Fortify 1.41, Pest 5.3, Larastan 3.13 and Laravel Boost 2.10, and added a Composer script that upgrades your dependencies in one step. Every change is listed in the public [release notes](https://saas-laravel.com/releases.html).

## Which kit should you buy?

The backend is the same in every kit, so this is a frontend decision:

- **Choose the Vue kit** if you like Laravel's conventions and want single-file components with `<script setup>`. It is also the cheapest way in. Read the full [Laravel Vue SaaS starter kit](./laravel-vue-saas-starter-kit.md) tour.
- **Choose the React kit** if your team already writes React, or if you plan to hire from the larger React talent pool. Read the full [Laravel React SaaS starter kit](./laravel-react-saas-starter-kit.md) tour.
- **Choose the Svelte kit** if you want the smallest amount of frontend code and you enjoy Svelte 5 runes. Read the full [Laravel Svelte SaaS starter kit](./laravel-svelte-saas-starter-kit.md) tour.
- **Choose All Starter Kits** if you are an agency or freelancer whose clients pick their own stack, or if you want to compare the three approaches on real code.

If you cannot decide, pick the framework you can be productive in this week. A SaaS gets built by shipping, not by choosing the theoretically perfect tool.

## Who SaaS Laravel is for

The kit is a strong fit if you are:

- **A solo founder or indie hacker** who wants to reach the first paying customer quickly with a product that will not need rewriting later.
- **A freelancer or agency** building SaaS products for clients. The license covers unlimited client projects, and a consistent base makes every new project faster.
- **A small product team** that wants a clean modular architecture, tests and typed code from day one.
- **A Laravel developer** who has built auth, tenants and permissions before and does not want to build them again.

It is probably not the right fit if your product is a single-user tool that will never need workspaces, if you need a non-Laravel backend or if you are looking for a visual builder that does not require code.

## Getting started

Going from purchase to a running app takes a few minutes:

1. Choose your kit on the [pricing page](https://saas-laravel.com/pricing.html) and pay through GitHub Sponsors.
2. Accept the repository invitation on GitHub or from the email GitHub sends you.
3. Clone the kit and rename its remote to `upstream`.
4. Set `APP_URL`, `APP_DOMAIN` and your database credentials in `.env`.
5. Run `composer setup`, then `composer dev`.
6. Sign in with the seeded admin account and create your first tenant.

The [installation guide](https://saas-laravel.com/docs/getting-started/installation.html) covers each step, including the local domain setup.

## Frequently asked questions

### Is SaaS Laravel a subscription?

No. You pay once and nothing renews. Lifetime access and weekly updates are included in that single payment.

### Can I use SaaS Laravel for client projects?

Yes. The commercial license allows unlimited projects for yourself or for clients. What you cannot do is resell, share or publish the kit's source code.

### Do I really need multi-tenancy?

If your customers are companies or teams whose data must stay separate, yes, and it is far easier to start with it than to add it later. If you are building a single-user consumer app, a simpler kit may suit you better.

### Does the kit include Stripe or billing?

No. Billing is left out on purpose so you can add the payment provider that fits your market and pricing model, as its own module.

### Can I change the design?

Yes. Every component, page and layout file lives in your project. The UI is built from shadcn components and Tailwind CSS v4, so you edit the code directly instead of overriding a locked library.

### What happens if I stop pulling updates?

Nothing breaks. The code in your project is yours. Updates are there when you want them, and you can merge them weeks or months later.

### Where do I get help?

Open an issue on the kit repository you have access to. The public [documentation](https://saas-laravel.com/docs.html) covers installation, architecture, tenancy, authentication, permissions and testing in detail.

## Start with the part that makes your product different

Authentication, tenants, invitations, roles, languages and maintenance mode are necessary, but no customer will ever choose your product because of them. They choose it because of the one thing you do better than anyone else.

SaaS Laravel gives you the necessary parts on day one, built with the same care you would put into them yourself, so your first week goes into the feature that matters.

**[Explore SaaS Laravel](https://saas-laravel.com/)** · **[Compare the kits and pricing](https://saas-laravel.com/pricing.html)** · **[Read the documentation](https://saas-laravel.com/docs.html)**
