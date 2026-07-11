# API Reference

Detailed type contracts and function signatures for `@erag/vue-toastification`.

## useToast()

A composable hook returning triggers for non-blocking notifications.

### Function Signatures

- **`success(message, title?, duration?, position?)`**
- **`error(message, title?, duration?, position?)`**
- **`warning(message, title?, duration?, position?)`**
- **`info(message, title?, duration?, position?)`**
- **`setPosition(position)`**
- **`remove(id)`**

### Argument Types

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `message` | `string` | *Required* | Main body text. |
| `title` | `string` | *Optional* | Bold header text. |
| `duration` | `number` | `4500` | Expiration time in milliseconds. Pass `0` to disable automatic removal. |
| `position` | `ToastPosition` | *Global Value* | Screen placement for this individual toast. |

---

## useModal() / useConfirmation()

A composable hook returning controls for interactive confirm overlay dialogs.

### `confirm(options)`

Returns a `Promise<boolean>` which resolves when the user interacts with the buttons.

```typescript
const modal = useModal()
const confirmed: boolean = await modal.confirm(options)
```

### `ModalOptions` Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | *Required* | Bold heading. |
| `message` | `string` | *Required* | Main details copy. |
| `confirmText` | `string` | `'Confirm'` | Action button label. |
| `cancelText` | `string` | `'Cancel'` | Cancel button label. |
| `type` | `'info' \| 'warning' \| 'danger'` | `'info'` | Button variant coloring logic. |