import type { FieldComponentProps } from '@erag/inertia-forms-react';

const buttonClass =
    'flex w-10 items-center justify-center text-lg font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 focus-visible:bg-zinc-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800';

/**
 * Minus / plus counter for the custom `QuantityStepper` field
 * (app/Forms/Fields/QuantityStepper.php).
 */
export function QuantityStepper({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps) {
    const min = Number(field.min ?? 0);
    const max = Number(field.max ?? 99);
    const step = Number(field.step ?? 1);
    const unit = typeof field.unit === 'string' ? field.unit : null;
    const locked = disabled || Boolean(field.readonly);
    const number = value === '' || value === null ? null : Number(value);
    const clamp = (next: number) => Math.min(max, Math.max(min, next));

    return (
        <div className="flex items-center gap-3">
            <div
                aria-invalid={error ? true : undefined}
                className="inline-flex h-10 items-stretch overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-xs focus-within:border-[var(--erag-form-accent,#4f46e5)] focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_22%,transparent)] aria-invalid:border-red-500 dark:border-zinc-700 dark:bg-zinc-900"
            >
                <button
                    type="button"
                    aria-label={`Decrease ${field.label}`}
                    disabled={locked || (number ?? min) <= min}
                    className={buttonClass}
                    onClick={() => onChange(clamp((number ?? min) - step))}
                >
                    −
                </button>
                <input
                    id={id}
                    type="number"
                    inputMode="numeric"
                    min={min}
                    max={max}
                    step={step}
                    value={number ?? ''}
                    disabled={locked}
                    aria-describedby={describedBy}
                    aria-invalid={error ? true : undefined}
                    className="w-14 [appearance:textfield] border-x border-zinc-200 bg-transparent text-center text-sm font-semibold text-zinc-900 tabular-nums focus:outline-none dark:border-zinc-700 dark:text-zinc-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    onChange={(event) =>
                        onChange(
                            event.target.value === ''
                                ? null
                                : Number(event.target.value),
                        )
                    }
                    onBlur={() => number !== null && onChange(clamp(number))}
                />
                <button
                    type="button"
                    aria-label={`Increase ${field.label}`}
                    disabled={locked || (number ?? min) >= max}
                    className={buttonClass}
                    onClick={() => onChange(clamp((number ?? min) + step))}
                >
                    +
                </button>
            </div>
            {unit && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {unit}
                </span>
            )}
        </div>
    );
}
