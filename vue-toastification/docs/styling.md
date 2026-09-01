---
title: "CSS Variables & Styling Guide"
description: "Customize toast notification badges, colors, fonts, border-radius, and glassmorphism styling using scoped CSS classes and CSS variables."
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

# CSS & Styling

Learn how `@erag/vue-toastification` scopes styles and how to customize component layouts.

## Scoped CSS Prefixes

To prevent style leaks and collisions with popular CSS frameworks (such as Tailwind CSS, Bootstrap, or custom styling rules), all package selectors are scoped using the **`erag-`** prefix.

## Key CSS selectors

You can target the following class selectors in your global stylesheets to apply custom design themes:

| Selector | Description |
| :--- | :--- |
| `.erag-toast-container` | Main wrapper housing the active lists of toasts. |
| `.erag-toast` | Outer box of a single toast alert. |
| `.erag-toast-success` | Success variant state styling. |
| `.erag-toast-error` | Error variant state styling. |
| `.erag-toast-warning` | Warning variant state styling. |
| `.erag-toast-info` | Info variant state styling. |
| `.erag-modal-backdrop` | Fullscreen background overlay of the confirmation modal. |
| `.erag-btn-confirm` | Accent confirmation button. |
| `.erag-btn-cancel` | Cancel link button. |

## Customizing styles

To customize modal overlays, declare overrides under the specific class targets:

```css
/* Customizing modal buttons to fit your design system */
.erag-btn-confirm {
  font-family: 'Outfit', sans-serif;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(41, 128, 185, 0.2);
}

.erag-btn-cancel {
  font-weight: 500;
  text-decoration: underline;
}
```