<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <section class="oh-section">
    <div class="oh-wrap oh-split oh-split-even oh-agents">
      <div>
        <p class="oh-eyebrow">Laravel Boost + AI agents</p>
        <h2 class="oh-h2 oh-h2-left">Your AI agent knows the safe path</h2>
        <p class="oh-lead">
          The package ships a Laravel Boost guideline and an <code>orphan-files-setup</code> skill. After
          <code>php artisan boost:install</code>, agents like Claude Code, Cursor or Copilot set it up the way the docs
          describe instead of guessing.
        </p>

        <div class="oh-agent-points">
          <div>
            <h3>A setup skill</h3>
            <p>Installing, writing the config, listing every column that stores files, the first scan, checking files with explain, and scheduling.</p>
          </div>
          <div>
            <h3>Guardrails in the guideline</h3>
            <p>Agents preview with a scan or a dry run, and ask you before using --force, delete mode or --force-ratio.</p>
          </div>
        </div>

        <p class="oh-more">
          <a :href="withBase('/installation.html#ai-agents-and-laravel-boost')">AI agents and Laravel Boost</a>
        </p>
      </div>

      <div class="oh-chat" aria-label="Example of an agent session">
        <div class="oh-chat-head">
          <span class="oh-chat-dot" aria-hidden="true" />
          Coding agent
          <span class="oh-tag">Example</span>
        </div>
        <div class="oh-chat-body">
          <p class="oh-msg oh-msg-user">Clean up the unused uploads in our MinIO bucket.</p>
          <div class="oh-msg oh-msg-agent">
            <p>I ran <code>php artisan orphan:scan</code>: 160 of 320 files are orphans, 593.1 MB in total.</p>
            <p>The dry run with <code>orphan:clean</code> lists them all. Nothing has changed yet.</p>
            <p><code>orphan:clean --force</code> moves them to <code>.orphan-trash/</code>, where you can restore them. Should I run it?</p>
          </div>
          <div class="oh-chat-actions" aria-hidden="true">
            <span class="oh-chip-btn oh-chip-primary">Yes, run it</span>
            <span class="oh-chip-btn">Show the list first</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
