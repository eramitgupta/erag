---
title: Stop Free Trial Abuse With Burner Email Checks
description: Free trial abuse often starts with a burner inbox. Block disposable emails at sign-up, gate trials, log what you catch and grow your own Laravel blocklist.
date: 2026-09-29
package: laravel-disposable-email
category: Use case
tags: [laravel, saas, free-trial, email, security]
---

You offer a 14-day free trial. Somebody signs up, uses it for 14 days, then signs up again with a new address. Then again. Every time the address is on a temporary inbox service that took them five seconds to open.

That is free trial abuse in its cheapest form, and it is the easiest kind to slow down. A person with a real Gmail account and a new phone number is going to get through most filters. A person hitting "new inbox" on a temp mail site does not have to.

This post is about the SaaS side of the problem. How I would wire burner email checks into a Laravel app that runs trials, where to be strict, where to be soft, and what the check can't do. If you haven't installed the package yet, the [block disposable emails tutorial](./block-disposable-emails-laravel.md) walks through setup and the basic rule.

## What email checks can and can't do about free trial abuse

Let me be honest about the limits first, because it changes how you design the flow.

A disposable email check stops people who use throwaway inbox services. It looks at the domain and compares it to known disposable domains, plus any you add yourself. That's it.

It will not stop:

- someone who creates a new Gmail or Outlook account for each trial
- plus-addressing on real providers (`anna+trial2@gmail.com`)
- a team sharing one paid account

So the goal isn't to make trial abuse impossible. It's to remove the zero-effort path and make repeat trials cost the abuser a few minutes each time. For most products that is enough to kill most of it, and the rest is better handled by billing rules than by email rules.

## Option 1: block burner emails at sign-up

The strict approach is to reject the address on the registration form. Add the rule to whatever validates sign-ups:

```php
'email' => ['required', 'email', 'disposable_email'],
```

This is the right call when a trial account costs you real money: a dedicated database, seats on a third-party API, a human onboarding call. The person sees a normal validation error and can come back with a permanent address.

The downside is that you lose the sign-up entirely. Some people use a temp inbox because they don't trust you with their real one yet, not because they want to abuse anything. That's where the second option helps.

## Option 2: let them sign up, but gate the trial

A softer policy is to allow registration and only decide about the trial afterwards. The account exists, the person can look around, but a burner address doesn't get free usage. They can still subscribe straight away.

The package gives you a boolean check through the `Disposable` facade that works anywhere, not just inside validation:

```php
<?php

namespace App\Http\Controllers;

use Disposable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StartTrialController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (Disposable::email($user->email)) {
            return redirect()
                ->route('billing.plans')
                ->withErrors([
                    'email' => 'Free trials need a permanent email address. You can still subscribe today.',
                ]);
        }

        $user->forceFill(['trial_ends_at' => now()->addDays(14)])->save();

        return redirect()->route('dashboard');
    }
}
```

The `trial_ends_at` column and the `billing.plans` route are your own; swap in whatever your billing setup uses. The important part is that `Disposable::email()` only checks the domain lists. It doesn't make DNS lookups, so it is cheap enough to call in a request like this.

I like this pattern because it moves the decision to the moment it actually matters. Browsing the product costs you almost nothing. Giving away 14 days of usage is the expensive part.

## Log what you catch

Once the check is live, you want to know what it's doing. Is it catching a lot? Only a few? Are the matches from the built-in list, or from domains you added yourself?

`Disposable::check()` returns a result object instead of a boolean, and it can tell you which list matched:

```php
use Disposable;
use Illuminate\Support\Facades\Log;

$result = Disposable::check($user->email);

if ($result->disposable()) {
    Log::info('Trial blocked for disposable email', $result->toArray());
}
```

The object also has `domain()`, `matchedDomain()`, `source()` and `whitelisted()`. `source()` returns `built-in`, `custom` or `whitelist`. After a few weeks, look at the logs. If most matches say `custom`, your own list is doing the heavy lifting and you should keep feeding it. The [detailed result docs](https://erag.in/laravel-disposable-email/runtime/result.html) list everything the object exposes.

## Grow your own blocklist from real abuse

No public list knows about every burner domain, and abusers tend to find the ones that aren't listed yet. When you spot a domain that keeps showing up on trial accounts, block it yourself.

Create a text file in the blacklist directory (by default `storage/app/blacklist_file`):

```text
storage/app/blacklist_file/trial-abuse.txt
```

One domain per line, no comments:

```text
fakemail.org
trashbox.io
```

The package reads every `.txt` file in that folder, so a separate file for trial abuse keeps your additions easy to review. Subdomain blocking is on by default, which matters here: blocking `trashbox.io` also blocks `mail.trashbox.io` and any other subdomain the service rotates through.

If you have caching turned on, run `php artisan cache:clear` after editing the file by hand.

To see where you stand, the stats command prints built-in, custom, total and whitelist domain counts, along with cache settings and the last update time of your blacklist files:

```bash
php artisan disposable:stats
```

## Keep the built-in list current

Your custom file covers what you have seen. The sync command covers what others have seen. Schedule it daily in `routes/console.php`:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('erag:sync-disposable-email-list')->daily();
```

It fetches every URL in the `remote_url` config and writes the domains into your blacklist directory. You can add your own feed to `remote_url` if you maintain a shared list across several apps. The [remote sync docs](https://erag.in/laravel-disposable-email/domains/sync.html) cover the file format.

## Handle accounts that already exist

If you add the check to a product that has been running for a while, you already have users on burner domains. Some are abusers. Some are real customers who never changed their email.

For a Blade app, the `@disposableEmail` conditional lets you nudge them on the account page:

```blade
@disposableEmail($user->email)
    <div class="rounded border border-amber-300 bg-amber-50 p-4">
        Your account uses a temporary email address. Update it to keep receiving invoices and password resets.
    </div>
@enddisposableEmail
```

In an Inertia app, pass a boolean prop from the controller instead, for example `'hasTemporaryEmail' => Disposable::email($user->email)`, and render the banner in Vue or React.

This is a display helper only. It doesn't validate anything. When they submit the new address, the `disposable_email` rule on your email change form still has to do its job.

## Pair it with other signals

Burner email checks work best as one layer among a few. The ones I would add next, all built into Laravel:

- **Rate limit the sign-up route.** Laravel's [rate limiting](https://laravel.com/docs/routing#rate-limiting) stops a script from creating accounts in a loop.
- **Require email verification before the trial starts.** With [email verification](https://laravel.com/docs/verification), the trial only begins once someone clicks a link in a real inbox.
- **Ask for a card on the plans that cost you the most.** If a trial includes something expensive, a card check does more than any email rule.

## When you don't need this

If your trial already requires a card, burner emails mostly stop mattering for billing. You might still block them to keep your mailing list clean, but it's not a trial abuse fix anymore.

Same if a trial costs you close to nothing. Some products are happy to let people extend a trial forever, because those users sometimes convert later. Measure before you tighten.

## Wrapping up

Start with the soft version: allow sign-ups, gate the trial with `Disposable::email()`, and log matches for a couple of weeks. Then decide if you need to block at the form. Add the domains you catch to your own `.txt` file and let the scheduler handle the rest.

If you're reviewing the whole sign-up page while you're at it, the [Laravel SaaS sign-up checklist](./laravel-saas-signup-checklist.md) covers phone fields, feedback and translated messages too.
