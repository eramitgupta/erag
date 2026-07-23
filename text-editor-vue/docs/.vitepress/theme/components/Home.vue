<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor, type EditorInit } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';
import HomeEditorDemo from './HomeEditorDemo.vue';

const activeFaq = shallowRef<number | null>(0);
const heroContent = shallowRef(
    '<p>Welcome to <strong>@erag/text-editor-vue</strong> 👋</p>' +
    '<p>Hey <span class="erag-mention" data-erag-mention="true" data-erag-mention-id="developer" data-erag-mention-label="Developer" data-erag-mention-value="developer@example.com" contenteditable="false">@Developer</span>, explore the <span class="erag-merge-tag" data-erag-merge-tag="true" data-erag-merge-tag-value="{{project.name}}" data-erag-merge-tag-name="Project Name" contenteditable="false">{{project.name}}</span> workspace.</p>' +
    '<p>Scroll down to discover mentions, merge tags, templates, media uploads, tables, and much more.</p>',
);
const heroEditorConfig: EditorInit = {
    height: 250,
    minHeight: 200,
    menubar: ['file', 'edit', 'view', 'insert', 'format', 'table', 'help'],
    toolbar: 'bold italic underline | link image',
    statusbar: false,
    resize: false,
    mentions: {
        items: [
            {
                id: 'developer',
                label: 'Developer',
                description: 'Frontend developer',
                value: 'developer@example.com',
            },
            {
                id: 'jane-smith',
                label: 'Jane Smith',
                description: 'Product designer',
                value: 'jane.smith@example.com',
            },
        ],
    },
    mergeTags: {
        items: [
            {
                name: 'Invoice total',
                value: '{{invoice.total}}',
                group: 'Invoice',
            },
            {
                name: 'Client name',
                value: '{{client.name}}',
                group: 'Client',
            },
        ],
    },
};
</script>

<template>
    <div class="custom-home">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-container">
                <div class="hero-content">
                    <div class="hero-badge">✨ 100% Free & Open Source</div>
                    <h1 class="hero-title">
                        Modern Rich Text <br />
                        Editor <span class="text-gradient">for Vue 3</span>
                    </h1>
                    <p class="hero-subtitle">
                        Build powerful editors with zero runtime dependencies.
                        Supports Mentions, Merge Tags, Templates, Tables, Image
                        Upload & Resizing, HTML Editing, TypeScript, and Native
                        Browser APIs.
                    </p>
                    <p class="hero-description">
                        Built from scratch for the modern web. No TinyMCE,
                        CKEditor, or Quill.
                    </p>
                    <div class="hero-actions">
                        <a
                            href="/text-editor-vue/introduction.html"
                            class="btn btn-primary"
                            >Get Started</a
                        >
                        <a
                            href="https://github.com/eramitgupta/text-editor-vue"
                            class="btn btn-secondary"
                            target="_blank"
                            >View on GitHub</a
                        >
                    </div>
                </div>

                <div class="hero-visual">
                    <div class="editor-mockup">
                        <div class="editor-inner">
                            <div class="editor-header">
                                <div class="editor-dots">
                                    <i></i><i></i><i></i>
                                </div>
                            </div>
                            <Editor
                                v-model="heroContent"
                                :init="heroEditorConfig"
                                aria-label="Interactive text editor demo"
                            />
                        </div>
                        <div class="floating-card fc-1">
                            <div class="fc-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                                    />
                                </svg>
                            </div>
                            <div class="fc-text">Zero Dependencies</div>
                        </div>
                    </div>

                    <div class="hero-feature-row">
                        <div class="feature-pill">
                            <div class="fc-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <circle cx="12" cy="12" r="4" />
                                    <path
                                        d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"
                                    />
                                </svg>
                            </div>
                            <div class="fc-text">Mentions (@)</div>
                        </div>
                        <div class="feature-pill">
                            <div class="fc-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"
                                    />
                                    <path
                                        d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"
                                    />
                                </svg>
                            </div>
                            <div class="fc-text">Merge Tags</div>
                        </div>
                        <div class="feature-pill">
                            <div class="fc-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <rect
                                        width="18"
                                        height="7"
                                        x="3"
                                        y="3"
                                        rx="1"
                                    />
                                    <rect
                                        width="9"
                                        height="7"
                                        x="3"
                                        y="14"
                                        rx="1"
                                    />
                                    <rect
                                        width="5"
                                        height="7"
                                        x="16"
                                        y="14"
                                        rx="1"
                                    />
                                </svg>
                            </div>
                            <div class="fc-text">Templates</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Trust Section -->
        <section class="trust-section">
            <div class="trust-container">
                <div class="trust-badge">MIT License</div>
                <div class="trust-badge">Zero Runtime Dependencies</div>
                <div class="trust-badge">Native Browser APIs</div>
                <div class="trust-badge">TypeScript</div>
                <div class="trust-badge">Open Source</div>
                <div class="trust-badge">Vue 3</div>
                <div class="trust-badge">Built from Scratch</div>
                <div class="trust-badge">No TinyMCE / CKEditor</div>
            </div>
        </section>

        <!-- Features Grid -->
        <section id="features" class="features-section">
            <h2 class="section-title">Everything You Need.</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <polyline points="4 7 4 4 20 4 20 7" />
                            <line x1="9" x2="15" y1="20" y2="20" />
                            <line x1="12" x2="12" y1="4" y2="20" />
                        </svg>
                    </div>
                    <h3>Rich Text Formatting</h3>
                    <p>
                        Standard bold, italic, underline, strikethrough, lists,
                        and headings with zero bloat.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path
                                d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"
                            />
                        </svg>
                    </div>
                    <h3>Interactive Mentions (@)</h3>
                    <p>
                        Async debounced search for user mentions with session
                        caching and AbortSignal support.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"
                            />
                            <path
                                d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"
                            />
                        </svg>
                    </div>
                    <h3>Dynamic Merge Tags</h3>
                    <p>
                        Autocomplete drop-downs and categorized slide-out
                        drawers for data placeholders.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect width="18" height="7" x="3" y="3" rx="1" />
                            <rect width="9" height="7" x="3" y="14" rx="1" />
                            <rect width="5" height="7" x="16" y="14" rx="1" />
                        </svg>
                    </div>
                    <h3>Consumer-defined Templates</h3>
                    <p>
                        Insert application-provided HTML snippets through a
                        searchable modal with live preview.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect
                                width="18"
                                height="18"
                                x="3"
                                y="3"
                                rx="2"
                                ry="2"
                            />
                            <circle cx="9" cy="9" r="2" />
                            <path
                                d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
                            />
                        </svg>
                    </div>
                    <h3>Image Upload & Resize</h3>
                    <p>
                        Drag-and-drop uploads, custom server handlers, and
                        interactive corner-handle resizing.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect
                                width="18"
                                height="18"
                                x="3"
                                y="3"
                                rx="2"
                                ry="2"
                            />
                            <line x1="3" x2="21" y1="9" y2="9" />
                            <line x1="3" x2="21" y1="15" y2="15" />
                            <line x1="9" x2="9" y1="9" y2="21" />
                            <line x1="15" x2="15" y1="9" y2="21" />
                        </svg>
                    </div>
                    <h3>Table Editing</h3>
                    <p>
                        Insert and manage interactive tables natively without
                        external heavyweight plugins.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="m18 16 4-4-4-4" />
                            <path d="m6 8-4 4 4 4" />
                            <path d="m14.5 4-5 16" />
                        </svg>
                    </div>
                    <h3>HTML Source Editor</h3>
                    <p>
                        Toggle between WYSIWYG mode and raw HTML source code
                        editing instantly.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect
                                width="20"
                                height="16"
                                x="2"
                                y="4"
                                rx="2"
                                ry="2"
                            />
                            <path d="M6 8h.001" />
                            <path d="M10 8h.001" />
                            <path d="M14 8h.001" />
                            <path d="M18 8h.001" />
                            <path d="M8 12h.001" />
                            <path d="M12 12h.001" />
                            <path d="M16 12h.001" />
                            <path d="M7 16h10" />
                        </svg>
                    </div>
                    <h3>Keyboard Shortcuts</h3>
                    <p>
                        Familiar productivity shortcuts out-of-the-box (Cmd+B,
                        Cmd+I, Undo/Redo).
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                            />
                        </svg>
                    </div>
                    <h3>Zero Dependencies</h3>
                    <p>
                        Built directly on the browser's Selection, Range, and
                        DOMParser APIs. Only Vue 3 is needed.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                        </svg>
                    </div>
                    <h3>Fullscreen Mode</h3>
                    <p>
                        Built-in distraction-free writing mode that expands the
                        editor to fill the entire viewport.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                            />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="9" x2="15" y1="13" y2="13" />
                            <line x1="9" x2="15" y1="17" y2="17" />
                        </svg>
                    </div>
                    <h3>Type-Safe API</h3>
                    <p>
                        First-class TypeScript support with comprehensive
                        interfaces for props, events, and configuration.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                            <path d="M8 11h6" />
                        </svg>
                    </div>
                    <h3>Find, Preview & Print</h3>
                    <p>
                        Search and replace document text, inspect a sanitized
                        preview, and print only the editor content.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M4 5h16" />
                            <path d="M4 12h10" />
                            <path d="M4 19h7" />
                            <path d="m17 15 3 3-3 3" />
                        </svg>
                    </div>
                    <h3>Responsive Editing UI</h3>
                    <p>
                        Toolbar overflow, viewport-aware menus, active command
                        states, word counts, and constrained editor resizing.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M4 6h16v12H4z" />
                            <path d="m10 9-3 3 3 3" />
                            <path d="m14 9 3 3-3 3" />
                        </svg>
                    </div>
                    <h3>Media & Content Tools</h3>
                    <p>
                        Safe links, video, audio, embeds, emoji, special
                        characters, anchors, horizontal rules, and date-time.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"
                            />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    </div>
                    <h3>Sanitized HTML Pipeline</h3>
                    <p>
                        Allowlisted tags, attributes, styles, URLs, embeds,
                        mentions, and merge tags with SSR-safe initialization.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="fc-icon-large">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="12" cy="12" r="3" />
                            <path
                                d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12"
                            />
                            <path d="M12 2v3" />
                            <path d="M12 19v3" />
                        </svg>
                    </div>
                    <h3>Accessible by Design</h3>
                    <p>
                        ARIA-labelled controls, keyboard-friendly menus, and
                        clear focus states support inclusive editing workflows.
                    </p>
                </div>
            </div>
        </section>

        <HomeEditorDemo />

        <!-- Comparison Section -->
        <section class="comparison-section">
            <h2 class="section-title">Why switch?</h2>
            <div class="comparison-table-wrapper">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th class="highlight-col">@erag/text-editor-vue</th>
                            <th>TinyMCE</th>
                            <th>CKEditor</th>
                            <th>Quill</th>
                            <th>Tiptap</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>License</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span><br /><span
                                    class="tbl-sm-text"
                                    >100% Free (MIT)</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >GPL 2+ / Commercial</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >GPL 2+ / Commercial</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon check"></span><br /><span
                                    class="tbl-sm-text"
                                    >BSD-3-Clause</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon check"></span><br /><span
                                    class="tbl-sm-text"
                                    >MIT</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Zero External Dependencies</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span>
                            </td>
                            <td><span class="tbl-icon cross"></span></td>
                            <td><span class="tbl-icon cross"></span></td>
                            <td><span class="tbl-icon cross"></span></td>
                            <td>
                                <span class="tbl-icon cross"></span><br /><span
                                    class="tbl-sm-text"
                                    >Requires ProseMirror</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>CSS & Theme Customization</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span><br /><span
                                    class="tbl-sm-text"
                                    >36+ CSS Variables</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Skin Builder / Complex</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Custom Build required</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Basic Snow theme</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon check"></span><br /><span
                                    class="tbl-sm-text"
                                    >Unstyled Tailwind/CSS</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>First-party Vue 3 Component</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span>
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Vue integration</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Vue integration</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Community wrapper</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Vue integration</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Mentions (@)</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span>
                            </td>
                            <td>
                                <span class="tbl-icon money"></span><br /><span
                                    class="tbl-sm-text"
                                    >Premium Plugin</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon money"></span><br /><span
                                    class="tbl-sm-text"
                                    >Premium Plugin</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Third-party</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Extension</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Merge Tags (&#123;&#123; &#125;&#125;)</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span>
                            </td>
                            <td>
                                <span class="tbl-icon money"></span><br /><span
                                    class="tbl-sm-text"
                                    >Premium Plugin</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon money"></span><br /><span
                                    class="tbl-sm-text"
                                    >Premium Plugin</span
                                >
                            </td>
                            <td><span class="tbl-icon cross"></span></td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Custom Node</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Configurable Template Picker</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span>
                            </td>
                            <td>
                                <span class="tbl-icon money"></span><br /><span
                                    class="tbl-sm-text"
                                    >Premium Plugin</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon money"></span><br /><span
                                    class="tbl-sm-text"
                                    >Premium Plugin</span
                                >
                            </td>
                            <td><span class="tbl-icon cross"></span></td>
                            <td><span class="tbl-icon cross"></span></td>
                        </tr>
                        <tr>
                            <td>Interactive Image Resizing</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span>
                            </td>
                            <td><span class="tbl-icon check"></span></td>
                            <td><span class="tbl-icon check"></span></td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Third-party</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Extension</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Image Drag & Drop Upload</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span>
                            </td>
                            <td><span class="tbl-icon check"></span></td>
                            <td><span class="tbl-icon check"></span></td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Third-party</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Custom Extension</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Interactive Table Editor</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span>
                            </td>
                            <td><span class="tbl-icon check"></span></td>
                            <td><span class="tbl-icon check"></span></td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Third-party</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Extension</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Built-in HTML Source Dialog</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span>
                            </td>
                            <td><span class="tbl-icon check"></span></td>
                            <td><span class="tbl-icon check"></span></td>
                            <td><span class="tbl-icon cross"></span></td>
                            <td><span class="tbl-icon cross"></span></td>
                        </tr>
                        <tr>
                            <td>Image Upload + Server Delete Callback</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span><br /><span
                                    class="tbl-sm-text"
                                    >Built in</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Plugin / adapter</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Upload adapter</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Custom module</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Extension / custom</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Find, Preview, Print & Fullscreen UI</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span><br /><span
                                    class="tbl-sm-text"
                                    >Built in</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Plugin mix</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Build dependent</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon cross"></span><br /><span
                                    class="tbl-sm-text"
                                    >Custom UI</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Extension / custom</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Emoji, Symbols, Anchors & Date-Time</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span><br /><span
                                    class="tbl-sm-text"
                                    >Built in</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Plugin mix</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Plugin mix</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon cross"></span><br /><span
                                    class="tbl-sm-text"
                                    >Custom modules</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Extensions</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Responsive Menubar, Overflow & Status Bar</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span><br /><span
                                    class="tbl-sm-text"
                                    >Included UI</span
                                >
                            </td>
                            <td><span class="tbl-icon check"></span></td>
                            <td><span class="tbl-icon check"></span></td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Basic theme UI</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Headless / add UI</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>Typed Vue Props, Events, Slots & Methods</td>
                            <td class="highlight-col">
                                <span class="tbl-icon check"></span><br /><span
                                    class="tbl-sm-text"
                                    >First-party Vue 3</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Vue integration</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Vue integration</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Community wrapper</span
                                >
                            </td>
                            <td>
                                <span class="tbl-icon warn"></span><br /><span
                                    class="tbl-sm-text"
                                    >Vue integration</span
                                >
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq" class="faq-section">
            <h2 class="section-title">Frequently Asked Questions</h2>
            <div class="faq-grid">
                <details
                    class="faq-item"
                    :open="activeFaq === 0"
                    @click.prevent="activeFaq = activeFaq === 0 ? null : 0"
                >
                    <summary class="faq-summary">
                        Is it really free for commercial projects?
                    </summary>
                    <div class="faq-content">
                        Yes. @erag/text-editor-vue is 100% free and open-source
                        under the MIT License. There are no premium tiers, no
                        API keys, and no feature paywalls.
                    </div>
                </details>
                <details
                    class="faq-item"
                    :open="activeFaq === 1"
                    @click.prevent="activeFaq = activeFaq === 1 ? null : 1"
                >
                    <summary class="faq-summary">
                        Does it depend on TinyMCE, CKEditor, or Quill?
                    </summary>
                    <div class="faq-content">
                        No. It is built entirely from scratch specifically for
                        Vue 3. It utilizes native browser APIs (Selection,
                        Range, execCommand/DOMParser) which results in a
                        significantly smaller bundle size and native
                        performance.
                    </div>
                </details>
                <details
                    class="faq-item"
                    :open="activeFaq === 2"
                    @click.prevent="activeFaq = activeFaq === 2 ? null : 2"
                >
                    <summary class="faq-summary">
                        How do Mentions and Merge Tags work?
                    </summary>
                    <div class="faq-content">
                        Typing <code>@</code> triggers an async user search
                        dropdown, complete with debouncing and caching. Typing
                        <code>&#123;&#123;</code> triggers a dynamic merge tags
                        dropdown. Both are fully native Vue components rendered
                        over the editor canvas.
                    </div>
                </details>
                <details
                    class="faq-item"
                    :open="activeFaq === 3"
                    @click.prevent="activeFaq = activeFaq === 3 ? null : 3"
                >
                    <summary class="faq-summary">
                        Can I upload and resize images?
                    </summary>
                    <div class="faq-content">
                        Yes. The editor supports drag & drop, clipboard paste,
                        and URL insertion. Once inserted, clicking an image
                        reveals active corner handles for interactive resizing.
                    </div>
                </details>
                <details
                    class="faq-item"
                    :open="activeFaq === 4"
                    @click.prevent="activeFaq = activeFaq === 4 ? null : 4"
                >
                    <summary class="faq-summary">
                        Can I use it with Laravel or Inertia.js?
                    </summary>
                    <div class="faq-content">
                        Absolutely. It's heavily optimized for Laravel/Inertia
                        workflows. You can easily pass a custom
                        <code>imagesUploadHandler</code> function to handle CSRF
                        tokens and POST images directly to your Laravel
                        controllers.
                    </div>
                </details>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* Scoped styles for the custom home page */
.custom-home {
    font-family: var(--vp-font-family-base);
    color: var(--vp-c-text-1);
    overflow-x: hidden;
    margin-top: -64px; /* offset vitepress nav if we want a full bleed hero, but let's leave it as is, or use padding */
}

/* Gradients and Text */
.text-gradient {
    background: linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
}
.dark .text-gradient {
    background: linear-gradient(135deg, #2dd4bf 0%, #38bdf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 3rem;
    line-height: 1.2;
    letter-spacing: -0.02em;
}

/* Hero Section */
.hero-section {
    padding: 6rem 2rem 6rem;
    background: radial-gradient(
        circle at 50% -20%,
        var(--vp-c-brand-soft) 0%,
        transparent 60%
    );
    border-bottom: 1px solid var(--vp-c-divider);
}
.hero-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}
.hero-badge {
    display: inline-block;
    padding: 0.4rem 1rem;
    border-radius: 50px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-border);
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--vp-c-brand-1);
}
.hero-title {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 1.5rem;
}
.hero-subtitle {
    font-size: 1.25rem;
    line-height: 1.6;
    color: var(--vp-c-text-2);
    margin-bottom: 1rem;
}
.hero-description {
    font-size: 1.1rem;
    color: var(--vp-c-text-3);
    margin-bottom: 2.5rem;
    font-weight: 500;
}
.hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}
.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none !important;
    transition: all 0.2s ease;
}
.btn-primary {
    background: var(--vp-button-brand-bg);
    color: var(--vp-button-brand-text);
    border: 1px solid var(--vp-button-brand-border);
}
.btn-primary:hover {
    background: var(--vp-button-brand-hover-bg);
    color: var(--vp-button-brand-hover-text);
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(15, 118, 110, 0.2);
}
.btn-secondary {
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    border: 1px solid var(--vp-c-border);
}
.btn-secondary:hover {
    border-color: var(--vp-c-brand-1);
    transform: translateY(-2px);
}
.btn-outline {
    background: transparent;
    color: var(--vp-c-text-2);
    border: 1px dashed var(--vp-c-border);
}
.btn.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Editor Mockup */
.hero-visual {
    position: relative;
}
.editor-mockup {
    --hero-editor-border-color: var(--vp-c-border);

    background: var(--vp-c-bg);
    border: 1px solid var(--hero-editor-border-color);
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 2;
    transition:
        transform 0.5s ease,
        box-shadow 0.3s ease,
        border-color 0.3s ease;
}
.editor-mockup::after {
    position: absolute;
    z-index: 3;
    right: -1px;
    bottom: -1px;
    left: -1px;
    height: 13px;
    pointer-events: none;
    content: '';
    border-right: 1px solid var(--hero-editor-border-color);
    border-bottom: 1px solid var(--hero-editor-border-color);
    border-left: 1px solid var(--hero-editor-border-color);
    border-radius: 0 0 12px 12px;
}
.editor-mockup:not(:focus-within) {
    transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
}
.editor-inner {
    border-radius: 11px;
}
.dark .editor-mockup {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
.editor-mockup:hover {
    --hero-editor-border-color: color-mix(
        in srgb,
        var(--vp-c-brand-1) 45%,
        var(--vp-c-border)
    );
    border-color: var(--hero-editor-border-color);
    box-shadow: 0 28px 55px -12px rgba(0, 0, 0, 0.2);
}
.editor-mockup:not(:focus-within):hover {
    transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}
.editor-header {
    background: var(--vp-c-bg-soft);
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--vp-c-border);
    border-radius: 11px 11px 0 0;
}
.editor-dots i {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ff5f56;
    margin-right: 6px;
}
.editor-dots i:nth-child(2) {
    background: #ffbd2e;
}
.editor-dots i:nth-child(3) {
    background: #27c93f;
}
.editor-inner :deep(.erag-editor) {
    border: 0;
    border-radius: 0 0 11px 11px;
}
.editor-inner :deep(.erag-editor:focus-within) {
    box-shadow: none;
}
.editor-inner :deep(.erag-menu),
.editor-inner :deep(.erag-mention-dropdown),
.editor-inner :deep(.erag-merge-tag-dropdown),
.editor-inner :deep(.erag-mention-hover-card) {
    z-index: 10;
}
.floating-card {
    position: absolute;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    z-index: 4;
    animation: float 6s ease-in-out infinite;
}
.fc-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--vp-c-brand-1);
}
.dark .floating-card {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
.fc-1 {
    top: -20px;
    right: -20px;
    animation-delay: 0s;
}

.hero-feature-row {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2.5rem;
    position: relative;
    z-index: 1;
}
.feature-pill {
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    padding: 0.6rem 1.2rem;
    border-radius: 50px;
    box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--vp-c-text-1);
    transition: transform 0.2s;
}
.feature-pill:hover {
    transform: translateY(-2px);
}
.dark .feature-pill {
    box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.3);
}
@keyframes float {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0px);
    }
}

/* Trust Section */
.trust-section {
    padding: 3rem 1rem;
    background: var(--vp-c-bg-alt);
    border-bottom: 1px solid var(--vp-c-divider);
}
.trust-container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}
.trust-badge {
    padding: 0.5rem 1rem;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--vp-c-text-2);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

/* Features Grid */
.features-section {
    padding: 3rem 2rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}
.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}
.feature-card {
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-border);
    padding: 2rem;
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.feature-card:hover {
    border-color: var(--vp-c-brand-1);
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
}
.dark .feature-card:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
}
.fc-icon-large {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}
.feature-card:hover .fc-icon-large {
    background: var(--vp-c-brand-soft);
    border-color: var(--vp-c-brand-1);
    transform: scale(1.05);
}
.feature-card h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
}
.feature-card p {
    color: var(--vp-c-text-2);
    line-height: 1.6;
}

/* Comparison Section */
.comparison-section {
    padding: 2.5rem 2rem 6rem;
    background: var(--vp-c-bg-alt);
    border-top: 1px solid var(--vp-c-divider);
    border-bottom: 1px solid var(--vp-c-divider);
}
.comparison-table-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    overflow-x: auto;
}
.comparison-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--vp-c-bg);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--vp-c-border);
}
.comparison-table th,
.comparison-table td {
    padding: 1.25rem 0.5rem;
    text-align: center;
    border-bottom: 1px solid var(--vp-c-divider);
}
.comparison-table th:first-child,
.comparison-table td:first-child {
    text-align: left;
    padding-left: 1.5rem;
    font-weight: 500;
    color: var(--vp-c-text-1);
}
.comparison-table tbody tr {
    transition: background-color 0.2s;
}
.comparison-table tbody tr:hover {
    background-color: var(--vp-c-bg-soft);
}
.comparison-table th {
    background: var(--vp-c-bg-soft);
    font-weight: 700;
    font-size: 1.1rem;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
}
.highlight-col {
    background: var(--vp-c-brand-soft);
    font-weight: 700;
    color: var(--vp-c-brand-1);
}
.comparison-table tbody tr:hover .highlight-col {
    background: var(--vp-c-brand-soft);
}
.tbl-sm-text {
    font-size: 0.75rem;
    color: var(--vp-c-text-3);
    font-weight: 500;
    margin-top: 0.25rem;
    display: inline-block;
}
.tbl-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    vertical-align: text-bottom;
    margin-right: 6px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}
.tbl-icon.check {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
}
.tbl-icon.cross {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
}
.tbl-icon.warn {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'%3E%3C/path%3E%3Cline x1='12' y1='9' x2='12' y2='13'%3E%3C/line%3E%3Cline x1='12' y1='17' x2='12.01' y2='17'%3E%3C/line%3E%3C/svg%3E");
}
.tbl-icon.money {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8'%3E%3C/path%3E%3Cline x1='12' y1='18' x2='12' y2='22'%3E%3C/line%3E%3Cline x1='12' y1='2' x2='12' y2='6'%3E%3C/line%3E%3C/svg%3E");
}

/* FAQ */
.faq-section {
    padding: 6rem 2rem;
    max-width: 1000px;
    margin: 0 auto;
}

/* Responsive Design Improvements */
.custom-home {
    overflow-x: hidden;
    width: 100%;
    max-width: 100%;
}

.hero-container,
.hero-content,
.hero-visual,
.editor-mockup {
    max-width: 100%;
    box-sizing: border-box;
}

.editor-mockup {
    overflow: visible;
}

.editor-inner {
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 11px;
}


.editor-inner :deep(.erag-editor) {
    max-width: 100%;
    box-sizing: border-box;
}

.editor-inner :deep(.erag-menu),
.editor-inner :deep(.erag-menubar),
.editor-inner :deep(.erag-toolbar) {
    max-width: 100%;
    overflow-x: auto;
    flex-wrap: wrap;
    box-sizing: border-box;
}

@media (max-width: 1024px) {
    .hero-container {
        gap: 2.5rem;
    }
    .hero-title {
        font-size: 2.75rem;
    }
}

@media (max-width: 900px) {
    .hero-section {
        padding: 3.5rem 1.25rem 3.5rem;
    }
    .hero-container {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
    }
    .hero-actions {
        justify-content: center;
    }
    .hero-title {
        font-size: 2.35rem;
        word-break: break-word;
        overflow-wrap: break-word;
    }
    .hero-subtitle {
        font-size: 1.05rem;
        word-break: break-word;
    }
    .hero-visual {
        margin-top: 1.5rem;
        width: 100%;
    }
    .fc-1 {
        top: -15px;
        right: 10px;
    }
    .comparison-section {
        padding: 2.5rem 1rem 4rem;
    }
}

@media (max-width: 640px) {
    .hero-section {
        padding: 2.5rem 0.85rem 2.5rem;
    }
    .hero-badge {
        font-size: 0.78rem;
        padding: 0.35rem 0.8rem;
        margin-bottom: 1rem;
    }
    .hero-title {
        font-size: 1.85rem;
        line-height: 1.25;
        margin-bottom: 0.85rem;
    }
    .hero-subtitle {
        font-size: 0.95rem;
        line-height: 1.5;
        margin-bottom: 0.8rem;
    }
    .hero-description {
        font-size: 0.85rem;
        margin-bottom: 1.25rem;
    }
    .hero-actions {
        flex-direction: column;
        width: 100%;
        gap: 0.65rem;
    }
    .btn {
        width: 100%;
        text-align: center;
        padding: 0.7rem 1.25rem;
        box-sizing: border-box;
    }
    .fc-1 {
        position: relative;
        top: 0;
        right: 0;
        margin: 0.75rem auto 0;
        width: max-content;
        animation: none;
    }
    .hero-feature-row {
        gap: 0.4rem;
        margin-top: 1.25rem;
    }
    .feature-pill {
        padding: 0.4rem 0.75rem;
        font-size: 0.8rem;
    }
    .trust-section {
        padding: 1.75rem 0.5rem;
    }
    .trust-badge {
        font-size: 0.78rem;
        padding: 0.35rem 0.65rem;
    }
    .features-section {
        padding: 2rem 0.85rem 1.25rem;
    }
    .section-title {
        font-size: 1.65rem;
        margin-bottom: 1.5rem;
    }
    .features-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    .feature-card {
        padding: 1.25rem;
    }
    .fc-icon-large {
        width: 3rem;
        height: 3rem;
        font-size: 1.35rem;
        margin-bottom: 0.85rem;
    }
    .comparison-section {
        padding: 1.75rem 0.5rem 2.5rem;
    }
    .comparison-table-wrapper {
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    .comparison-table {
        min-width: 480px;
    }
    .faq-section {
        padding: 2.5rem 0.85rem;
    }
}

@media (max-width: 380px) {
    .hero-title {
        font-size: 1.6rem;
    }
    .feature-pill {
        font-size: 0.75rem;
        padding: 0.35rem 0.55rem;
    }
}

</style>

