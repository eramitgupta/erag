---
title: "Introduction"
description: "Block disposable and temporary emails in Laravel. Detect 124,220+ burner domains, stop fake signups offline, and protect email sender reputation."
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

# Introduction

**Laravel Disposable Email** is a fast, offline email validator designed to detect and block disposable, temporary, and fake email addresses before they enter your Laravel application.

When users register with throwaway inboxes like Mailinator, 10MinuteMail, or Temp-Mail, applications suffer from drained free trial credits, polluted databases, and hard bounces that damage your SMTP domain reputation.

This package eliminates fraudulent registrations using an open-source dataset of **124,220+ verified disposable domains**. It runs natively inside your application across **Laravel 10, 11, 12, and 13**, delivering instant protection with zero third-party API dependencies and zero recurring subscription costs.

## What Makes It Unique

- **Zero-Latency Offline Validation**: Operates entirely within your application. No outbound HTTP calls, no third-party API downtime, and no added latency to signup forms.
- **124,220+ Preloaded Threat Domains**: Ships with comprehensive domain coverage to identify and halt burner email services on contact.
- **Multi-Layered Verification**: Combines local domain blocklists with optional RFC 5322 syntax compliance and live DNS MX record lookups.
- **Custom Blacklist & Whitelist Control**: Safely whitelist corporate or testing domains while mounting your own custom blacklist files directly from storage.
- **Automated List Updates**: Keep threat data up to date using native background synchronization with the Laravel console scheduler.

## Quick Links

- [**Installation & Setup**](./getting-started.html) — Add the package with Composer in under a minute.
- [**Configuration**](./configuration.html) — Customize whitelist exceptions, blacklist files, and Redis cache.
- [**Form Validation**](./validation/basic.html) — Apply the validation rule to controllers and Form Requests.
- [**Runtime Checks**](./runtime/checks.html) — Check emails programmatically inside services, jobs, and APIs.
