import type { FieldComponentProps } from '@erag/inertia-forms-react';
import { useRef } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';

/**
 * One box per digit for the custom `CodeInput` field (app/Forms/Fields/CodeInput.php).
 */
export function CodeInput({
  field,
  id,
  value,
  error,
  disabled,
  describedBy,
  onChange,
}: FieldComponentProps) {
  const length = Number(field.length ?? 6);
  const code = typeof value === 'string' ? value.replace(/\D/g, '') : '';
  // The code just typed, before the new value comes back as a prop.
  const latest = useRef(code);
  latest.current = code;
  const boxes = useRef<Array<HTMLInputElement | null>>([]);
  const locked = disabled || Boolean(field.readonly);

  function emit(next: string) {
    latest.current = next;
    onChange(next);
  }

  function focusBox(index: number) {
    const box = boxes.current[Math.min(Math.max(index, 0), length - 1)];
    box?.focus();
    box?.select();
  }

  function type(index: number, text: string) {
    const digit = text.replace(/\D/g, '').slice(-1);

    if (!digit) {
      return;
    }

    const position = Math.min(index, code.length);
    emit(
      (code.slice(0, position) + digit + code.slice(position + 1)).slice(
        0,
        length,
      ),
    );
    focusBox(position + 1);
  }

  function keydown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const position = code[index] ? index : index - 1;

      if (position >= 0) {
        emit(code.slice(0, position) + code.slice(position + 1));
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

  function paste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);

    if (pasted) {
      emit(pasted);
      focusBox(pasted.length);
    }
  }

  return (
    <div
      role="group"
      aria-describedby={describedBy}
      className="flex flex-wrap gap-2"
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            boxes.current[index] = element;
          }}
          id={index === 0 ? id : `${id}-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={error ? true : undefined}
          value={code[index] ?? ''}
          disabled={locked}
          className="size-11 rounded-lg border border-zinc-300 bg-white text-center text-lg font-semibold text-zinc-900 shadow-xs tabular-nums transition focus:border-[var(--erag-form-accent,#4f46e5)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--erag-form-accent,#4f46e5)_22%,transparent)] focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-50 aria-invalid:border-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          onFocus={() =>
            index > latest.current.length && focusBox(latest.current.length)
          }
          onChange={(event) => type(index, event.target.value)}
          onKeyDown={(event) => keydown(index, event)}
          onPaste={paste}
        />
      ))}
    </div>
  );
}
