<script lang="ts">
    import type { FieldComponentProps } from '@erag/inertia-forms-svelte';

    /**
     * Star rating for the custom `Rating` field (app/Forms/Fields/Rating.php).
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

    const starPath =
        'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5z';
    const stars = $derived(Number(field.stars ?? 5));
    const current = $derived(Number(value) || 0);
    const locked = $derived(disabled || Boolean(field.readonly));
    let hover = $state(0);
    let buttons: HTMLButtonElement[] = $state([]);
    const shown = $derived(hover || current);

    function pick(star: number) {
        value = star;
        onChange?.(star);
        buttons[star - 1]?.focus();
    }

    function keydown(event: KeyboardEvent) {
        const moves: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };

        if (event.key in moves) {
            event.preventDefault();
            pick(Math.min(stars, Math.max(1, current + moves[event.key]!)));
        } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            pick(event.key === 'Home' ? 1 : stars);
        }
    }
</script>

<div class="flex items-center gap-3">
    <div
        {id}
        role="radiogroup"
        tabindex="-1"
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        aria-required={field.required || undefined}
        class="flex gap-0.5 rounded-lg aria-invalid:ring-2 aria-invalid:ring-red-500/30"
        onpointerleave={() => (hover = 0)}
    >
        {#each Array.from({ length: stars }, (_, index) => index + 1) as star (star)}
            <button
                bind:this={buttons[star - 1]}
                type="button"
                role="radio"
                aria-checked={current === star}
                aria-label={`${star} of ${stars} stars`}
                tabindex={star === (current || 1) ? 0 : -1}
                disabled={locked}
                class="rounded-md p-0.5 transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                onpointerenter={() => !locked && (hover = star)}
                onclick={() => pick(star)}
                onkeydown={keydown}
            >
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                    class={shown >= star
                        ? 'size-7 fill-amber-400 stroke-amber-500'
                        : 'size-7 fill-transparent stroke-zinc-300 dark:stroke-zinc-600'}
                >
                    <path d={starPath} />
                </svg>
            </button>
        {/each}
    </div>
    <span class="text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
        {shown ? `${shown} / ${stars}` : 'Not rated yet'}
    </span>
</div>
