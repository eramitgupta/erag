<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  type ToastPosition,
  type ToastType,
  useConfirmation,
  useToast
} from '@erag/vue-toastification'

const toast = useToast()
const modal = useConfirmation()

const currentPosition = ref<ToastPosition>('bottom-right')
const duration = ref(4000)

const TOAST_CONFIG = {
  success: {
    title: 'Good job!',
    message: 'Data has been saved successfully.'
  },
  error: {
    title: 'Oops!',
    message: 'Something went wrong with the server.'
  },
  warning: {
    title: 'Attention',
    message: 'Your session is about to expire.'
  },
  info: {
    title: 'Did you know?',
    message: 'New updates are available for download.'
  }
} as const

const POSITION_OPTIONS = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' }
] as const

/**
 * Update global position when dropdown changes
 */
const updatePosition = () => {
  toast.setPosition(currentPosition.value)
}

// Watch for position changes
watch(currentPosition, updatePosition)

/**
 * Trigger toast based on type
 */
const trigger = (type: ToastType) => {
  const config = TOAST_CONFIG[type]
  toast[type](
      config.message,
      config.title,
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
    message: 'Are you sure you want to deactivate your account? This action cannot be undone.',
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
        <h3>Dialog Test</h3>
        <button class="btn error" @click="deleteAccount">
          Delete Account
        </button>
      </div>

      <hr />

      <div class="control-group">
        <label for="position-select">Position:</label>
        <select
            id="position-select"
            v-model="currentPosition"
        >
          <option
              v-for="option in POSITION_OPTIONS"
              :key="option.value"
              :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <label for="duration-input">Duration (ms):</label>
        <input
            id="duration-input"
            v-model.number="duration"
            type="number"
            step="500"
            min="1000"
        />
      </div>

      <hr />

      <div class="buttons">
        <button class="btn success" @click="trigger('success')">Success Toast</button>
        <button class="btn error" @click="trigger('error')">Error Toast</button>
        <button class="btn warning" @click="trigger('warning')">Warning Toast</button>
        <button class="btn info" @click="trigger('info')">Info Toast</button>
      </div>

      <div class="buttons">
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
  padding: 1.25rem;
}

h1 {
  margin-bottom: 0.5rem;
  margin-top: 0;
}

h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
  margin-top: 0;
}

.controls {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 25rem;
}

hr {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid #e5e5e5;
}

.control-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.3125rem;
  color: #333;
}

select,
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

select:focus,
input:focus {
  outline: none;
  border-color: #2980b9;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  margin-top: 0.625rem;
}

.btn {
  padding: 0.625rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  background: #eee;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.success {
  background: #27ae60;
  color: white;
}

.error {
  background: #c0392b;
  color: white;
}

.warning {
  background: #d35400;
  color: white;
}

.info {
  background: #2980b9;
  color: white;
}
</style>