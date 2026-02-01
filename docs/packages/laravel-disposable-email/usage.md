## ⚙ Usage

### Form Request Validation

```php
$request->validate([
    'email' => 'required|email|disposable_email',
]);
```

### Runtime Check

```php
if (DisposableEmail::isDisposable('test@tempmail.com')) {
    //
}
```

### Blade Directive

```blade
@disposableEmail('amit@0-mail.com')
    Disposable email detected!
@enddisposableEmail
```
