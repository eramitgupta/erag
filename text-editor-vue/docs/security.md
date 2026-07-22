---
title: Security and Sanitization
description: 'Understand browser-side HTML sanitization, URL and iframe rules, mention and merge-tag normalization, CSP, and required server-side defenses.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, HTML sanitizer, rich text editor security, XSS defense, safe iframe, server-side HTML sanitization'
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

# Security & Sanitization

`@erag/text-editor-vue` includes a browser-side allowlist sanitizer powered by `DOMParser` and `TreeWalker`. It reduces common unsafe markup before editor insertion and preview, but it is not a complete XSS boundary.

---

## Built-in Sanitization Mechanics

The internal sanitizer inspects HTML strings before inserting, previewing, or exporting content:

- ❌ **Script Stripping**: Removes `<script>` tags, inline `javascript:` URIs, data-URIs with executable content, and inline event handlers (such as `onload=`, `onerror=`, `onclick=`).
- ❌ **Unsafe Iframe & Style Blocking**: Blocks unauthorized iframe protocols and dangerous style declarations (e.g. `expression()`, `behavior`, `url()` injections).
- 🔒 **Mention Markup Normalization**: Validates inserted `@` mentions and strips unexpected or tampered attributes, keeping only allowlisted `data-erag-mention-*` properties and `contenteditable="false"`.
- 🔒 **Merge-Tag Normalization**: Preserves only valid `.erag-merge-tag` tokens with the expected marker, value, and non-editable state; malformed candidates become plain text.
- 🧹 **Allowlisted Formatting**: Keeps configured tags and attributes while filtering style declarations to the package's safe property set.

---

## Defense-in-Depth & Server-Side Sanitization

::: warning IMPORTANT
Client-side sanitization is defense-in-depth and cannot replace server-side validation.
:::

Because callers can bypass browser code and submit HTTP requests directly, **always sanitize untrusted HTML on the server** with a maintained, context-appropriate sanitizer.

### Server-Side Allowlist Recommendation

When configuring your server sanitizer, ensure the following attributes are allowlisted for mentions and merge tags:

- **Mention Tags**: `<span class="erag-mention" data-erag-mention="true" data-erag-mention-id="..." data-erag-mention-label="..." data-erag-mention-value="..." contenteditable="false">`
- **Merge Tag Tokens**: `<span class="erag-merge-tag" data-erag-merge-tag="true" data-erag-merge-tag-value="..." data-erag-merge-tag-name="..." contenteditable="false">` (`data-erag-merge-tag-name` is optional)

---

## Content Security Policy (CSP)

For maximum protection against XSS vulnerabilities, enforce a strict Content Security Policy (CSP) header in your web application:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
```
