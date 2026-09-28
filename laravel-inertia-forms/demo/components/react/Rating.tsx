import type { FieldComponentProps } from '@erag/inertia-forms-react';
import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

const starPath =
    'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5z';

/**
 * Star rating for the custom `Rating` field (app/Forms/Fields/Rating.php).
 */
export function Rating({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps) {
    const stars = Number(field.stars ?? 5);
    const current = Number(value) || 0;
    const [hover, setHover] = useState(0);
    const buttons = useRef<Array<HTMLButtonElement | null>>([]);
    const locked = disabled || Boolean(field.readonly);
    const shown = hover || current;

    function pick(star: number) {
        onChange(star);
        buttons.current[star - 1]?.focus();
    }

    function keydown(event: KeyboardEvent<HTMLButtonElement>) {
        const moves: Record<string, number> = {
            ArrowRight: 1,
            ArrowUp: 1,
            ArrowLeft: -1,
            ArrowDown: -1,
        };

        if (event.key in moves) {
            event.preventDefault();
            pick(
                Math.min(stars, Math.max(1, (current || 0) + moves[event.key])),
            );
        } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            pick(event.key === 'Home' ? 1 : stars);
        }
    }

    return (
        <div className="flex items-center gap-3">
            <div
                id={id}
                role="radiogroup"
                aria-describedby={describedBy}
                aria-invalid={error ? true : undefined}
                aria-required={field.required || undefined}
                className="flex gap-0.5 rounded-lg aria-invalid:ring-2 aria-invalid:ring-red-500/30"
                onPointerLeave={() => setHover(0)}
            >
                {Array.from({ length: stars }, (_, index) => index + 1).map(
                    (star) => (
                        <button
                            key={star}
                            ref={(element) => {
                                buttons.current[star - 1] = element;
                            }}
                            type="button"
                            role="radio"
                            aria-checked={current === star}
                            aria-label={`${star} of ${stars} stars`}
                            tabIndex={star === (current || 1) ? 0 : -1}
                            disabled={locked}
                            className="rounded-md p-0.5 transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-[var(--erag-form-accent,#4f46e5)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            onPointerEnter={() => !locked && setHover(star)}
                            onClick={() => pick(star)}
                            onKeyDown={keydown}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className={
                                    shown >= star
                                        ? 'size-7 fill-amber-400 stroke-amber-500'
                                        : 'size-7 fill-transparent stroke-zinc-300 dark:stroke-zinc-600'
                                }
                                strokeWidth={1.5}
                                strokeLinejoin="round"
                            >
                                <path d={starPath} />
                            </svg>
                        </button>
                    ),
                )}
            </div>
            <span className="text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
                {shown ? `${shown} / ${stars}` : 'Not rated yet'}
            </span>
        </div>
    );
}
