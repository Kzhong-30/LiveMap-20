import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { GridConfig, GridItem, BreakpointConfig } from '@/types'
import { createDefaultGridConfig, createDefaultItem } from '@/types'

export const useGridStore = defineStore('grid', () => {
  const gridConfig = ref<GridConfig>(createDefaultGridConfig())
  const items = ref<GridItem[]>([])
  const selectedItemId = ref<string | null>(null)
  const breakpoints = ref<BreakpointConfig[]>([])
  const activeBreakpoint = ref<string | null>(null)

  const selectedItem = computed(() => {
    if (!selectedItemId.value) return null
    return items.value.find(i => i.id === selectedItemId.value) ?? null
  })

  function updateGridConfig(partial: Partial<GridConfig>) {
    const old = { ...gridConfig.value }
    gridConfig.value = { ...old, ...partial }

    if (partial.columns !== undefined && partial.columns !== old.columns) {
      const diff = partial.columns - old.columns
      if (diff > 0) {
        gridConfig.value.columnWidths = [...old.columnWidths, ...Array(diff).fill('1fr')]
      } else {
        gridConfig.value.columnWidths = old.columnWidths.slice(0, partial.columns)
      }
      items.value = items.value.filter(i => i.columnEnd <= partial.columns + 1 && i.columnStart <= partial.columns)
    }

    if (partial.rows !== undefined && partial.rows !== old.rows) {
      const diff = partial.rows - old.rows
      if (diff > 0) {
        gridConfig.value.rowHeights = [...old.rowHeights, ...Array(diff).fill('1fr')]
      } else {
        gridConfig.value.rowHeights = old.rowHeights.slice(0, partial.rows)
      }
      items.value = items.value.filter(i => i.rowEnd <= partial.rows + 1 && i.rowStart <= partial.rows)
    }
  }

  function updateColumnWidth(index: number, value: string) {
    const widths = [...gridConfig.value.columnWidths]
    widths[index] = value
    gridConfig.value = { ...gridConfig.value, columnWidths: widths }
  }

  function updateRowHeight(index: number, value: string) {
    const heights = [...gridConfig.value.rowHeights]
    heights[index] = value
    gridConfig.value = { ...gridConfig.value, rowHeights: heights }
  }

  function addItem(item?: Partial<GridItem>) {
    const col = item?.columnStart ?? 1
    const row = item?.rowStart ?? 1
    const newItem = {
      ...createDefaultItem(col, row),
      ...item,
    }
    items.value = [...items.value, newItem]
    selectedItemId.value = newItem.id
  }

  function removeItem(id: string) {
    items.value = items.value.filter(i => i.id !== id)
    if (selectedItemId.value === id) {
      selectedItemId.value = null
    }
  }

  function updateItem(id: string, partial: Partial<GridItem>) {
    items.value = items.value.map(i =>
      i.id === id ? { ...i, ...partial } : i
    )
  }

  function selectItem(id: string | null) {
    selectedItemId.value = id
  }

  function loadPreset(config: GridConfig, presetItems: GridItem[]) {
    gridConfig.value = { ...config }
    items.value = presetItems.map(item => ({
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }))
    selectedItemId.value = null
    _defaultGridConfig.value = null
    _defaultItems.value = null
    activeBreakpoint.value = null
  }

  function addBreakpoint(name: string, minWidth: number) {
    breakpoints.value = [
      ...breakpoints.value,
      {
        name,
        minWidth,
        gridConfig: { ...gridConfig.value, columnWidths: [...gridConfig.value.columnWidths], rowHeights: [...gridConfig.value.rowHeights] },
        items: items.value.map(i => ({ ...i })),
      },
    ]
  }

  function removeBreakpoint(index: number) {
    breakpoints.value = breakpoints.value.filter((_, i) => i !== index)
  }

  function updateBreakpoint(index: number, partial: Partial<BreakpointConfig>) {
    breakpoints.value = breakpoints.value.map((bp, i) =>
      i === index ? { ...bp, ...partial } : bp
    )
  }

  const _defaultGridConfig = ref<GridConfig | null>(null)
  const _defaultItems = ref<GridItem[] | null>(null)

  function switchToBreakpoint(index: number) {
    if (_defaultGridConfig.value === null) {
      _defaultGridConfig.value = {
        ...gridConfig.value,
        columnWidths: [...gridConfig.value.columnWidths],
        rowHeights: [...gridConfig.value.rowHeights],
      }
      _defaultItems.value = items.value.map(i => ({ ...i }))
    }
    const bp = breakpoints.value[index]
    gridConfig.value = {
      ...bp.gridConfig,
      columnWidths: [...bp.gridConfig.columnWidths],
      rowHeights: [...bp.gridConfig.rowHeights],
    }
    items.value = bp.items.map(i => ({ ...i }))
    activeBreakpoint.value = bp.name
    selectedItemId.value = null
  }

  function switchToDefault() {
    if (_defaultGridConfig.value) {
      gridConfig.value = {
        ..._defaultGridConfig.value,
        columnWidths: [..._defaultGridConfig.value.columnWidths],
        rowHeights: [..._defaultGridConfig.value.rowHeights],
      }
      items.value = _defaultItems.value?.map(i => ({ ...i })) ?? []
      _defaultGridConfig.value = null
      _defaultItems.value = null
    }
    activeBreakpoint.value = null
    selectedItemId.value = null
  }

  function saveCurrentToActiveBreakpoint() {
    if (activeBreakpoint.value === null) return
    const idx = breakpoints.value.findIndex(bp => bp.name === activeBreakpoint.value)
    if (idx === -1) return
    breakpoints.value = breakpoints.value.map((bp, i) =>
      i === idx
        ? {
            ...bp,
            gridConfig: { ...gridConfig.value, columnWidths: [...gridConfig.value.columnWidths], rowHeights: [...gridConfig.value.rowHeights] },
            items: items.value.map(i => ({ ...i })),
          }
        : bp
    )
  }

  function clearAll() {
    gridConfig.value = createDefaultGridConfig()
    items.value = []
    selectedItemId.value = null
    breakpoints.value = []
    activeBreakpoint.value = null
    _defaultGridConfig.value = null
    _defaultItems.value = null
  }

  function getSnapshot() {
    return {
      gridConfig: {
        ...gridConfig.value,
        columnWidths: [...gridConfig.value.columnWidths],
        rowHeights: [...gridConfig.value.rowHeights],
      },
      items: items.value.map(i => ({ ...i })),
      breakpoints: breakpoints.value.map(bp => ({
        ...bp,
        gridConfig: { ...bp.gridConfig, columnWidths: [...bp.gridConfig.columnWidths], rowHeights: [...bp.gridConfig.rowHeights] },
        items: bp.items.map(i => ({ ...i })),
      })),
    }
  }

  function restoreSnapshot(snapshot: { gridConfig: GridConfig; items: GridItem[]; breakpoints: BreakpointConfig[] }) {
    gridConfig.value = snapshot.gridConfig
    items.value = snapshot.items
    breakpoints.value = snapshot.breakpoints
    selectedItemId.value = null
  }

  return {
    gridConfig,
    items,
    selectedItemId,
    breakpoints,
    activeBreakpoint,
    selectedItem,
    updateGridConfig,
    updateColumnWidth,
    updateRowHeight,
    addItem,
    removeItem,
    updateItem,
    selectItem,
    loadPreset,
    addBreakpoint,
    removeBreakpoint,
    updateBreakpoint,
    switchToBreakpoint,
    switchToDefault,
    saveCurrentToActiveBreakpoint,
    clearAll,
    getSnapshot,
    restoreSnapshot,
  }
})
