import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LayoutHistory, GridConfig, GridItem, BreakpointConfig } from '@/types'

const STORAGE_KEY = 'grid-layout-history'
const MAX_HISTORY = 20

function loadHistory(): LayoutHistory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveHistory(list: LayoutHistory[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)))
  } catch {}
}

export const useHistoryStore = defineStore('history', () => {
  const histories = ref<LayoutHistory[]>(loadHistory())

  function save(name: string, gridConfig: GridConfig, items: GridItem[], breakpoints: BreakpointConfig[]) {
    const entry: LayoutHistory = {
      id: `history-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      timestamp: Date.now(),
      gridConfig: {
        ...gridConfig,
        columnWidths: [...gridConfig.columnWidths],
        rowHeights: [...gridConfig.rowHeights],
      },
      items: items.map(i => ({ ...i })),
      breakpoints: breakpoints.map(bp => ({
        ...bp,
        gridConfig: { ...bp.gridConfig, columnWidths: [...bp.gridConfig.columnWidths], rowHeights: [...bp.gridConfig.rowHeights] },
        items: bp.items.map(i => ({ ...i })),
      })),
    }
    histories.value = [entry, ...histories.value].slice(0, MAX_HISTORY)
    saveHistory(histories.value)
  }

  function remove(id: string) {
    histories.value = histories.value.filter(h => h.id !== id)
    saveHistory(histories.value)
  }

  function clear() {
    histories.value = []
    saveHistory([])
  }

  function getEntry(id: string): LayoutHistory | undefined {
    return histories.value.find(h => h.id === id)
  }

  return {
    histories,
    save,
    remove,
    clear,
    getEntry,
  }
})
