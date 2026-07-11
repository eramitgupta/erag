<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const countries = [
  { name: 'India', key: 'in', isoCode2: 'IN', callingCode: '+91', mask: '##### #####', length: 10 },
  { name: 'United States', key: 'us', isoCode2: 'US', callingCode: '+1', mask: '(###) ###-####', length: 10 },
  { name: 'United Kingdom', key: 'gb', isoCode2: 'GB', callingCode: '+44', mask: '#### ######', length: 10 },
  { name: 'Australia', key: 'au', isoCode2: 'AU', callingCode: '+61', mask: '### ### ###', length: 9 },
  { name: 'Canada', key: 'ca', isoCode2: 'CA', callingCode: '+1', mask: '### ### ####', length: 10 },
  { name: 'Germany', key: 'de', isoCode2: 'DE', callingCode: '+49', mask: '#### #######', length: 11 },
]

const selectedKey = ref('IN')
const localPhone = ref('')

const selectedCountry = computed(() => countries.find(c => c.isoCode2 === selectedKey.value)!)
const isValid = computed(() => localPhone.value.length === selectedCountry.value.length)
const callingCode = computed(() => selectedCountry.value.callingCode)

// Mask includes the calling code prefix to match the real package output format (+91 ##### #####)
const mask = computed(() => `${callingCode.value} ${selectedCountry.value.mask}`)

// Live formatted phone string to show users how the parsed digits look when formatted
const formattedPhone = computed(() => {
  const digits = localPhone.value
  if (!digits) return ''
  
  if (selectedKey.value === 'IN') {
    if (digits.length <= 5) return digits
    return `${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  
  if (selectedKey.value === 'US' || selectedKey.value === 'CA') {
    if (digits.length <= 3) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  
  if (selectedKey.value === 'GB') {
    if (digits.length <= 4) return digits
    return `${digits.slice(0, 4)} ${digits.slice(4)}`
  }
  
  if (selectedKey.value === 'AU') {
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }
  
  return digits
})

watch(selectedKey, () => {
  localPhone.value = ''
})

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  let digits = target.value.replace(/\D/g, '')
  const maxLength = selectedCountry.value.length
  
  if (digits.length > maxLength) {
    digits = digits.slice(0, maxLength)
  }
  
  localPhone.value = digits
  target.value = digits
}
</script>

<template>
  <div class="playground-card">
    <div class="playground-head">
      <span class="playground-badge">INTERACTIVE HOOK DEMO</span>
      <h3>Try the usePhoneNumber hook live</h3>
      <p>Select a country and type numbers to see hook state variables update in real-time.</p>
    </div>

    <div class="playground-body">
      <div class="input-row">
        <div class="select-wrapper">
          <select v-model="selectedKey" class="country-select">
            <option v-for="c in countries" :key="c.key" :value="c.isoCode2">
              {{ c.isoCode2 }} ({{ c.callingCode }})
            </option>
          </select>
        </div>
        <input
          :value="localPhone"
          @input="handleInput"
          type="text"
          inputmode="numeric"
          class="phone-input"
          :placeholder="mask"
        />
      </div>

      <div class="state-inspector">
        <h4>Hook State (phone)</h4>
        <div class="state-grid">
          <div class="state-item">
            <span class="state-label">phone.selectedCountry</span>
            <span class="state-val highlight">{{ selectedCountry.name }} ({{ selectedCountry.isoCode2 }})</span>
          </div>
          <div class="state-item">
            <span class="state-label">phone.callingCode</span>
            <span class="state-val highlight">{{ callingCode }}</span>
          </div>
          <div class="state-item">
            <span class="state-label">phone.localPhone</span>
            <span class="state-val highlight">"{{ localPhone }}"</span>
          </div>
          <div class="state-item">
            <span class="state-label">phone.mask</span>
            <span class="state-val highlight">{{ mask }}</span>
          </div>
          <div class="state-item">
            <span class="state-label">phone.formattedPhone</span>
            <span class="state-val highlight">{{ callingCode }} {{ formattedPhone || '...' }}</span>
          </div>
          <div class="state-item">
            <span class="state-label">phone.isValid</span>
            <span class="state-val" :class="isValid ? 'valid' : 'invalid'">
              {{ isValid ? 'true' : 'false' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground-card {
  margin: 32px 0;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(14, 165, 233, 0.2);
  background: rgba(14, 165, 233, 0.03);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.05);
}

.playground-badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 800;
  border-radius: 4px;
  background: rgba(14, 165, 233, 0.15);
  color: #0369a1;
  margin-bottom: 8px;
}

h3 {
  margin: 0 0 8px 0 !important;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

p {
  margin: 0 0 20px 0 !important;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.select-wrapper {
  position: relative;
  flex-shrink: 0;
}

.country-select {
  height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.country-select:focus {
  border-color: #0ea5e9;
}

.phone-input {
  flex-grow: 1;
  height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.phone-input:focus {
  border-color: #0ea5e9;
}

.state-inspector {
  padding: 16px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

h4 {
  margin: 0 0 12px 0 !important;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}

.state-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

@media (max-width: 900px) {
  .state-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .state-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.state-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.state-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.state-val {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.state-val.highlight {
  color: #0284c7;
  font-family: var(--vp-font-family-mono);
}

.state-val.valid {
  color: #0ea5e9;
}

.state-val.invalid {
  color: var(--vp-c-danger-1);
}
</style>
