import { visibleFields } from '@erag/inertia-forms-core';
import type { FieldSchema, FormSchema } from '@erag/inertia-forms-vue';

/**
 * Browser-only stand-in for Laravel validation in the docs, which have no
 * server: it reports empty required fields the way Laravel would.
 */
function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined || value === '') {
        return true;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (typeof value === 'object' && !(value instanceof File) && 'start' in value && 'end' in value) {
        return !value.start || !value.end;
    }
    if (typeof value === 'object' && !(value instanceof File) && 'message' in value) {
        return !(value as { message?: string; attachments?: unknown[] }).message?.trim() && !(value as { attachments?: unknown[] }).attachments?.length;
    }
    return false;
}

function valueAt(data: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce<unknown>((current, key) => (current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined), data);
}

export function requiredErrors(schema: FormSchema, data: Record<string, unknown>): Record<string, string> {
    return Object.fromEntries(
        visibleFields(schema, data)
            .filter((field: FieldSchema) => field.required && isEmpty(valueAt(data, field.name)))
            .map((field: FieldSchema) => [field.name, `The ${field.label.toLowerCase()} field is required.`]),
    );
}

/**
 * JSON.stringify replacer that shows files by name and size.
 */
export function describeValue(_key: string, value: unknown): unknown {
    return value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value;
}
