<script setup lang="ts">
import { withBase } from 'vitepress'
import { ref } from 'vue'

type CodeTab = 'request' | 'facade' | 'blade' | 'rfcdns'
const activeTab = ref<CodeTab>('request')

const composerCopied = ref(false)
const codeCopied = ref(false)

const copyToClipboard = async (text: string, type: 'composer' | 'code') => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    if (type === 'composer') {
      composerCopied.value = true
      setTimeout(() => { composerCopied.value = false }, 2000)
    } else {
      codeCopied.value = true
      setTimeout(() => { codeCopied.value = false }, 2000)
    }
  } catch {
    // Graceful fallback
  }
}

const copyComposer = () => {
  copyToClipboard('composer require erag/laravel-disposable-email', 'composer')
}

const codeSnippets: Record<CodeTab, { title: string; filename: string; code: string; html: string; preview: { label: string; status: string; statusType: 'blocked' | 'success' | 'warning'; detail: string } }> = {
  request: {
    title: 'Form Request',
    filename: 'RegisterRequest.php',
    code: `public function rules(): array
{
    return [
        'name'  => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'disposable_email'],
    ];
}`,
    html: `<div class="hwb-line"><span class="hwb-ln">1</span><span class="tok-kw">public function </span><span class="tok-fn">rules</span>()<span class="tok-punc">: </span><span class="tok-cls">array</span></div><div class="hwb-line"><span class="hwb-ln">2</span><span class="tok-punc">{</span></div><div class="hwb-line"><span class="hwb-ln">3</span>&nbsp;&nbsp;<span class="tok-kw">return </span><span class="tok-punc">[</span></div><div class="hwb-line"><span class="hwb-ln">4</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="tok-str">'name'</span>&nbsp;&nbsp;<span class="tok-op">=&gt; </span><span class="tok-punc">[</span><span class="tok-str">'required'</span><span class="tok-punc">, </span><span class="tok-str">'string'</span><span class="tok-punc">, </span><span class="tok-str">'max:255'</span><span class="tok-punc">],</span></div><div class="hwb-line is-glow"><span class="hwb-ln">5</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="tok-str">'email'</span>&nbsp;<span class="tok-op">=&gt; </span><span class="tok-punc">[</span><span class="tok-str">'required'</span><span class="tok-punc">, </span><span class="tok-str">'email'</span><span class="tok-punc">, </span><span class="tok-rule">'disposable_email'</span><span class="tok-punc">],</span></div><div class="hwb-line"><span class="hwb-ln">6</span>&nbsp;&nbsp;<span class="tok-punc">];</span></div><div class="hwb-line"><span class="hwb-ln">7</span><span class="tok-punc">}</span></div>`,
    preview: {
      label: 'Input: user@tempmail.com',
      status: '422 Unprocessable',
      statusType: 'blocked',
      detail: '"The selected email is a disposable address."'
    }
  },
  facade: {
    title: 'Facade Check',
    filename: 'AuthController.php',
    code: `use Erag\\LaravelDisposableEmail\\Facades\\Disposable;

// Instant runtime verification in controllers or jobs
if (Disposable::isDisposable($email)) {
    throw ValidationException::withMessages([
        'email' => 'Disposable inboxes are not allowed.',
    ]);
}`,
    html: `<div class="hwb-line"><span class="hwb-ln">1</span><span class="tok-kw">use </span><span class="tok-cls">Erag\\LaravelDisposableEmail\\Facades\\Disposable</span><span class="tok-punc">;</span></div><div class="hwb-line"><span class="hwb-ln">2</span></div><div class="hwb-line"><span class="hwb-ln">3</span><span class="tok-cmt">// Instant runtime verification in controllers or jobs</span></div><div class="hwb-line is-glow"><span class="hwb-ln">4</span><span class="tok-kw">if </span><span class="tok-punc">(</span><span class="tok-cls">Disposable</span><span class="tok-op">::</span><span class="tok-fn">isDisposable</span><span class="tok-punc">(</span><span class="tok-var">$email</span><span class="tok-punc">)) {</span></div><div class="hwb-line"><span class="hwb-ln">5</span>&nbsp;&nbsp;<span class="tok-kw">throw </span><span class="tok-cls">ValidationException</span><span class="tok-op">::</span><span class="tok-fn">withMessages</span><span class="tok-punc">([</span></div><div class="hwb-line"><span class="hwb-ln">6</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="tok-str">'email'</span><span class="tok-op"> =&gt; </span><span class="tok-str">'Disposable inboxes are not allowed.'</span><span class="tok-punc">,</span></div><div class="hwb-line"><span class="hwb-ln">7</span>&nbsp;&nbsp;<span class="tok-punc">]);</span></div><div class="hwb-line"><span class="hwb-ln">8</span><span class="tok-punc">}</span></div>`,
    preview: {
      label: 'Disposable::isDisposable("burner@mailinator.com")',
      status: 'true (Blocked)',
      statusType: 'blocked',
      detail: 'Aborts execution before any database writes'
    }
  },
  blade: {
    title: 'Blade View',
    filename: 'account-notice.blade.php',
    code: `@disposableEmail($user->email)
    <div class="alert alert-warning">
        ⚠️ Temporary email detected! Please update your inbox.
    </div>
@else
    <span class="badge-success">✓ Permanent Inbox</span>
@enddisposableEmail`,
    html: `<div class="hwb-line"><span class="hwb-ln">1</span><span class="tok-cmt">{{-- Realtime condition in Blade views --}}</span></div><div class="hwb-line is-glow"><span class="hwb-ln">2</span><span class="tok-blade">@disposableEmail</span><span class="tok-punc">(</span><span class="tok-var">$user</span><span class="tok-op">-&gt;</span><span class="tok-prop">email</span><span class="tok-punc">)</span></div><div class="hwb-line"><span class="hwb-ln">3</span>&nbsp;&nbsp;<span class="tok-tag">&lt;div </span><span class="tok-attr">class</span><span class="tok-op">=</span><span class="tok-str">"alert alert-warning"</span><span class="tok-tag">&gt;</span></div><div class="hwb-line"><span class="hwb-ln">4</span>&nbsp;&nbsp;&nbsp;&nbsp;⚠️ Temporary email detected! Please update your inbox.</div><div class="hwb-line"><span class="hwb-ln">5</span>&nbsp;&nbsp;<span class="tok-tag">&lt;/div&gt;</span></div><div class="hwb-line"><span class="hwb-ln">6</span><span class="tok-blade">@else</span></div><div class="hwb-line"><span class="hwb-ln">7</span>&nbsp;&nbsp;<span class="tok-tag">&lt;span </span><span class="tok-attr">class</span><span class="tok-op">=</span><span class="tok-str">"badge-success"</span><span class="tok-tag">&gt;</span>✓ Permanent Inbox<span class="tok-tag">&lt;/span&gt;</span></div><div class="hwb-line"><span class="hwb-ln">8</span><span class="tok-blade">@enddisposableEmail</span></div>`,
    preview: {
      label: '@disposableEmail("test@0-mail.com")',
      status: 'Render Warning',
      statusType: 'warning',
      detail: 'Displays warning alert directly in user dashboard'
    }
  },
  rfcdns: {
    title: 'RFC & DNS Mode',
    filename: 'StrictCheckoutRequest.php',
    code: `// Combines local blacklist + RFC 5322 + live MX check
$request->validate([
    'email' => [
        'required',
        'disposable_email:rfc,dns,spoof',
    ],
]);`,
    html: `<div class="hwb-line"><span class="hwb-ln">1</span><span class="tok-cmt">// Combines local blacklist + RFC 5322 + live MX check</span></div><div class="hwb-line"><span class="hwb-ln">2</span><span class="tok-var">$request</span><span class="tok-op">-&gt;</span><span class="tok-fn">validate</span><span class="tok-punc">([</span></div><div class="hwb-line"><span class="hwb-ln">3</span>&nbsp;&nbsp;<span class="tok-str">'email'</span><span class="tok-op"> =&gt; </span><span class="tok-punc">[</span></div><div class="hwb-line"><span class="hwb-ln">4</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="tok-str">'required'</span><span class="tok-punc">,</span></div><div class="hwb-line is-glow"><span class="hwb-ln">5</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="tok-rule">'disposable_email:rfc,dns,spoof'</span><span class="tok-punc">,</span></div><div class="hwb-line"><span class="hwb-ln">6</span>&nbsp;&nbsp;<span class="tok-punc">],</span></div><div class="hwb-line"><span class="hwb-ln">7</span><span class="tok-punc">]);</span></div>`,
    preview: {
      label: 'disposable_email:rfc,dns,spoof',
      status: 'Deep Inspection',
      statusType: 'success',
      detail: 'Checks offline database + DNS MX host + Unicode spoof'
    }
  }
}

const copyActiveCode = () => {
  copyToClipboard(codeSnippets[activeTab.value].code, 'code')
}

const tickerDomains = [
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'yopmail.com',
  'trashmail.com',
  'dispostable.com',
  'fakeinbox.com',
  '0-mail.com',
  'getairmail.com',
  'temp-mail.org',
  'throwawaymail.com',
  'burnermail.io'
]
</script>

<template>
  <div class="home-redesign">
    <!-- HERO SECTION START -->
    <header class="hero-wrapper">
      <!-- Ambient Glows -->
      <div class="hero-glow-1" aria-hidden="true"></div>
      <div class="hero-glow-2" aria-hidden="true"></div>

      <div class="hero-grid">
        <!-- Hero Left / Content -->
        <div class="hero-content">
          <div class="hero-badge-row">
            <div class="hero-badge">
              <span class="pulse-indicator">
                <span class="pulse-dot"></span>
                <span class="pulse-ring"></span>
              </span>
              <span class="hero-badge-text">Open-Source Laravel Package</span>
            </div>
            <div class="hero-version-tag" title="Compatible with Laravel 10, 11, 12, and 13">
              <span class="laravel-icon-wrap" aria-hidden="true">
                <svg viewBox="0 0 50 52" class="laravel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M49.626 11.564a.809.809 0 0 1 .028.209v10.972a.8.8 0 0 1-.402.694l-9.209 5.302V39.25c0 .286-.152.55-.4.694L20.42 51.01c-.044.025-.092.041-.14.058-.018.006-.035.017-.054.022a.805.805 0 0 1-.41 0c-.022-.006-.042-.018-.063-.026-.044-.016-.09-.03-.132-.054L.402 39.944A.801.801 0 0 1 0 39.25V6.334c0-.072.01-.142.028-.21.006-.023.02-.044.028-.067.015-.042.029-.085.051-.124.015-.026.037-.047.055-.071.023-.032.044-.065.071-.093.023-.023.053-.04.079-.06.029-.024.055-.05.088-.069h.001l9.61-5.533a.802.802 0 0 1 .8 0l9.61 5.533h.002c.032.02.059.045.088.068.026.02.055.038.078.06.028.029.048.062.072.094.017.024.04.045.054.071.023.04.036.082.052.124.008.023.022.044.028.068a.809.809 0 0 1 .028.209v20.559l8.008-4.611v-10.51c0-.07.01-.141.028-.208.007-.024.02-.045.028-.068.016-.042.03-.085.052-.124.015-.026.037-.047.054-.071.024-.032.044-.065.072-.093.023-.023.052-.04.078-.06.03-.024.056-.05.088-.069h.001l9.611-5.533a.801.801 0 0 1 .8 0l9.61 5.533c.034.02.06.045.09.068.025.02.054.038.077.06.028.029.048.062.072.094.018.024.04.045.054.071.023.039.036.082.052.124.009.023.022.044.028.068zm-1.574 10.718v-9.124l-3.363 1.936-4.646 2.675v9.124l8.01-4.611zm-9.61 16.505v-9.13l-4.57 2.61-13.05 7.448v9.216l17.62-10.144zM1.602 7.719v31.068L19.22 48.93v-9.214l-9.204-5.209-.003-.002-.004-.002c-.031-.018-.057-.044-.086-.066-.025-.02-.054-.036-.076-.058l-.002-.003c-.026-.025-.044-.056-.066-.084-.02-.027-.044-.05-.06-.078l-.001-.003c-.018-.03-.029-.066-.042-.1-.013-.03-.03-.058-.038-.09v-.001c-.01-.038-.012-.078-.016-.117-.004-.03-.012-.06-.012-.09v-.002-21.481L4.965 9.654 1.602 7.72zm8.81-5.994L2.405 6.334l8.005 4.609 8.006-4.61-8.006-4.608zm4.164 28.764l4.645-2.674V7.719l-3.363 1.936-4.646 2.675v20.096l3.364-1.937zM39.243 7.164l-8.006 4.609 8.006 4.609 8.005-4.61-8.005-4.608zm-.801 10.605l-4.646-2.675-3.363-1.936v9.124l4.645 2.674 3.364 1.937v-9.124zM20.02 38.33l11.743-6.704 5.87-3.35-8-4.606-9.211 5.303-8.395 4.833 7.993 4.524z" fill="#FF2D20" fill-rule="evenodd"/>
                </svg>
              </span>
              <span class="version-label">Laravel</span>
              <span class="version-pill">10x - 13x</span>
            </div>
          </div>

          <h1 class="hero-headline">
            Laravel Disposable Email Validator
          </h1>

          <p class="hero-tagline">
            Block Temporary Emails Before They Enter Your App.
          </p>

          <p class="hero-subtext">
            Protect registrations, free trials, and lead forms with erag/laravel-disposable-email. Detect disposable email domains using local checks, custom blocklists, and automatic list updates. Enable optional RFC and DNS validation when needed.
          </p>

          <!-- 1-Click Install Command Pill -->
          <div class="hero-install-shell">
            <div class="hero-install-command" @click="copyComposer" role="button" tabindex="0" title="Click to copy install command">
              <span class="install-prompt">$</span>
              <code class="install-text">composer require erag/laravel-disposable-email</code>
              <button type="button" class="install-copy-btn" :class="{ 'is-copied': composerCopied }" aria-label="Copy composer command">
                <svg v-if="!composerCopied" class="copy-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <svg v-else class="check-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span class="copy-feedback" v-if="composerCopied">Copied!</span>
              </button>
            </div>
          </div>

          <!-- Hero CTAs -->
          <div class="hero-actions">
            <a :href="withBase('/getting-started.html')" class="hero-btn hero-btn-primary">
              <span>Get Started</span>
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </a>
            <a href="#email-demo" class="hero-btn hero-btn-secondary">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              <span>Try Live Demo</span>
            </a>
            <a href="https://github.com/eramitgupta/laravel-disposable-email" target="_blank" rel="noopener" class="hero-btn hero-btn-github" title="View on GitHub">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        <!-- Hero Right / Interactive Code Workbench -->
        <div class="hero-workbench">
          <div class="hwb-window">
            <!-- Window Header -->
            <div class="hwb-topbar">
              <div class="hwb-lights">
                <span class="hwb-dot hwb-dot-red"></span>
                <span class="hwb-dot hwb-dot-amber"></span>
                <span class="hwb-dot hwb-dot-green"></span>
              </div>
              <div class="hwb-file-info">
                <svg class="hwb-file-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span class="hwb-filename">{{ codeSnippets[activeTab].filename }}</span>
              </div>
              <button type="button" class="hwb-copy-action" @click="copyActiveCode" :title="'Copy ' + codeSnippets[activeTab].title + ' snippet'">
                <svg v-if="!codeCopied" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span class="hwb-copy-text">{{ codeCopied ? 'Copied!' : 'Copy' }}</span>
              </button>
            </div>

            <!-- Tab Switcher -->
            <div class="hwb-tabbar">
              <button
                v-for="(snippet, key) in codeSnippets"
                :key="key"
                type="button"
                class="hwb-tab"
                :class="{ 'is-selected': activeTab === key }"
                @click="activeTab = key"
              >
                <span class="hwb-tab-title">{{ snippet.title }}</span>
              </button>
            </div>

            <!-- Syntax Highlighted Code Canvas -->
            <div class="hwb-editor">
              <div class="hwb-code-scroll" v-html="codeSnippets[activeTab].html"></div>
            </div>

            <!-- Execution Feedback Dock -->
            <div class="hwb-dock">
              <div class="hwb-dock-top">
                <div class="hwb-dock-label">
                  <span class="hwb-dock-radar">
                    <span class="hwb-radar-dot"></span>
                    <span class="hwb-radar-pulse"></span>
                  </span>
                  <span>SIMULATED EXECUTION</span>
                </div>
                <span class="hwb-dock-perf">&lt; 0.02ms (Local Cache Hit)</span>
              </div>
              <div class="hwb-dock-output">
                <div class="hwb-dock-input">
                  <span class="hwb-dock-tag">INPUT</span>
                  <span class="hwb-dock-val">{{ codeSnippets[activeTab].preview.label }}</span>
                </div>
                <div class="hwb-dock-response" :class="'resp-' + codeSnippets[activeTab].preview.statusType">
                  <span class="hwb-resp-pill">
                    <svg v-if="codeSnippets[activeTab].preview.statusType === 'blocked'" viewBox="0 0 20 20" width="12" height="12" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="codeSnippets[activeTab].preview.statusType === 'success'" viewBox="0 0 20 20" width="12" height="12" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else viewBox="0 0 20 20" width="12" height="12" fill="currentColor">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ codeSnippets[activeTab].preview.status }}
                  </span>
                  <span class="hwb-resp-note">{{ codeSnippets[activeTab].preview.detail }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hero Stats Matrix (Full Row) -->
      <div class="hero-stats-matrix">
        <div class="stat-box">
          <span class="stat-number">&lt; 0.02ms</span>
          <span class="stat-label">Zero HTTP Overhead</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">124,220+</span>
          <span class="stat-label">Known Threat Domains</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">Custom Blacklist</span>
          <span class="stat-label">Add Your Own Domains</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">100% Offline</span>
          <span class="stat-label">GDPR &amp; Privacy Safe</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">
            <span class="stat-pulse-dot"></span>
            Daily Sync
          </span>
          <span class="stat-label">GitHub Actions Pipeline</span>
        </div>
        <a href="https://github.com/eramitgupta/disposable-email" target="_blank" rel="noopener" class="stat-box stat-box-link" title="Open Official Blacklist Repository on GitHub">
          <span class="stat-number">Official Repo <span class="stat-link-arrow">↗</span></span>
          <span class="stat-label">Self-Maintained Blacklist</span>
        </a>
      </div>

      <!-- Domain Threat Marquee Ticker -->
      <div class="hero-ticker-band">
        <div class="ticker-badge">
          <span class="ticker-pulse"></span>
          <span>BLOCKED SAMPLES</span>
        </div>
        <div class="ticker-track-wrap">
          <div class="ticker-track">
            <span v-for="(dom, idx) in tickerDomains" :key="'dom1-' + idx" class="ticker-item">
              <span class="domain-name">{{ dom }}</span>
              <span class="domain-block-tag">BLOCKED</span>
            </span>
            <!-- Duplicate for seamless looping -->
            <span v-for="(dom, idx) in tickerDomains" :key="'dom2-' + idx" class="ticker-item" aria-hidden="true">
              <span class="domain-name">{{ dom }}</span>
              <span class="domain-block-tag">BLOCKED</span>
            </span>
          </div>
        </div>
      </div>
    </header>
    <!-- HERO SECTION END -->

    <div class="home-features-wrapper">
      <div class="section-heading-wrap">
        <h2 class="section-main-title">Disposable Email Validation Features</h2>
      </div>
      <div class="home-feature-grid">
        <div class="home-feature-card">
          <span class="home-icon">RULE</span>
          <h3 class="feature-card-title">Flexible validation</h3>
          <p>
            Block temporary inboxes with <code>disposable_email</code>, then opt into RFC, DNS, spoof,
            or filter checks when needed.
          </p>
        </div>
        <div class="home-feature-card">
          <span class="home-icon">RUNTIME</span>
          <h3 class="feature-card-title">Runtime checks</h3>
          <p>Check email addresses anywhere in your app using the rule class or facade.</p>
        </div>
        <div class="home-feature-card">
          <span class="home-icon">SYNC</span>
          <h3 class="feature-card-title">Remote syncing</h3>
          <p>Keep your domain list fresh by syncing from a remote source whenever you need to.</p>
        </div>
        <div class="home-feature-card">
          <span class="home-icon">CACHE</span>
          <h3 class="feature-card-title">Optional caching</h3>
          <p>Speed up repeated lookups in busy applications with built-in cache support.</p>
        </div>
      </div>
    </div>

    <EmailCheckDemo />

    <div class="home-release-panel">
      <div class="home-release-copy">
        <span class="section-label release-label">New in this release</span>
        <h2>Add RFC and DNS Email Validation</h2>
        <p>
          Combine disposable-domain blocking with optional email syntax and DNS MX checks.
        </p>
        <pre class="home-release-code"><span>'disposable_email:rfc'</span><span>'disposable_email:dns'</span><span>'disposable_email:rfc,dns'</span></pre>
        <div class="quick-links">
          <a :href="withBase('/advanced/rfc-dns.html')">Explore RFC / DNS validation</a>
        </div>
      </div>
      <div class="home-release-list">
        <div>
          <span>RFC</span>
          <strong>RFC and strict modes</strong>
          <p>Validate supported email RFCs and optionally reject RFC warnings.</p>
        </div>
        <div>
          <span>DNS</span>
          <strong>Mailbox domain checks</strong>
          <p>Opt into DNS lookups and require the email domain to have a valid MX record.</p>
        </div>
        <div>
          <span>SPOOF</span>
          <strong>Unicode spoof protection</strong>
          <p>Reject deceptive Unicode addresses using the optional spoof validator.</p>
        </div>
        <div>
          <span>FILTER</span>
          <strong>PHP filter modes</strong>
          <p>Choose standard or Unicode-aware <code>filter_var</code> validation.</p>
        </div>
      </div>
    </div>

    <!-- Practical Usage & Real-World Implementation Section -->
    <div class="practical-section-wrapper">
      <div class="practical-header">
        <div class="practical-badge">
          <span class="badge-pulse-dot"></span>
          <span class="badge-text">PRACTICAL USAGE</span>
        </div>
        <h2 class="practical-title">
          Stop Fake Accounts & Trial Abuse Across Every Entry Point
        </h2>
        <p class="practical-subtitle">
          Deploy zero-latency email validation across user registrations, SaaS trials, lead capture, and API endpoints.
        </p>
      </div>

      <div class="practical-grid">
        <!-- Card 1: What the Package Includes -->
        <div class="practical-card capabilities-card">
          <div class="card-glow-top"></div>
          <div class="card-head">
            <div class="card-head-icon icon-capabilities">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <div class="card-head-info">
              <span class="card-kicker">BUILT-IN ARSENAL</span>
              <h3 class="card-title">What the Package Includes</h3>
            </div>
            <span class="card-pill-count">6 Features</span>
          </div>

          <div class="feature-rows">
            <!-- Feature 1 -->
            <div class="feature-row">
              <div class="feature-icon-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div class="feature-body">
                <div class="feature-body-header">
                  <strong>Massive Threat Database</strong>
                  <span class="feature-tag">124k+ Domains</span>
                </div>
                <p>Large built-in disposable domain list ready to use out of the box with zero network latency.</p>
              </div>
            </div>

            <!-- Feature 2 -->
            <div class="feature-row">
              <div class="feature-icon-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div class="feature-body">
                <div class="feature-body-header">
                  <strong>Flexible Validation Rules</strong>
                  <span class="feature-tag">String &amp; Object</span>
                </div>
                <p>Seamless support for both classic <code>'disposable_email'</code> string rules and dedicated rule objects.</p>
              </div>
            </div>

            <!-- Feature 3 -->
            <div class="feature-row">
              <div class="feature-icon-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div class="feature-body">
                <div class="feature-body-header">
                  <strong>Advanced Protocol Modes</strong>
                  <span class="feature-tag">RFC &amp; DNS MX</span>
                </div>
                <p>Optional RFC 5322 strict formatting, active DNS MX lookups, spoof prevention, and PHP filter modes.</p>
              </div>
            </div>

            <!-- Feature 4 -->
            <div class="feature-row">
              <div class="feature-icon-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <div class="feature-body">
                <div class="feature-body-header">
                  <strong>Facade &amp; Runtime Checks</strong>
                  <span class="feature-tag">Zero Overhead</span>
                </div>
                <p>Instant <code>Disposable::email(...)</code> verification for service classes, controllers, and custom business logic.</p>
              </div>
            </div>

            <!-- Feature 5 -->
            <div class="feature-row">
              <div class="feature-icon-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <div class="feature-body">
                <div class="feature-body-header">
                  <strong>Native Blade Directives</strong>
                  <span class="feature-tag">UI Helpers</span>
                </div>
                <p>Drop <code>@disposableEmail(...)</code> directly into Blade views for clean conditional rendering and user warnings.</p>
              </div>
            </div>

            <!-- Feature 6 -->
            <div class="feature-row">
              <div class="feature-icon-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </svg>
              </div>
              <div class="feature-body">
                <div class="feature-body-header">
                  <strong>Auto-Sync &amp; Local Cache</strong>
                  <span class="feature-tag">Production Ready</span>
                </div>
                <p>Remote syncing via Artisan commands, custom blacklist files, and memory caching for high-volume pipelines.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Where it fits best -->
        <div class="practical-card usecase-card">
          <div class="card-glow-top"></div>
          <div class="card-head">
            <div class="card-head-icon icon-usecase">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <div class="card-head-info">
              <span class="card-kicker">STRATEGIC IMPACT</span>
              <h3 class="card-title">Common Use Cases</h3>
            </div>
            <span class="card-pill-count">5 Scenarios</span>
          </div>

          <div class="usecase-rows">
            <!-- Use case 1 -->
            <div class="usecase-row">
              <div class="usecase-number-badge">01</div>
              <div class="usecase-body">
                <div class="usecase-body-header">
                  <strong>Registration &amp; Account Creation</strong>
                  <span class="usecase-chip chip-cyan">Auth Flows</span>
                </div>
                <p>Block burner addresses instantly during signup to prevent database pollution, dead email accounts, and bot spam.</p>
              </div>
            </div>

            <!-- Use case 2 -->
            <div class="usecase-row">
              <div class="usecase-number-badge">02</div>
              <div class="usecase-body">
                <div class="usecase-body-header">
                  <strong>Free Trial &amp; Promo Protection</strong>
                  <span class="usecase-chip chip-amber">Revenue Shield</span>
                </div>
                <p>Prevent users from endlessly creating new accounts to reuse free trial periods, starter credits, or welcome coupons.</p>
              </div>
            </div>

            <!-- Use case 3 -->
            <div class="usecase-row">
              <div class="usecase-number-badge">03</div>
              <div class="usecase-body">
                <div class="usecase-body-header">
                  <strong>B2B Onboarding &amp; Corporate Leads</strong>
                  <span class="usecase-chip chip-emerald">Lead Quality</span>
                </div>
                <p>Ensure that whitepapers, webinars, demo bookings, and sales inquiries capture genuine business and corporate domains.</p>
              </div>
            </div>

            <!-- Use case 4 -->
            <div class="usecase-row">
              <div class="usecase-number-badge">04</div>
              <div class="usecase-body">
                <div class="usecase-body-header">
                  <strong>Admin Tools &amp; Security Moderation</strong>
                  <span class="usecase-chip chip-indigo">SecOps</span>
                </div>
                <p>Audit user databases, screen incoming contact form leads, and flag high-risk disposable accounts inside admin dashboards.</p>
              </div>
            </div>

            <!-- Use case 5 -->
            <div class="usecase-row">
              <div class="usecase-number-badge">05</div>
              <div class="usecase-body">
                <div class="usecase-body-header">
                  <strong>Invite Loops &amp; Referral Systems</strong>
                  <span class="usecase-chip chip-purple">Anti-Fraud</span>
                </div>
                <p>Eliminate referral fraud and fake invite exploits where bad actors trigger referral rewards with burner emails.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="home-cta-panel">
      <span class="section-label">Explore docs</span>
      <h2>Install and Configure Laravel Disposable Email</h2>
      <p>
        Follow the documentation to install the package, configure validation, sync your domain list, and enable caching.
      </p>
      <div class="quick-links">
        <a :href="withBase('/getting-started.html')">Installation guide</a>
        <a :href="withBase('/configuration.html')">Configuration options</a>
        <a :href="withBase('/advanced/rfc-dns.html')">RFC / DNS validation</a>
        <a :href="withBase('/sync-and-blacklist.html')">Sync and blacklist</a>
        <a :href="withBase('/caching.html')">Caching notes</a>
      </div>
    </div>

    <!-- FAQ Accordion section (SEO Optimized) -->
    <div class="home-faq-section">
      <div class="faq-header">
        <div class="faq-badge">
          <span class="badge-pulse-dot"></span>
          <span class="badge-text">FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2>Laravel Disposable Email: Frequently Asked Questions</h2>
        <p class="faq-subtitle">
          Authoritative answers to common questions about blocking temporary fake inboxes, sub-millisecond offline validation, RFC/DNS MX modes, Blade directives, and abuse prevention.
        </p>
      </div>

      <div class="faq-list">
        <!-- FAQ 1: Validation Rule -->
        <details class="faq-item" open>
          <summary>
            <div class="faq-summary-left">
              <span class="faq-tag tag-primary">Validation Rule</span>
              <span class="faq-question">How do I validate and block disposable emails in Laravel forms and requests?</span>
            </div>
            <span class="faq-icon-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <div class="faq-content">
            <p>Add the <code>'disposable_email'</code> rule to any Form Request or controller validator array alongside standard rules like <code>'required'</code> and <code>'email'</code>. When a user submits an address belonging to a known temporary or disposable domain, Laravel automatically halts the validation pipeline and returns a standard <code>422 Unprocessable Entity</code> response with your custom error message.</p>
          </div>
        </details>

        <!-- FAQ 2: Offline Speed & 124k DB -->
        <details class="faq-item">
          <summary>
            <div class="faq-summary-left">
              <span class="faq-tag tag-success">Offline Speed (&lt;0.4ms)</span>
              <span class="faq-question">Does this Laravel disposable email validator work 100% offline without third-party API keys?</span>
            </div>
            <span class="faq-icon-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <div class="faq-content">
            <p><strong>Yes, completely offline.</strong> The package includes a pre-downloaded local threat database of over <strong>124,220+ known disposable domains</strong> stored directly on your server. Lookups execute in sub-millisecond time (under 0.4ms) using memory-efficient hash maps without relying on external SaaS APIs, API quotas, recurring monthly charges, or network latency.</p>
          </div>
        </details>

        <!-- FAQ 3: RFC & DNS MX Check -->
        <details class="faq-item">
          <summary>
            <div class="faq-summary-left">
              <span class="faq-tag tag-cyan">RFC &amp; DNS MX</span>
              <span class="faq-question">How can I enable strict RFC 5322 syntax and live MX record DNS verification?</span>
            </div>
            <span class="faq-icon-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <div class="faq-content">
            <p>You can append parameters directly to the rule: <code>'disposable_email:rfc,dns,spoof'</code>. The <code>:dns</code> mode performs real-time DNS queries to verify that the domain has active Mail Exchange (MX) records ready to receive messages, while <code>:rfc</code> enforces strict RFC 5322 formatting compliance and <code>:spoof</code> detects deceptive Unicode homoglyph attacks.</p>
          </div>
        </details>

        <!-- FAQ 4: Runtime Facade -->
        <details class="faq-item">
          <summary>
            <div class="faq-summary-left">
              <span class="faq-tag tag-amber">Runtime Facade</span>
              <span class="faq-question">How do I check disposable emails in services, background jobs, or controllers via Facade?</span>
            </div>
            <span class="faq-icon-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <div class="faq-content">
            <p>Use the <code>Disposable</code> facade anywhere in your PHP logic by calling <code>Disposable::email($email)</code>. It returns a fast boolean (<code>true</code> if disposable, <code>false</code> if legitimate). This makes it straightforward to reject burner addresses inside webhook consumers, background queues, API gateways, or batch data import scripts without writing a form request.</p>
          </div>
        </details>

        <!-- FAQ 5: Blade Directive -->
        <details class="faq-item">
          <summary>
            <div class="faq-summary-left">
              <span class="faq-tag tag-purple">Blade Directives</span>
              <span class="faq-question">How do I use disposable email validation in Laravel Blade views?</span>
            </div>
            <span class="faq-icon-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <div class="faq-content">
            <p>The package registers a native <code>@disposableEmail($email)</code> directive with matching <code>@else</code> and <code>@enddisposableEmail</code> tags. You can use it directly in Blade templates to conditionally display warning banners, highlight accounts requiring email updates, or disable sensitive payout buttons without any custom controller boilerplate.</p>
          </div>
        </details>

        <!-- FAQ 6: Auto Sync Artisan -->
        <details class="faq-item">
          <summary>
            <div class="faq-summary-left">
              <span class="faq-tag tag-indigo">Sync &amp; Automation</span>
              <span class="faq-question">How do I keep the disposable email domains blocklist updated automatically?</span>
            </div>
            <span class="faq-icon-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <div class="faq-content">
            <p>Run the Artisan command <code>php artisan erag:sync-disposable-email-list</code> to pull the latest verified threat list from upstream sources. To automate this in production, schedule the command weekly in your Laravel scheduler (<code>routes/console.php</code> or <code>Kernel.php</code>) using <code>Schedule::command('erag:sync-disposable-email-list')->weekly()</code>. Updates are written atomically to ensure zero downtime.</p>
          </div>
        </details>

        <!-- FAQ 7: Whitelisting & Custom Blacklist -->
        <details class="faq-item">
          <summary>
            <div class="faq-summary-left">
              <span class="faq-tag tag-teal">Configuration</span>
              <span class="faq-question">Can I whitelist custom test domains or configure a private blacklist file?</span>
            </div>
            <span class="faq-icon-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <div class="faq-content">
            <p>Yes. Publish the package configuration file to <code>config/disposable-email.php</code>. You can define a <code>whitelist</code> array containing company domains or internal QA testing addresses that must always pass. You can also define a <code>blacklist_file</code> path to append your own internal company blocklist to the global database. Whitelisted domains bypass checks instantly with zero false positives.</p>
          </div>
        </details>

        <!-- FAQ 8: Redis Caching -->
        <details class="faq-item">
          <summary>
            <div class="faq-summary-left">
              <span class="faq-tag tag-primary">Performance &amp; Scale</span>
              <span class="faq-question">How do I cache disposable email domain checks in Redis for maximum throughput?</span>
            </div>
            <span class="faq-icon-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <div class="faq-content">
            <p>Enable caching in <code>config/disposable-email.php</code> by setting <code>cache.enabled</code> to <code>true</code> and choosing your desired store (such as Redis or Memcached). In-memory caching eliminates disk file reads and accelerates lookup performance down to approximately <strong>0.15ms</strong>, allowing high-traffic apps to handle tens of thousands of concurrent signups seamlessly.</p>
          </div>
        </details>

        <!-- FAQ 9: Compatibility -->
        <details class="faq-item">
          <summary>
            <div class="faq-summary-left">
              <span class="faq-tag tag-cyan">Compatibility</span>
              <span class="faq-question">Which PHP and Laravel versions are supported?</span>
            </div>
            <span class="faq-icon-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <div class="faq-content">
            <p>The package supports <strong>PHP 8.1, 8.2, 8.3, and 8.4+</strong> alongside <strong>Laravel 10.x, 11.x, and upcoming 12.x</strong>. It strictly adheres to PSR-12 coding standards, supports strict types, and has zero conflicting third-party dependencies, guaranteeing seamless compatibility with your existing Laravel application stack.</p>
          </div>
        </details>

        <!-- FAQ 10: Free Trial Abuse Prevention -->
        <details class="faq-item">
          <summary>
            <div class="faq-summary-left">
              <span class="faq-tag tag-rose">Abuse Prevention</span>
              <span class="faq-question">How does this package stop free trial abuse and fake bot signups in SaaS apps?</span>
            </div>
            <span class="faq-icon-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <div class="faq-content">
            <p>Automated bots and serial trial abusers rely on temporary inboxes (like Mailinator or Guerrilla Mail) to spin up endless accounts and claim starter credits or one-time coupons. Enforcing disposable email checks at registration blocks over 95% of automated abuse at the door, protects your SMTP sender reputation against high bounce rates, and prevents ghost accounts from bloating your database.</p>
          </div>
        </details>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   HERO SECTION STYLES
   ========================================================================== */

.hero-wrapper {
  position: relative;
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 0 52px 0;
  overflow: hidden;
}

/* Ambient Glows */
.hero-glow-1 {
  position: absolute;
  top: -60px;
  left: 5%;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245, 48, 3, 0.14) 0%, rgba(245, 48, 3, 0) 70%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.hero-glow-2 {
  position: absolute;
  top: 60px;
  right: -60px;
  width: 460px;
  height: 460px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 113, 133, 0.12) 0%, rgba(245, 48, 3, 0) 70%);
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
}

/* Hero Grid Layout */
.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 40px;
  align-items: center;
}

/* Badge Row */
.hero-badge-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 22px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(245, 48, 3, 0.08);
  border: 1px solid rgba(245, 48, 3, 0.28);
  color: var(--vp-c-brand-1, #f53003);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-badge:hover {
  transform: translateY(-1px);
  border-color: rgba(245, 48, 3, 0.45);
  box-shadow: 0 4px 12px rgba(245, 48, 3, 0.14);
}

.pulse-indicator {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8px;
  height: 8px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.7);
}

.pulse-ring {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #10b981;
  opacity: 0.75;
  animation: hero-pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

@keyframes hero-pulse-ring {
  0% { transform: scale(0.6); opacity: 0.9; }
  100% { transform: scale(1.8); opacity: 0; }
}

/* Redesigned Premium Laravel Version Badge */
.hero-version-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 11px 4px 6px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
  cursor: default;
}

.hero-version-tag:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 45, 32, 0.45);
  box-shadow: 0 4px 14px rgba(255, 45, 32, 0.16);
}

.laravel-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 45, 32, 0.1);
  border: 1px solid rgba(255, 45, 32, 0.24);
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.hero-version-tag:hover .laravel-icon-wrap {
  transform: rotate(-8deg) scale(1.08);
}

.laravel-icon {
  width: 13px;
  height: 13px;
  display: block;
}

.version-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}

.version-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(255, 45, 32, 0.12);
  border: 1px solid rgba(255, 45, 32, 0.24);
  color: #f53003;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}

/* Headline & Typography */
.hero-headline {
  margin: 0 0 16px 0;
  font-size: clamp(2.2rem, 4.2vw, 3.4rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.035em;
  color: var(--vp-c-text-1);
}

.hero-tagline {
  margin: 0 0 16px 0;
  font-size: clamp(1.15rem, 2.2vw, 1.45rem);
  font-weight: 700;
  line-height: 1.35;
  color: var(--vp-c-brand-1, #f53003);
}

.section-main-title {
  margin: 40px 0 24px 0;
  font-size: clamp(1.85rem, 3.2vw, 2.45rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.035em;
  color: var(--vp-c-text-1);
  text-align: center;
}

.feature-card-title {
  display: block;
  margin: 8px 0 6px 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.015em;
}

.home-release-copy h2,
.home-cta-panel h2 {
  margin: 14px 0 10px 0;
  color: var(--vp-c-text-1);
  font-size: clamp(1.8rem, 3vw, 2.45rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.035em;
}

.hero-headline-gradient {
  background: linear-gradient(135deg, #f53003 0%, #fb7185 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline;
}

.hero-subtext {
  margin: 0 0 24px 0;
  font-size: 1.05rem;
  line-height: 1.68;
  color: var(--vp-c-text-2);
  max-width: 580px;
}

/* 1-Click Install Command */
.hero-install-shell {
  margin-bottom: 24px;
  width: 100%;
  max-width: 530px;
}

.hero-install-command {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #0f172a;
  border: 1px solid rgba(245, 48, 3, 0.28);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  max-width: 100%;
  box-sizing: border-box;
}

.hero-install-command:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 6px 20px rgba(245, 48, 3, 0.18);
  transform: translateY(-1px);
}

.install-prompt {
  color: #f53003;
  font-family: var(--vp-font-family-mono);
  font-size: 0.92rem;
  font-weight: 700;
  user-select: none;
  flex-shrink: 0;
}

.install-text {
  flex: 1;
  color: #f1f5f9;
  font-family: var(--vp-font-family-mono);
  font-size: clamp(0.74rem, 1.7vw, 0.84rem);
  font-weight: 500;
  white-space: nowrap;
  letter-spacing: -0.01em;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.install-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 6px;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.76rem;
  font-weight: 600;
  transition: all 0.2s;
  flex-shrink: 0;
}

.install-copy-btn:hover {
  background: rgba(245, 48, 3, 0.2);
  color: #ffffff;
  border-color: rgba(245, 48, 3, 0.4);
}

.install-copy-btn.is-copied {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}

.copy-feedback {
  font-size: 0.76rem;
  font-weight: 700;
}

/* Hero CTA Buttons */
.hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 28px;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  border-radius: 9px;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  user-select: none;
}

.hero-btn-primary {
  background: linear-gradient(135deg, #f53003 0%, #d92a02 100%);
  color: #ffffff !important;
  box-shadow: 0 4px 16px rgba(245, 48, 3, 0.35);
  border: 1px solid transparent;
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245, 48, 3, 0.48);
  filter: brightness(1.05);
}

.hero-btn-primary svg {
  transition: transform 0.2s;
}

.hero-btn-primary:hover svg {
  transform: translateX(3px);
}

.hero-btn-secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
}

.hero-btn-secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.hero-btn-github {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2) !important;
  border: 1px solid var(--vp-c-divider);
}

.hero-btn-github:hover {
  color: var(--vp-c-text-1) !important;
  border-color: var(--vp-c-text-2);
  transform: translateY(-2px);
}

/* Hero Stats Matrix - Full Row */
.hero-stats-matrix {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  width: 100%;
  margin-top: 28px;
}

.stat-box {
  padding: 12px 10px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.stat-box:hover {
  transform: translateY(-2px);
  border-color: rgba(245, 48, 3, 0.35);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}

.stat-box-link {
  text-decoration: none !important;
  cursor: pointer;
}

.stat-box-link:hover .stat-number {
  color: var(--vp-c-brand-1);
}

.stat-number {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.02rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
  line-height: 1.25;
  white-space: nowrap;
}

.stat-pulse-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
  margin-right: 5px;
  flex-shrink: 0;
}

.stat-link-arrow {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-left: 3px;
  transition: transform 0.15s ease;
}

.stat-box-link:hover .stat-link-arrow {
  transform: translate(2px, -2px);
  opacity: 1;
}

.stat-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-top: 3px;
  line-height: 1.3;
}

/* ==========================================================================
   CODE WORKBENCH (HERO RIGHT) - COLLISION-FREE STYLES
   ========================================================================== */

.hero-workbench {
  position: relative;
}

/* Reset any VitePress global code styling */
.hero-workbench :deep(pre),
.hero-workbench :deep(code),
.hero-workbench :deep(span) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0 !important;
}

.hwb-window {
  border-radius: 14px;
  background: #0d1117;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.55), 0 0 30px -5px rgba(245, 48, 3, 0.08);
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.hwb-window:hover {
  box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.65), 0 0 40px -5px rgba(245, 48, 3, 0.14);
}

/* Window Titlebar */
.hwb-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 16px;
  background: #010409;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hwb-lights {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hwb-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.hwb-dot-red { background: #ff5f56; }
.hwb-dot-amber { background: #ffbd2e; }
.hwb-dot-green { background: #27c93f; }

.hwb-file-info {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #8b949e;
  font-family: var(--vp-font-family-mono);
  font-size: 0.81rem;
  font-weight: 600;
}

.hwb-file-icon {
  color: #6e7681;
}

.hwb-filename {
  color: #e6edf3;
}

.hwb-copy-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #c9d1d9;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.hwb-copy-action:hover {
  background: rgba(245, 48, 3, 0.18);
  color: #fff;
  border-color: rgba(245, 48, 3, 0.35);
}

.hwb-copy-text {
  font-size: 0.74rem;
}

/* Tab Bar */
.hwb-tabbar {
  display: flex;
  background: #090d13;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0 6px;
  overflow-x: auto;
}

.hwb-tab {
  padding: 8px 14px;
  border: none;
  background: transparent;
  color: #8b949e;
  font-size: 0.81rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: all 0.2s;
  outline: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.hwb-tab:hover {
  color: #e6edf3;
  background: rgba(255, 255, 255, 0.02);
}

.hwb-tab:focus,
.hwb-tab:focus-visible {
  outline: none;
  box-shadow: none;
}

.hwb-tab.is-selected {
  color: #ffffff;
  border-bottom-color: #f53003;
  background: rgba(245, 48, 3, 0.08);
  font-weight: 700;
}

/* Syntax Canvas & Lines */
.hwb-editor {
  padding: 12px 0;
  font-family: 'JetBrains Mono', 'Fira Code', var(--vp-font-family-mono), monospace !important;
  font-size: 0.86rem;
  line-height: 1.6;
  color: #e6edf3;
  background: #0d1117;
  overflow-x: auto;
  min-height: 170px;
}

.hwb-code-scroll {
  display: block;
}

:deep(.hwb-line) {
  display: block;
  white-space: pre;
  padding: 2px 18px;
  min-height: 22px;
  line-height: 1.6;
  transition: background 0.12s;
}

:deep(.hwb-line:hover) {
  background: rgba(255, 255, 255, 0.03);
}

:deep(.hwb-line.is-glow) {
  background: rgba(245, 48, 3, 0.08);
  border-left: 3px solid #f53003;
  padding-left: 15px;
}

:deep(.hwb-ln) {
  display: inline-block;
  width: 20px;
  text-align: right;
  margin-right: 14px;
  color: #6e7681;
  user-select: none;
  font-size: 0.76rem;
  font-weight: 600;
}

/* Syntax Token Highlighting - GitHub Dark Modern Palette */
:deep(.tok-kw) {
  color: #ff7b72;
  font-weight: 600;
}

:deep(.tok-fn) {
  color: #d2a8ff;
}

:deep(.tok-cls) {
  color: #79c0ff;
}

:deep(.tok-str) {
  color: #a5d6ff;
}

:deep(.tok-rule) {
  color: #ff9a7a;
  font-weight: 700;
  background: rgba(245, 48, 3, 0.16) !important;
  padding: 1px 6px !important;
  border-radius: 4px !important;
  border: 1px solid rgba(245, 48, 3, 0.38) !important;
}

:deep(.tok-op) {
  color: #79c0ff;
}

:deep(.tok-var) {
  color: #ffa657;
}

:deep(.tok-cmt) {
  color: #8b949e;
  font-style: italic;
}

:deep(.tok-blade) {
  color: #ff7b72;
  font-weight: 700;
}

:deep(.tok-tag) {
  color: #7ee787;
}

:deep(.tok-attr) {
  color: #79c0ff;
}

:deep(.tok-prop) {
  color: #d2a8ff;
}

:deep(.tok-punc) {
  color: #8b949e;
}

/* Execution Feedback Dock */
.hwb-dock {
  background: #04070d;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 16px;
}

.hwb-dock-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.hwb-dock-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #7d8590;
  text-transform: uppercase;
}

.hwb-dock-radar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 6px;
  height: 6px;
}

.hwb-radar-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3fb950;
}

.hwb-radar-pulse {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid #3fb950;
  opacity: 0.7;
  animation: hero-pulse-ring 2s infinite;
}

.hwb-dock-perf {
  font-family: var(--vp-font-family-mono);
  font-size: 0.76rem;
  font-weight: 700;
  color: #3fb950;
}

.hwb-dock-output {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.hwb-dock-input {
  display: flex;
  align-items: center;
  gap: 7px;
}

.hwb-dock-tag {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.07);
  color: #8b949e;
}

.hwb-dock-val {
  font-family: var(--vp-font-family-mono);
  font-size: 0.81rem;
  color: #e6edf3;
}

.hwb-dock-response {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.8rem;
  flex-wrap: wrap;
}

.hwb-resp-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.74rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 5px;
}

.resp-blocked .hwb-resp-pill {
  background: rgba(248, 81, 73, 0.16);
  color: #ff7b72;
  border: 1px solid rgba(248, 81, 73, 0.32);
}

.resp-warning .hwb-resp-pill {
  background: rgba(210, 153, 34, 0.16);
  color: #e3b341;
  border: 1px solid rgba(210, 153, 34, 0.32);
}

.resp-success .hwb-resp-pill {
  background: rgba(63, 185, 80, 0.16);
  color: #56d364;
  border: 1px solid rgba(63, 185, 80, 0.32);
}

.hwb-resp-note {
  color: #8b949e;
  font-size: 0.78rem;
}

/* Domain Ticker Marquee */
.hero-ticker-band {
  margin-top: 16px;
  display: flex;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 10px 16px;
  overflow: hidden;
  gap: 16px;
}

.ticker-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(245, 48, 3, 0.12);
  color: var(--vp-c-brand-1);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.ticker-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f53003;
}

.ticker-track-wrap {
  flex: 1;
  overflow: hidden;
  position: relative;
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

.ticker-track {
  display: flex;
  gap: 24px;
  width: max-content;
  animation: hero-marquee-scroll 32s linear infinite;
}

.ticker-track:hover {
  animation-play-state: paused;
}

@keyframes hero-marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.domain-name {
  color: var(--vp-c-text-1);
}

.domain-block-tag {
  font-size: 0.64rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(239, 68, 68, 0.14);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

/* Mobile & Responsive Rules */
@media (max-width: 980px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .hero-stats-matrix {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-wrapper {
    padding: 16px 4px 32px 4px;
  }
  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .hero-btn {
    justify-content: center;
  }
  .hero-stats-matrix {
    grid-template-columns: 1fr 1fr;
  }
}

/* ==========================================================================
   PRACTICAL USAGE SECTION STYLES
   ========================================================================== */

.practical-section-wrapper {
  max-width: 1320px;
  margin: 56px auto 36px auto;
  position: relative;
}

.practical-header {
  text-align: center;
  max-width: 860px;
  margin: 0 auto 36px auto;
  padding: 0 16px;
}

.practical-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 999px;
  background: rgba(245, 48, 3, 0.08);
  border: 1px solid rgba(245, 48, 3, 0.22);
  color: var(--vp-c-brand-1);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.badge-pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f53003;
  box-shadow: 0 0 10px rgba(245, 48, 3, 0.9);
  animation: badge-pulse 2s infinite ease-in-out;
}

@keyframes badge-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.6;
  }
}

.practical-title {
  font-size: clamp(1.85rem, 3.2vw, 2.45rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.035em;
  color: var(--vp-c-text-1);
  margin: 0 0 14px 0;
}

.practical-highlight {
  background: linear-gradient(135deg, #f53003 0%, #ff6b4a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.practical-subtitle {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  max-width: 740px;
  margin: 0 auto;
}

/* 2-Column Grid Layout */
.practical-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  align-items: stretch;
}

.practical-card {
  position: relative;
  border-radius: 20px;
  padding: 30px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.practical-card:hover {
  border-color: rgba(245, 48, 3, 0.38);
  transform: translateY(-3px);
  box-shadow: 0 16px 36px -10px rgba(245, 48, 3, 0.08);
}

.dark .practical-card {
  background: linear-gradient(180deg, rgba(26, 32, 44, 0.6) 0%, rgba(17, 24, 39, 0.75) 100%);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.4);
}

.dark .practical-card:hover {
  border-color: rgba(245, 48, 3, 0.45);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 24px -4px rgba(245, 48, 3, 0.15);
}

.card-glow-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0.85;
}

.capabilities-card .card-glow-top {
  background: linear-gradient(90deg, transparent, #f53003, transparent);
}

.usecase-card .card-glow-top {
  background: linear-gradient(90deg, transparent, #06b6d4, transparent);
}

/* Card Header */
.card-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.card-head-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-capabilities {
  background: rgba(245, 48, 3, 0.1);
  color: #f53003;
  border: 1px solid rgba(245, 48, 3, 0.2);
}

.icon-usecase {
  background: rgba(6, 182, 212, 0.1);
  color: #0891b2;
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.card-head-info {
  display: flex;
  flex-direction: column;
}

.card-kicker {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  margin-bottom: 3px;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0;
  letter-spacing: -0.02em;
}

.card-pill-count {
  margin-left: auto;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

/* Feature & Usecase Rows */
.feature-rows,
.usecase-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.feature-row,
.usecase-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 13px 15px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  border: 1px solid transparent;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.feature-row:hover,
.usecase-row:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-divider);
  transform: translateX(3px);
}

.dark .feature-row,
.dark .usecase-row {
  background: rgba(17, 24, 39, 0.5);
  border-color: rgba(255, 255, 255, 0.03);
}

.dark .feature-row:hover,
.dark .usecase-row:hover {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.feature-icon-badge {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(245, 48, 3, 0.08);
  color: #f53003;
  margin-top: 2px;
}

.usecase-number-badge {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.84rem;
  font-weight: 800;
  background: rgba(6, 182, 212, 0.08);
  color: #0891b2;
  border: 1px solid rgba(6, 182, 212, 0.25);
  margin-top: 2px;
}

.dark .usecase-number-badge {
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.3);
}

.feature-body,
.usecase-body {
  flex: 1;
  min-width: 0;
}

.feature-body-header,
.usecase-body-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 3px;
  flex-wrap: wrap;
}

.feature-body-header strong,
.usecase-body-header strong {
  font-size: 0.94rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}

.feature-body p,
.usecase-body p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.feature-body code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(245, 48, 3, 0.08);
  color: var(--vp-c-brand-1);
}

.feature-tag {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 5px;
  background: rgba(245, 48, 3, 0.08);
  color: #f53003;
  border: 1px solid rgba(245, 48, 3, 0.18);
  white-space: nowrap;
}

/* Use Case Chips */
.usecase-chip {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 5px;
  white-space: nowrap;
}

.chip-cyan {
  background: rgba(6, 182, 212, 0.1);
  color: #0891b2;
  border: 1px solid rgba(6, 182, 212, 0.25);
}
.dark .chip-cyan {
  color: #38bdf8;
}

.chip-amber {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.25);
}
.dark .chip-amber {
  color: #fbbf24;
}

.chip-emerald {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.25);
}
.dark .chip-emerald {
  color: #34d399;
}

.chip-indigo {
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  border: 1px solid rgba(99, 102, 241, 0.25);
}
.dark .chip-indigo {
  color: #818cf8;
}

.chip-purple {
  background: rgba(168, 85, 247, 0.1);
  color: #9333ea;
  border: 1px solid rgba(168, 85, 247, 0.25);
}
.dark .chip-purple {
  color: #c084fc;
}

/* Responsive Rules */
@media (max-width: 980px) {
  .practical-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .practical-section-wrapper {
    margin: 40px auto 28px auto;
  }
}

@media (max-width: 640px) {
  .practical-card {
    padding: 22px 16px;
    border-radius: 16px;
  }
  .practical-title {
    font-size: 1.6rem;
  }
  .practical-header {
    margin-bottom: 24px;
  }
  .feature-row,
  .usecase-row {
    padding: 11px 12px;
    gap: 12px;
  }
  .feature-icon-badge,
  .usecase-number-badge {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    font-size: 0.78rem;
  }
  .feature-icon-badge svg {
    width: 15px;
    height: 15px;
  }
  .card-head-icon {
    width: 38px;
    height: 38px;
  }
  .card-head-icon svg {
    width: 18px;
    height: 18px;
  }
}

/* ==========================================================================
   FAQ SECTION STYLES (SEO & UX UPGRADE)
   ========================================================================== */

.home-faq-section {
  max-width: 1100px;
  margin: 70px auto 20px auto;
  padding: 0 16px;
  text-align: left;
}

.faq-header {
  text-align: center;
  max-width: 820px;
  margin: 0 auto 44px auto;
}

.faq-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 999px;
  background: rgba(245, 48, 3, 0.08);
  border: 1px solid rgba(245, 48, 3, 0.22);
  color: var(--vp-c-brand-1);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.faq-header h2 {
  font-size: clamp(2rem, 3.4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  color: var(--vp-c-text-1);
  margin: 0 0 14px 0;
  line-height: 1.15;
}

.faq-highlight {
  background: linear-gradient(135deg, #f53003 0%, #ff6b4a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.faq-subtitle {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  margin: 0;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.faq-item {
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.faq-item:hover {
  border-color: rgba(245, 48, 3, 0.38);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03);
  transform: translateY(-1px);
}

.faq-item[open] {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: 0 8px 24px -6px rgba(245, 48, 3, 0.12);
}

.dark .faq-item {
  background: linear-gradient(180deg, rgba(26, 32, 44, 0.5) 0%, rgba(17, 24, 39, 0.65) 100%);
  border-color: rgba(255, 255, 255, 0.08);
}

.dark .faq-item:hover {
  border-color: rgba(245, 48, 3, 0.45);
}

.dark .faq-item[open] {
  border-color: rgba(245, 48, 3, 0.55);
  background: rgba(17, 24, 39, 0.9);
}

.faq-item summary {
  padding: 18px 22px;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  user-select: none;
  outline: none;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary::marker {
  display: none;
}

.faq-summary-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  flex: 1;
}

.faq-question {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
  line-height: 1.45;
}

.faq-icon-arrow {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
  flex-shrink: 0;
}

.faq-item:hover .faq-icon-arrow {
  color: var(--vp-c-brand-1);
}

.faq-item[open] .faq-icon-arrow {
  transform: rotate(180deg);
  background: rgba(245, 48, 3, 0.1);
  color: var(--vp-c-brand-1);
}

.faq-tag {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.tag-primary {
  background: rgba(245, 48, 3, 0.08);
  color: #f53003;
  border: 1px solid rgba(245, 48, 3, 0.22);
}
.tag-success {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.22);
}
.dark .tag-success {
  color: #34d399;
}
.tag-cyan {
  background: rgba(6, 182, 212, 0.1);
  color: #0891b2;
  border: 1px solid rgba(6, 182, 212, 0.22);
}
.dark .tag-cyan {
  color: #38bdf8;
}
.tag-amber {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.22);
}
.dark .tag-amber {
  color: #fbbf24;
}
.tag-purple {
  background: rgba(168, 85, 247, 0.1);
  color: #9333ea;
  border: 1px solid rgba(168, 85, 247, 0.22);
}
.dark .tag-purple {
  color: #c084fc;
}
.tag-indigo {
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  border: 1px solid rgba(99, 102, 241, 0.22);
}
.dark .tag-indigo {
  color: #818cf8;
}
.tag-teal {
  background: rgba(20, 184, 166, 0.1);
  color: #0d9488;
  border: 1px solid rgba(20, 184, 166, 0.22);
}
.dark .tag-teal {
  color: #2dd4bf;
}
.tag-rose {
  background: rgba(244, 63, 94, 0.1);
  color: #e11d48;
  border: 1px solid rgba(244, 63, 94, 0.22);
}
.dark .tag-rose {
  color: #fb7185;
}

.faq-content {
  padding: 0 22px 22px 22px;
  border-top: 1px solid var(--vp-c-divider);
}

.faq-content p {
  font-size: 0.95rem;
  line-height: 1.68;
  color: var(--vp-c-text-2);
  margin: 16px 0 0 0 !important;
}

.faq-content code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(245, 48, 3, 0.08);
  color: var(--vp-c-brand-1);
}

.faq-content ul {
  margin: 12px 0 0 0;
  padding-left: 1.4rem;
  color: var(--vp-c-text-2);
}

.faq-content ul li {
  margin-top: 6px;
  font-size: 0.93rem;
  line-height: 1.6;
}

.faq-code {
  margin: 12px 0 0 0;
  padding: 14px 18px;
  border-radius: 10px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 0.84rem;
  line-height: 1.65;
  color: var(--vp-c-text-1);
}

.dark .faq-code {
  background: rgba(13, 17, 23, 0.85);
  border-color: rgba(255, 255, 255, 0.08);
}

.dark .hero-version-tag {
  background: rgba(15, 23, 42, 0.75);
  border-color: rgba(255, 45, 32, 0.28);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.dark .hero-version-tag:hover {
  border-color: rgba(255, 45, 32, 0.55);
  box-shadow: 0 4px 16px rgba(255, 45, 32, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.dark .laravel-icon-wrap {
  background: rgba(255, 45, 32, 0.15);
  border-color: rgba(255, 45, 32, 0.35);
  box-shadow: 0 0 10px rgba(255, 45, 32, 0.2);
}

.dark .version-pill {
  background: rgba(255, 45, 32, 0.18);
  border-color: rgba(255, 45, 32, 0.35);
  color: #ff5748;
}

.dark .hero-badge {
  background: rgba(15, 23, 42, 0.75);
  border-color: rgba(245, 48, 3, 0.32);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

@media (max-width: 768px) {
  .home-faq-section {
    margin: 48px auto 0 auto;
    padding: 24px 12px;
  }
  .faq-header h2 {
    font-size: 1.65rem;
  }
  .faq-item summary {
    padding: 15px 16px;
  }
  .faq-content {
    padding: 0 16px 18px 16px;
  }
  .faq-question {
    font-size: 0.96rem;
  }
}
</style>
