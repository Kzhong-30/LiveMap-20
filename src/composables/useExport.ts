import { computed } from 'vue'
import { useGridStore } from '@/stores/gridStore'
import { generateGridCSS, generateFullHTML } from '@/types'

export function useExport() {
  const gridStore = useGridStore()

  const cssCode = computed(() => {
    return generateGridCSS(gridStore.gridConfig, gridStore.items)
  })

  const fullHTML = computed(() => {
    return generateFullHTML(gridStore.gridConfig, gridStore.items, gridStore.breakpoints)
  })

  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  return {
    cssCode,
    fullHTML,
    copyToClipboard,
  }
}
