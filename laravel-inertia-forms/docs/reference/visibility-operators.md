---
title: 'Visibility Operators'
description: 'Every operator you can use in visibleWhen() and hiddenWhen(): equality, comparisons, lists, contains, empty, and truthy checks.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/reference/visibility-operators.md
</div>


<div class="doc-category">Reference</div>

# Visibility Operators

These operators work in `visibleWhen()` and `hiddenWhen()` on fields and fieldsets. The PHP class `Erag\InertiaForms\Support\Condition` and the frontend's `isVisible()` implement the same logic.

```php
->visibleWhen($field, $value)               // '=' (or 'in' when $value is an array)
->visibleWhen($field, $operator, $value)    // any operator below
```

## Operator table

| Operator | Passes when the field's value… | Example |
| -------- | ------------------------------ | ------- |
| `=` | equals the value | `->visibleWhen('type', '=', 'business')` |
| `!=` | does not equal the value | `->visibleWhen('status', '!=', 'draft')` |
| `>` | is a number greater than the value | `->visibleWhen('guests', '>', 2)` |
| `>=` | is a number greater than or equal to the value | `->visibleWhen('age', '>=', 18)` |
| `<` | is a number less than the value | `->visibleWhen('quantity', '<', 10)` |
| `<=` | is a number less than or equal to the value | `->visibleWhen('score', '<=', 3)` |
| `in` | equals one of the values in the list | `->visibleWhen('country', 'in', ['IN', 'US'])` |
| `not_in` | equals none of the values in the list | `->visibleWhen('country', 'not_in', ['IN', 'US'])` |
| `contains` | is an array containing the value, or a string containing the text | `->visibleWhen('tags', 'contains', 'vip')` |
| `empty` | is `null`, `''`, or `[]` | `->visibleWhen('company', 'empty')` |
| `not_empty` | is anything else | `->visibleWhen('company', 'not_empty')` |
| `truthy` | is not `null`, `''`, `false`, `0`, `'0'`, `'false'`, or `[]` | `->visibleWhen('newsletter', 'truthy')` |
| `falsy` | is one of those values | `->visibleWhen('newsletter', 'falsy')` |

Any other operator throws `InvalidArgumentException: Unsupported visibility operator [...]`.

::: warning Always pass a value
`empty`, `not_empty`, `truthy`, and `falsy` ignore the value, but you must pass one (use `null`). With only two arguments, the operator name is treated as a value and compared with `=`.
:::

## Comparison rules

**Equality (`=`, `!=`, `in`, `not_in`, `contains`)** compares normalized strings:

| Value | Normalized to |
| ----- | ------------- |
| `null` | `''` |
| `true` / `false` | `'true'` / `'false'` |
| backed enum | its value as a string |
| array | its JSON encoding |
| anything else | cast to string |

So these all pass:

```php
->visibleWhen('count', 1)        // value '1'
->visibleWhen('active', true)    // value true or 'true'
->visibleWhen('plan', Plan::Pro) // value 'pro'
```

**Numeric operators (`>`, `>=`, `<`, `<=`)** only pass when both sides are numeric. Numeric strings like `'21'` count as numbers. Anything else (including `''` and `null`) fails.

**`contains`** checks array membership (using normalized values) for arrays. For strings it checks for a substring; an empty needle never matches.

**`hiddenWhen()`** runs the same check and inverts the result. It is stored as the same operator with `negate: true`.

## Combining conditions

- Several `visibleWhen()` / `hiddenWhen()` calls on one item must **all** pass.
- A field inside a hidden fieldset is hidden too.
- Field names support dot notation: `->visibleWhen('address.country', 'US')`.

## Examples

```php
// Only for business accounts in the EU
TextInput::make('vat_number')
    ->visibleWhen('account_type', 'business')
    ->visibleWhen('country', ['DE', 'FR', 'IT', 'ES', 'NL']);

// Hide the second address when "same as billing" is on
Fieldset::make('Shipping address')
    ->hiddenWhen('same_as_billing', true)
    ->fields([...]);

// "Other" free-text option
TextInput::make('source_other')
    ->label('Please specify')
    ->visibleWhen('source', 'other')
    ->clearWhenHidden();

// Guardian details for minors
Fieldset::make('Guardian')
    ->visibleWhen('age', '<', 18)
    ->fields([...]);
```
