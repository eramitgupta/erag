---
layout: home
title: Laravel PWA — Progressive Web App Setup
description: Seamless PWA integration for Laravel. Auto-generate manifest, register service workers, customize installation prompts, and upload logos dynamically.
hero:
  name: 'Laravel PWA'
  text: 'PWA Easy Setup for Laravel'
  tagline: 'Progressive Web App setup supporting Livewire, Vue.js & React.js out of the box.'
  image:
    src: /laravel-pwa.svg?v=3
    alt: Laravel PWA Logo
  actions:
    - theme: brand
      text: Get Started
      link: /introduction.html
    - theme: alt
      text: Configuration Guide
      link: /configuration.html

features:
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>'
    title: Auto-Generate Files
    details: Automatically compiles and updates the PWA manifest and service worker files directly into your public folder.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>'
    title: Install Prompts
    details: Configurable "Add to Home Screen" install buttons and banner flows with zero complex client-side javascript code.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'
    title: Blade Directives
    details: Includes simple directives like `@PwaHead` and `@RegisterServiceWorkerScript` to link metadata and service workers.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>'
    title: Multi-Framework Ready
    details: Works out of the box with default Blade layouts, Livewire components, Inertia Vue pages, or React routes.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>'
    title: Dynamic Logo Uploads
    details: In-built features to upload, validate, resize, and update PWA logos and splash images directly through controller endpoints.
  - icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feat-icon"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.62 2.48A2 2 0 0 0 4.56 21h14.88a2 2 0 0 0 1.94-1.51L22 17"></path></svg>'
    title: Facade API
    details: Update application names, icons, background themes, and display modes programmatically via the `PWA` Facade API.
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
    - - meta
      - name: keywords
        content: 'Laravel PWA, service worker Laravel, manifest.json generator Laravel, add to home screen, erag/laravel-pwa'
---

<div class="home-container">
<section class="home-desc">
<h2>PWA Easy Setup for Laravel</h2>
<p>Erag Laravel PWA is a package designed to seamlessly integrate Progressive Web Application (PWA) functionality into your Laravel projects. With this package, you can easily configure, update the manifest, and register service workers, enabling any Laravel app to function as a PWA. It requires minimal configuration and works out of the box with Blade, Livewire, Vue, and React environments.</p>
</section>

<section class="home-faq">
<h2>Frequently Asked Questions</h2>

<div class="faq-item">
<h3>Does this package require HTTPS?</h3>
<p>Yes. Progressive Web Application features, including service workers and installation prompts, require a secure HTTPS connection to function. On local development, localhost is treated as a secure context, but testing on external devices or staging/production servers requires SSL setup.</p>
</div>

<div class="faq-item">
<h3>Is it compatible with Livewire wire:navigate?</h3>
<p>Absolutely. By setting 'livewire-app' =&gt; true in your configuration, the package adds the data-navigate-once attribute to the service worker scripts to prevent duplicate registrations and script leaks during page transitions.</p>
</div>

<div class="faq-item">
<h3>How do I update the application logo?</h3>
<p>Simply replace the PNG logo at public/logo.png (must be at least 512x512 pixels) and run the php artisan erag:update-manifest command to regenerate the manifest icons.</p>
</div>

<div class="faq-item">
<h3>Can I update the PWA manifest at runtime?</h3>
<p>Yes. The package includes a PWA Facade that allows you to dynamically merge and update manifest values inside your controller actions or background jobs.</p>
</div>
</section>
</div>
