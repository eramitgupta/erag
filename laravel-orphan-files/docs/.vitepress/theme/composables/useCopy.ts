import { ref } from 'vue'

/**
 * Some browsers and embedded views block the async clipboard API,
 * so fall back to a hidden textarea and execCommand.
 */
function legacyCopy(text: string): boolean {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(area)

  return ok
}

export function useCopy(resetAfterMs = 1800) {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(text: string): Promise<void> {
    let ok = false

    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      ok = legacyCopy(text)
    }

    if (!ok) {
      return
    }

    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), resetAfterMs)
  }

  return { copied, copy }
}
