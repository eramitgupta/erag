---
layout: home
title: Phone Number React — Headless React Hook
description: Headless React hook for country-aware phone input. Country selection, digit normalization, calling codes, mask patterns, and validation — no masking dependency.
head:
  - - meta
    - name: keywords
      content: React phone number input, usePhoneNumber React, country phone hook, React phone mask, dial code React, @erag/phone-number-react

hero:
  name: 'Phone Number React'
  text: 'Country-aware phone input for React'
  tagline: 'Headless hook that handles country selection, digit normalization, calling codes, mask patterns, and phone validation — no masking library needed.'
  image:
    src: /phone-react.svg
    alt: Phone Number React Logo
  actions:
    - theme: brand
      text: Get Started
      link: /installation.html
    - theme: alt
      text: API Reference
      link: /api.html

features:
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'
    title: Country-Aware State
    details: Manages the selected country with ISO codes, calling codes, and phone-length rules for 200+ countries out of the box.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>'
    title: Digit Normalization
    details: Strips non-numeric characters and auto-truncates input to the selected country's max phone length as the user types.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
    title: Built-in Validation
    details: Validates phone length against the selected country's allowed lengths. Returns `isValid` as a plain boolean — no extra library needed.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>'
    title: Mask Pattern Output
    details: Returns a mask string like `XXXXX XXXXX` for the selected country. Use it as a placeholder or guide — zero masking dependency.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>'
    title: Calling Code
    details: Returns the calling code for the selected country (e.g. `+91` for India) as a plain string value.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>'
    title: Headless & UI-Agnostic
    details: The hook returns raw state and handlers. Bring your own select, input, and styling — works with any React UI.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08"></polygon><polygon points="12 12 21 6.92 21 17.08 12 22.08"></polygon><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>'
    title: Built-in Country Data
    details: Ships with bundled country and dial-code metadata. Override with your own data object — no server calls required.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>'
    title: Fully Typed
    details: Complete TypeScript types for all return values, options, and custom data shapes. Works with strict mode and React 18/19.
---

<PhonePlayground />

