## 💬 Modal Usage

```ts
import { useModal } from '@erag/vue-toastification';

const modal = useModal();
const ok = await modal.confirm({
  title: 'Delete?',
  message: 'Are you sure?',
  type: 'danger'
});
```
