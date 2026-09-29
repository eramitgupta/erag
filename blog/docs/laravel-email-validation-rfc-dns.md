---
title: "Laravel Email Validation: RFC, DNS and MX Explained"
description: Laravel email validation with DNS and RFC modes explained. Learn what rfc, strict, dns and spoof check, when MX lookups help and when they slow you down.
date: 2026-09-29
package: laravel-disposable-email
category: Guide
tags: [laravel, validation, email, dns]
---

Most Laravel apps validate email with `'email' => 'required|email'` and never think about it again. Then somebody copies `email:rfc,dns` from an old answer, the test suite starts failing on the CI server, and nobody is quite sure what `dns` was supposed to do.

Laravel email validation has more options than most people use, and they check very different things. Some look at the shape of the string. One makes a network request. One looks for lookalike Unicode characters. None of them tell you whether the address belongs to a throwaway inbox.

This guide walks through each mode, what it catches, what it costs, and how I combine them with a disposable domain check in real forms.

## What Laravel's email rule checks by default

A bare `email` rule runs RFC validation. It checks that the address is syntactically valid according to the email RFCs. That's a looser standard than most people expect: plenty of strange-looking addresses are technically valid.

You can pass styles to change what the rule does, as the [Laravel validation docs](https://laravel.com/docs/validation#rule-email) describe:

```php
'email' => 'required|email:rfc,dns',
```

The same styles are available through the `disposable_email` rule from [Laravel Disposable Email](https://erag.in/laravel-disposable-email/advanced/rfc-dns.html). That lets you run the format checks and the burner domain check in a single rule instead of two.

## The validation modes, one by one

Here is every mode the package accepts after `disposable_email:`, with what it actually checks:

| Mode | What it checks |
| --- | --- |
| `rfc` | The address is valid according to the supported email RFCs |
| `strict` | Same as RFC, but RFC warnings also fail |
| `dns` | The domain has a valid MX record |
| `spoof` | The address doesn't use deceptive Unicode characters |
| `filter` | PHP's `filter_var` email validation |
| `filter_unicode` | `filter_var` validation that allows Unicode |

A few notes from using them.

### rfc and strict

`rfc` is the sensible baseline. `strict` goes one step further and fails on RFC warnings, meaning addresses that parse but use unusual or deprecated syntax. I rarely need `strict` on public forms. If an address passes `rfc` and the person can receive a verification email, I don't care that it looks odd.

### filter and filter_unicode

These use PHP's built-in `filter_var` check instead of the RFC parser, and `filter_unicode` is the variant that accepts Unicode. They're useful when some other system downstream uses `filter_var` and you want the two to agree.

### spoof

`spoof` rejects addresses that mix scripts in a misleading way, for example a Cyrillic letter that looks exactly like a Latin one. It matters most on forms where the email is shown to other users, like team invites.

### dns

`dns` requires the domain to have a valid MX record, which means some server says it accepts mail for that domain. It catches domains that don't accept mail at all: a mistyped domain that was never registered, or a made-up one typed just to get past the form.

It does not prove that the mailbox exists. `nobody-here@gmail.com` passes a DNS check because Gmail has MX records. Only sending a verification email can tell you the inbox is real.

## Where the disposable check fits in

Format checks and domain reputation are different questions. `anna@tempmail.com` is well formed, and temporary inbox services run real mail servers, because receiving mail is the whole product. A burner address can pass every mode above. That is the gap a disposable domain list fills.

Plain `disposable_email` only checks the domain against the built-in, custom and whitelisted lists. Add modes after a colon to combine it with format and DNS checks:

```php
'email' => ['required', 'disposable_email:rfc'],
'email' => ['required', 'disposable_email:rfc,dns'],
'email' => ['required', 'disposable_email:rfc,dns,spoof'],
```

If you prefer rule objects, the facade takes the same modes:

```php
use Disposable;

'email' => ['required', Disposable::rule('rfc', 'dns')],
```

One detail that's easy to miss: whitelist entries only skip the disposable domain check. If you ask for `dns` and a whitelisted domain has no MX record, it still fails. That is on purpose. The whitelist says "this domain isn't a burner", not "skip all validation".

## Laravel email validation with DNS: what it costs

The `dns` mode is the one that bites people, so it's worth understanding before you turn it on everywhere.

**It makes a network request.** Every validation with `dns` looks up the domain's MX records. On a healthy server that is fast, but it depends on your DNS resolver. If the resolver is slow, your sign-up form is slow. If it's down, valid addresses fail.

**It needs the intl extension.** Laravel's `dns` and `spoof` validators require PHP's `intl` extension. Check it on every environment you deploy to, not just your laptop:

```bash
php -m | grep intl
```

**It's flaky in tests and CI.** A test runner without network access, or a sandbox with restricted DNS, will fail validation for addresses that are fine in production.

This is why DNS checks are opt-in in the package. Plain `disposable_email` never makes a network call.

## A sensible default for each kind of form

Here is roughly what I use. Treat it as a starting point, not a rule.

| Form | Rule |
| --- | --- |
| Sign-up | `disposable_email:rfc,dns` |
| Change email | `disposable_email:rfc,dns` |
| Newsletter or waitlist | `email`, `disposable_email` |
| Team invite | `disposable_email:rfc,spoof` |
| Admin import of many users | `email` (no DNS) |

The reasoning: sign-up and email change are the two places where a bad address creates an account you have to live with, so the extra lookup is worth it. A newsletter form can live without DNS because the first bounce tells you the same thing. Bulk imports should never do thousands of DNS lookups in one request.

Here is a Form Request for the sign-up case:

```php
<?php

namespace App\Http\Requests;

use Disposable;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $emailModes = app()->environment('testing') ? ['rfc'] : ['rfc', 'dns'];

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', Disposable::rule(...$emailModes)],
            'password' => ['required', 'confirmed', 'min:8'],
        ];
    }
}
```

The environment check keeps DNS out of your test suite. Your tests still cover the disposable domain check and RFC format, and they don't depend on the network.

## Debugging: valid addresses fail, or burners pass

**A real address fails with `dns`.** Check that the server can resolve DNS at all, then confirm `intl` is loaded for the PHP version your web server uses (the CLI and FPM can differ).

**A disposable address passes.** Confirm the rule is spelled `disposable_email`, check that the domain isn't in your whitelist, then clear the cache and sync the list again. To see exactly what the package thinks, inspect the result:

```php
use Disposable;

Disposable::check('anna@tempmail.com')->toArray();
```

It tells you whether the address is disposable, which domain matched and which list it came from. The [validation help page](https://erag.in/laravel-disposable-email/help/validation.html) has the full checklist.

## FAQ

### Does email:dns check that the mailbox exists?

No. It checks that the domain has an MX record. The mailbox can still be missing. Use Laravel's email verification if you need proof that someone controls the inbox.

### Should I use strict instead of rfc?

Only if a downstream system rejects addresses that are technically valid. For most sign-up forms, `rfc` plus a verification email is enough.

### Can I use these modes without the disposable check?

Yes, with Laravel's own `email:rfc,dns` rule. The package modes exist so you don't need two separate rules on the same field.

## Where to go next

Pick your modes per form, not globally. Start with `disposable_email:rfc,dns` on sign-up and email change, keep `dns` out of tests, and check `intl` on every server.

If you haven't set up the package yet, the [block disposable emails in Laravel](./block-disposable-emails-laravel.md) tutorial covers installation and testing. For the bigger picture of a clean sign-up page, see the [Laravel SaaS sign-up checklist](./laravel-saas-signup-checklist.md).
