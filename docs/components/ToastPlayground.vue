<script setup lang="ts">
import { ref } from 'vue'
import {
  type ToastPosition,
  type ToastType,
  useModal,
  useToast
} from '@erag/vue-toastification'

const toast = useToast()
const modal = useModal()

const currentPosition = ref<ToastPosition>('bottom-right')
const duration = ref(4000)

/**
 * Update global position when dropdown changes
 */
const updatePosition = () => {
  toast.setPosition(currentPosition.value)
}

/**
 * Trigger toast based on selected position
 */
const trigger = (type: ToastType) => {
  const titles = {
    success: 'Good job!',
    error: 'Oops!',
    warning: 'Attention',
    info: 'Did you know?'
  }

  const messages = {
    success: 'Data has been saved successfully.',
    error: 'Something went wrong with the server.',
    warning: 'Your session is about to expire.',
    info: 'New updates are available for download.'
  }

  // ✅ position comes from dropdown
  toast[type](
      messages[type],
      titles[type],
      duration.value,
      currentPosition.value
  )
}

const triggerCustom = () => {
  toast.info(
      'This is a really long message to test wrapping inside the toast.',
      'Layout Test',
      6000,
      currentPosition.value
  )
}

const triggerRapid = () => {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      toast.success(
          `Rapid Toast #${i + 1}`,
          'Batch Test',
          3000,
          currentPosition.value
      )
    }, i * 200)
  }
}

const deleteAccount = async () => {
  const isConfirmed = await modal.confirm({
    title: 'Deactivate account',
    message:
        'Are you sure you want to deactivate your account? This action cannot be undone.',
    confirmText: 'Deactivate',
    cancelText: 'Cancel',
    type: 'danger'
  })

  if (isConfirmed) {
    toast.success(
        'Account deactivated successfully!',
        'Done',
        4000,
        currentPosition.value
    )
  }
}
</script>
<template>
  <div class="playground-container">
    <h1>🍞 Toast Playground</h1>
    <p>Test your @erag/vue-toastification library</p>

    <div class="controls">
      <div>
        <h1>Dialog Test</h1>
        <button class="btn error" @click="deleteAccount">
          Delete Account
        </button>
      </div>
      <br>
      <br>
      <div class="control-group">
        <label>Position:</label>
        <select v-model="currentPosition" @change="updatePosition">
          <option value="top-left">Top Left</option>
          <option value="top-center">Top Center</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-center">Bottom Center</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
      </div>

      <div class="control-group">
        <label>Duration (ms):</label>
        <input type="number" v-model="duration" step="500" />
      </div>

      <hr />

      <div class="buttons">
        <button class="btn success" @click="trigger('success')">Success Toast</button>
        <button class="btn error" @click="trigger('error')">Error Toast</button>
        <button class="btn warning" @click="trigger('warning')">Warning Toast</button>
        <button class="btn info" @click="trigger('info')">Info Toast</button>
      </div>

      <div class="buttons" style="margin-top: 10px;">
        <button class="btn" @click="triggerCustom">Long Message</button>
        <button class="btn" @click="triggerRapid">Trigger 5x Rapidly</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.playground-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

h1 { margin-bottom: 0.5rem; }
p { color: #666; margin-bottom: 2rem; }

.controls {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
}

.control-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label { font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; }
select, input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; }

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  background: #eee;
  transition: opacity 0.2s;
}
.btn:hover { opacity: 0.8; }

/* Match colors to your toast themes */
.success { background: #27ae60; color: white; }
.error { background: #c0392b; color: white; }
.warning { background: #d35400; color: white; }
.info { background: #2980b9; color: white; }
</style>
