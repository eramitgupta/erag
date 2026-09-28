<script lang="ts">
    import type { FieldComponentProps } from '@erag/inertia-forms-svelte';

    /**
     * One box per digit for the custom `CodeInput` field (app/Forms/Fields/CodeInput.php).
     */
    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps = $props();

    const length = $derived(Number(field.length ?? 6));
    const code = $derived(typeof value === 'string' ? value.replace(/\D/g, '') : '');
    const locked = $derived(disabled || Boolean(field.readonly));
    let boxes: HTMLInputElement[] = $state([]);

    function update(next: string) {
        value = next;
        onChange?.(next);
    }

    function focusBox(index: number) {
        const box = boxes[Math.min(Math.max(index, 0), length - 1)];
        box?.focus();
        box?.select();
    }

    function type(index: number, event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        const digit = input.value.replace(/\D/g, '').slice(-1);
        input.value = code[index] ?? '';

        if (!digit) {
            return;
        }

        const position = Math.min(index, code.length);
        update((code.slice(0, position) + digit + code.slice(position + 1)).slice(0, length));
        focusBox(position + 1);
    }

    function keydown(index: number, event: KeyboardEvent) {
        if (event.key === 'Backspace') {
            event.preventDefault();
            const position = code[index] ? index : index - 1;

            if (position >= 0) {
                update(code.slice(0, position) + code.slice(position + 1));
                focusBox(position);
            }
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            focusBox(index - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            focusBox(Math.min(index + 1, code.length));
        }
    }

    function paste(event: ClipboardEvent) {
        event.preventDefault();
        const pasted = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, length);

        if (pasted) {
            update(pasted);
            focusBox(pasted.length);
        }
    }
</script>

<div
    role="group"
    aria-describedby={describedBy}
    class="flex flex-wrap gap-2"
>
    {#each Array.from({ length }, (_, index) => index) as index (index)}
        <input
            bind:this={boxes[index]}
            id={index === 0 ? id : `${id}-${index}`}
            type="text"
            inputmode="numeric"
            autocomplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={error ? true : undefined}
            value={code[index] ?? ''}
            disabled={locked}
            class="size-11 rounded-lg border border-zinc-300 bg-white text-center text-lg font-semibold text-zinc-900 shadow-xs tabular-nums transition focus:border-[var(--erag-form-accent,#4f46e5)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_22%,transparent)] focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-50 aria-invalid:border-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            onfocus={() => index > code.length && focusBox(code.length)}
            oninput={(event) => type(index, event)}
            onkeydown={(event) => keydown(index, event)}
            onpaste={paste}
        />
    {/each}
</div>
