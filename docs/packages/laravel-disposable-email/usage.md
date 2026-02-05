---
title: Usage
description: Learn how to use Laravel Disposable Email to block disposable email addresses using validation rules, runtime checks, facades, and Blade directives.
keywords: Laravel Disposable Email usage, disposable email validation Laravel, runtime email check Laravel, Blade directive disposable email
---

## ⚙ Usage

Laravel Disposable Email Detection allows you to detect and block disposable email addresses at different levels of your application, including request validation, runtime logic, and Blade views.

---

### 1️⃣ Form Request Validation

Block disposable email addresses during validation to prevent temporary emails from reaching your application.

#### Using String-Based Validation Rule

```php
$request->validate([
    'email' => 'required|email|disposable_email',
]);
````

You can also use the array-based syntax:

```php
$request->validate([
    'email' => ['required', 'email', 'disposable_email'],
]);
```

---

#### Using Custom Validation Rule Class

```php
use EragLaravelDisposableEmail\Rules\DisposableEmailRule;

$request->validate([
    'email' => ['required', 'email', new DisposableEmailRule()],
]);
```

---

### 2️⃣ Runtime Email Check

Check email addresses programmatically for custom business logic, APIs, or background jobs.

#### Using Rule Class

```php
use EragLaravelDisposableEmail\Rules\DisposableEmailRule;

if (DisposableEmailRule::isDisposable('test@tempmail.com')) {
    // Handle disposable email
}
```

---

#### Using Facade

```php
use DisposableEmail;

if (DisposableEmail::isDisposable('agedmail.com')) {
    // Handle disposable email
}
```

---

### 3️⃣ Blade Directive

Use the Blade directive to conditionally render content based on disposable email detection.

```blade
@disposableEmail('amit@0-mail.com')
    <p class="text-red-600">Disposable email detected!</p>
@else
    <p class="text-green-600">Valid email.</p>
@enddisposableEmail
```
