<script setup lang="ts">
import { computed } from 'vue';

type CodeTokenKind =
    | 'comment'
    | 'keyword'
    | 'number'
    | 'plain'
    | 'string'
    | 'tag'
    | 'type';

interface CodeToken {
    kind: CodeTokenKind;
    text: string;
}

interface HomeEditorCodeProps {
    code: string;
}

const props = defineProps<HomeEditorCodeProps>();

const tokenPattern =
    /(\/\/.*$|\/\*.*?\*\/|<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>|`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\b(?:as|async|await|const|else|export|false|from|function|if|import|interface|let|new|null|return|true|type|undefined)\b|\b(?:AbortSignal|Array|Blob|EditorInit|EditorInstance|EditorTemplateItem|MentionItem|MergeTagItem|Readonly|Record|string|void)\b|\b\d+(?:\.\d+)?\b)/g;

const keywords = new Set([
    'as',
    'async',
    'await',
    'const',
    'else',
    'export',
    'false',
    'from',
    'function',
    'if',
    'import',
    'interface',
    'let',
    'new',
    'null',
    'return',
    'true',
    'type',
    'undefined',
]);

const typeNames = new Set([
    'AbortSignal',
    'Array',
    'Blob',
    'EditorInit',
    'EditorInstance',
    'EditorTemplateItem',
    'MentionItem',
    'MergeTagItem',
    'Readonly',
    'Record',
    'string',
    'void',
]);

function resolveTokenKind(value: string): CodeTokenKind {
    if (value.startsWith('//') || value.startsWith('/*') || value.startsWith('<!--')) {
        return 'comment';
    }

    if (value.startsWith('<')) {
        return 'tag';
    }

    if (value.startsWith("'") || value.startsWith('"') || value.startsWith('`')) {
        return 'string';
    }

    if (keywords.has(value)) {
        return 'keyword';
    }

    if (typeNames.has(value)) {
        return 'type';
    }

    if (/^\d/.test(value)) {
        return 'number';
    }

    return 'plain';
}

function tokenizeLine(line: string): CodeToken[] {
    const tokens: CodeToken[] = [];
    let cursor = 0;

    for (const match of line.matchAll(tokenPattern)) {
        const index = match.index;

        if (index > cursor) {
            tokens.push({ kind: 'plain', text: line.slice(cursor, index) });
        }

        tokens.push({ kind: resolveTokenKind(match[0]), text: match[0] });
        cursor = index + match[0].length;
    }

    if (cursor < line.length) {
        tokens.push({ kind: 'plain', text: line.slice(cursor) });
    }

    return tokens.length > 0 ? tokens : [{ kind: 'plain', text: ' ' }];
}

const highlightedLines = computed(() =>
    props.code.split('\n').map(tokenizeLine),
);
</script>

<template>
    <ol class="home-editor-code" aria-label="Complete Vue editor example">
        <li
            v-for="(line, lineIndex) in highlightedLines"
            :key="lineIndex"
            class="home-editor-code__line"
        >
            <code class="home-editor-code__line-content">
                <span
                    v-for="(token, tokenIndex) in line"
                    :key="tokenIndex"
                    class="home-editor-code__token"
                    :class="`home-editor-code__token--${token.kind}`"
                    >{{ token.text }}</span
                >
            </code>
        </li>
    </ol>
</template>

<style scoped>
.home-editor-code {
    min-width: max-content;
    margin: 0;
    padding: 1rem 0 1.25rem;
    color: #e5e7eb;
    background: transparent;
    counter-reset: code-line;
    font-family: var(--vp-font-family-mono);
    font-size: 0.82rem;
    line-height: 1.65;
    list-style: none;
    tab-size: 4;
}

.home-editor-code__line {
    display: grid;
    grid-template-columns: 3.5rem minmax(max-content, 1fr);
    min-height: 1.65em;
    padding-right: 1.25rem;
    counter-increment: code-line;
}

.home-editor-code__line:hover {
    background: rgba(255, 255, 255, 0.04);
}

.home-editor-code__line::before {
    padding-right: 1rem;
    color: #52525b;
    text-align: right;
    content: counter(code-line);
    user-select: none;
}

.home-editor-code__line-content,
.home-editor-code__token {
    font: inherit;
    white-space: pre;
}

.home-editor-code__token--plain {
    color: #d4d4d8;
}

.home-editor-code__token--comment {
    color: #6a9955;
    font-style: italic;
}

.home-editor-code__token--keyword {
    color: #c586c0;
}

.home-editor-code__token--type {
    color: #4ec9b0;
}

.home-editor-code__token--string {
    color: #ce9178;
}

.home-editor-code__token--number {
    color: #b5cea8;
}

.home-editor-code__token--tag {
    color: #569cd6;
}
</style>
