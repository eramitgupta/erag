---
title: Laravel Disposable Email Package
headline: "Laravel Disposable Email Package: Block 136,000+ Temporary Email Domains in 5 Minutes"
description: Block temporary and fake emails in Laravel 10 to 13 with erag/laravel-disposable-email. 136,000+ domains, daily updates, no API calls and setup in five minutes.
date: 2026-10-12
package: laravel-disposable-email
category: Guide
tags: [laravel, validation, email, registration, packages]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-disposable-email-package.md
</div>

[erag/laravel-disposable-email](https://github.com/eramitgupta/laravel-disposable-email) is a free Laravel disposable email package that stops people from signing up with temporary inboxes like Mailinator, 10 Minute Mail, Temp Mail or Guerrilla Mail. You install it with Composer, add one validation rule to your form, and any email from a known throwaway domain is rejected before it reaches your database.

It checks emails against more than 136,000 disposable domains, updates that list every day, runs completely inside your app with no API calls and works on Laravel 10, 11, 12 and 13.

I built and maintain this package. This guide explains, in plain language, what it does, why it is a better way to block fake signups and how to set it up in about five minutes.

## In short

- **Package:** `erag/laravel-disposable-email`
- **What it blocks:** temporary, disposable and burner email addresses
- **Domains detected:** 136,240 in the synced list on 12 October 2026, plus about 3,750 bundled in the package
- **Updates:** the domain list is refreshed every day
- **Speed:** checks run against a local list, with no outside API and no per-check fees
- **Works with:** Laravel 10, 11, 12 and 13 on PHP 8.1+
- **Works in:** Blade forms, Inertia with Vue or React, Livewire and JSON APIs
- **Price:** free and open source under the MIT license
- **Trusted by:** more than 265,000 installs on Packagist, and [featured on Laravel News](https://laravel-news.com/disposable-email-detection-in-laravel)

## Set it up in five minutes

Install the package and publish its config:

```bash
composer require erag/laravel-disposable-email
php artisan erag:install-disposable-email
```

Add the `disposable_email` rule to any email field:

```php
$request->validate([
    'email' => ['required', 'email', 'disposable_email'],
]);
```

Load the full, daily-updated blocklist into your app:

```bash
php artisan erag:sync-disposable-email-list
```

Done. Someone typing `test@mailinator.com` now sees: "The email belongs to an unauthorized email provider."

To keep the list fresh automatically, schedule the sync in `routes/console.php`:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('erag:sync-disposable-email-list')->daily();
```

## What is a disposable email, and why block it?

A disposable email is a temporary inbox anyone can create in seconds, with no signup. It works for a few minutes or hours and then disappears. Services like Mailinator, 10 Minute Mail, Temp Mail and Guerrilla Mail run thousands of these domains.

People use them to avoid spam, which is fair. But when they sign up for your app, they usually bring problems:

- **Free trial abuse.** One person creates ten accounts to get ten free trials.
- **Fake signups.** Bots and spammers fill your database with accounts nobody will ever use.
- **Lost messages.** Password resets, invoices and important notices go to inboxes that no longer exist.
- **Damaged email reputation.** Sending to dead addresses raises your bounce rate, which can push your real emails into spam folders.
- **Misleading numbers.** Signups look great, but active users and revenue do not grow.

Blocking disposable domains at signup is one of the cheapest ways to fix all of this. If trial abuse is your biggest problem, read the guide on [stopping free trial abuse in Laravel](./stop-free-trial-abuse-laravel.md).

## Why erag/laravel-disposable-email is a better choice

### 1. It catches more throwaway domains

The synced list contains more than 136,000 disposable domains. An automated job collects domains from several maintained sources every day, cleans them, removes duplicates and publishes the result. Your app pulls the update with one command or on a daily schedule.

About 3,750 of the most common disposable domains are also bundled inside the package. So the big throwaway services are blocked from the moment you install it, even before your first sync.

### 2. It is fast, free and private

Every check runs against a list stored inside your app. There is no outside API, so:

- **No delay** on your signup form while waiting for another service
- **No monthly bill** and no per-check fees
- **No rate limits**, however many users sign up
- **No downtime risk** when a third-party service is slow or offline
- **No data sharing**, because your users' email addresses never leave your server

### 3. Updates can never break your blocklist

A blocklist is only useful if it stays complete. Version 5.3.0 made the sync command extremely careful:

- **Bad downloads are ignored.** Timeouts, server errors, empty responses and HTML error pages are rejected before your files are touched.
- **Nothing is ever removed.** Only new domains are added. Domains you already have stay, even if the remote list drops them.
- **No half-written files.** The new list is written to a temporary file first and swapped in only when it is complete.
- **No clashes.** If two syncs run at the same time, a lock stops them from overwriting each other.
- **No pointless writes.** If there is nothing new, your file stays exactly as it was.

You can schedule the sync daily and forget about it.

### 4. It blocks subdomain tricks by default

Disposable services often hand out addresses on subdomains, like `user@x7.tempmail.com`, to get past simple checks. This package blocks any subdomain of a blocked domain automatically, because `block_subdomains` is `true` by default. You do not have to remember to turn it on.

### 5. It tells you why an email was blocked

A yes-or-no answer is fine for a form. For logs, admin screens and support tickets, you want the reason. `Disposable::check()` gives you the full story:

```php
use Disposable;

$result = Disposable::check('user@inbox.tempmail.com');

$result->disposable();     // true
$result->domain();         // "inbox.tempmail.com"
$result->matchedDomain();  // "tempmail.com"
$result->source();         // "built-in", "custom" or "whitelist"
$result->whitelisted();    // false
$result->toArray();
```

When a customer asks "why can't I sign up?", you can answer in seconds.

### 6. You can use it anywhere, not only in forms

Use it as a validation rule, a rule object, a quick check in your code or a Blade directive.

Simple yes-or-no checks for services, jobs and controllers:

```php
Disposable::email('user@mailinator.com');  // true
Disposable::domain('mailinator.com');      // true
```

A rule object, if you prefer classes over strings:

```php
use EragLaravelDisposableEmail\Rules\DisposableEmailRule;

'email' => ['required', 'email', new DisposableEmailRule()],
```

And a Blade directive for templates:

```blade
@disposableEmail($user->email)
    <p>Please update your email to keep receiving invoices.</p>
@enddisposableEmail
```

### 7. Format and DNS checks in the same rule

Combine the disposable check with Laravel's own email checks in one rule:

```php
'email' => ['required', 'disposable_email:rfc,dns'],
```

`rfc` makes sure the address is written correctly. `dns` makes sure the domain can actually receive email. Use `dns` on signup forms rather than every field, because it makes a network lookup. The guide to [Laravel email validation with RFC and DNS](./laravel-email-validation-rfc-dns.md) explains when each mode is worth it.

### 8. You stay in control, without writing code

**Block extra domains.** Create any `.txt` file in `storage/app/blacklist_file` and put one domain per line. Every `.txt` file in that folder is loaded automatically. Perfect for domains you spot in your own signup logs.

**Allow trusted domains.** Add them to the whitelist in `config/disposable-email.php`:

```php
'whitelist' => [
    'partner-company.com',
],
```

The whitelist always wins, even over the built-in list. That makes [handling false positives](./disposable-email-false-positives-laravel.md) a one-line fix.

**Add more sources.** The `remote_url` setting accepts several list URLs, in plain text or JSON, so you can merge extra lists into your blocklist.

### 9. It is easy to see what is going on

Run one command to see how many built-in and custom domains are loaded, how many domains are whitelisted, whether caching is on and when the list was last synced:

```bash
php artisan disposable:stats
```

If you validate a lot of emails, turn on caching in the config and the domain list is kept in your Laravel cache.

### 10. It is ready for AI coding agents

The package ships a Laravel Boost skill. If you build with an AI coding agent, it learns how to use the package correctly in your project: which rule to use, how to sync and where custom domains go. Fewer wrong suggestions, less fixing.

## How to block disposable emails in Laravel, step by step

### 1. Install and publish the config

```bash
composer require erag/laravel-disposable-email
php artisan erag:install-disposable-email
```

### 2. Protect your registration form

In a Form Request:

```php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'email', 'max:255', 'unique:users', 'disposable_email'],
        'password' => ['required', 'confirmed', 'min:8'],
    ];
}
```

Because it is a normal Laravel validation rule, it works the same in Blade forms, Inertia apps with Vue or React, Livewire components and JSON APIs.

### 3. Load the full list and schedule updates

```bash
php artisan erag:sync-disposable-email-list
```

```php
Schedule::command('erag:sync-disposable-email-list')->daily();
```

### 4. Add your own rules

Block domains you find in your logs with a `.txt` file in the blacklist folder. Allow trusted domains with the `whitelist` setting.

### 5. Test it

A short Pest test keeps it working as your app changes:

```php
it('rejects disposable emails at registration', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'someone@mailinator.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('email');
});
```

For a longer walkthrough, see [how to block disposable emails in Laravel](./block-disposable-emails-laravel.md).

## Tips for the best results

- **Block where it matters.** Use the rule at signup and when someone changes their email. A contact form or password reset usually does not need it. The guide on [where disposable email validation belongs](./disposable-email-validation-policy.md) covers every case.
- **Keep the whitelist ready.** Now and then a real customer's domain may appear on a list. One line in the config fixes it.
- **Use DNS checks wisely.** They are slower than the local check, so save them for signup.
- **Schedule the sync.** New disposable domains appear every day. A daily sync keeps you covered.
- **Combine it with verification.** Blocking throwaway domains stops most fake signups. Email verification and rate limiting catch the rest.

## Frequently asked questions

### How do I block temporary emails in Laravel?

Install `erag/laravel-disposable-email` with Composer and add `disposable_email` to your email validation rules: `'email' => ['required', 'email', 'disposable_email']`. Then run `php artisan erag:sync-disposable-email-list` to load the full blocklist.

### Why should I use erag/laravel-disposable-email?

It detects more than 136,000 disposable domains, updates them daily, runs entirely inside your app with no API calls, blocks subdomains by default, tells you exactly why an email was blocked and keeps your list safe during updates. It is free and works on Laravel 10 to 13.

### Does it call an external API when validating?

No. Every check runs against a list stored in your app, so it is fast, free and private. Network calls only happen when you sync the list, or if you turn on the optional DNS check.

### How many disposable domains does it detect?

The synced list had 136,240 domains on 12 October 2026, plus about 3,750 domains bundled in the package. The list is refreshed every day.

### Does it work with Laravel 13?

Yes. It supports Laravel 10, 11, 12 and 13 on PHP 8.1 or newer.

### Can I block my own list of domains?

Yes. Put any `.txt` file in the blacklist folder (`storage/app/blacklist_file` by default) with one domain per line, or add more list URLs to `remote_url` in the config.

### What if a real user's domain is blocked by mistake?

Add the domain to the `whitelist` array in `config/disposable-email.php`. Whitelisted domains always pass.

### Will a failed update delete my blocklist?

No. Since version 5.3.0, failed, empty or broken downloads are rejected, existing domains are never removed and updates are written safely in one step.

### Does it work with Inertia, Livewire and APIs?

Yes. It is a standard Laravel validation rule, so it works anywhere Laravel validation runs: Blade forms, Inertia pages with Vue or React, Livewire components and JSON APIs.

### Is it free for commercial projects?

Yes. It is open source under the MIT license, free for personal and commercial use.

## Start blocking fake signups today

One Composer command and one validation rule protect your app from fake accounts, trial abuse and bounced emails, starting today.

```bash
composer require erag/laravel-disposable-email
```

- **Documentation:** [erag.in/laravel-disposable-email](https://erag.in/laravel-disposable-email/)
- **GitHub:** [eramitgupta/laravel-disposable-email](https://github.com/eramitgupta/laravel-disposable-email). A star helps other developers find it.
- **Packagist:** [erag/laravel-disposable-email](https://packagist.org/packages/erag/laravel-disposable-email)
