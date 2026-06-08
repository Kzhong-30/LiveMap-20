import { ref, type Ref } from 'vue'
import { useGridStore } from '@/stores/gridStore'

export interface CellHighlight {
  left: number
  top: number
  width: number
  height: number
  col: number
  row: number
}

export function useDragDrop(canvasRef: Ref<HTMLElement | null>) {
  const gridStore = useGridStore()
  const dragOverCell = ref<CellHighlight | null>(null)
  const isDragging = ref(false)

  function getGridContainer(): HTMLElement | null {
    if (!canvasRef.value) return null
    return canvasRef.value.querySelector('[data-grid-container]') as HTMLElement | null
  }

  function getCellHighlight(e: DragEvent): CellHighlight | null {
    const gridEl = getGridContainer()
    if (!gridEl) return null

    const canvasRect = canvasRef.value!.getBoundingClientRect()
    const gridRect = gridEl.getBoundingClientRect()

    const x = e.clientX - gridRect.left
    const y = e.clientY - gridRect.top

    const cols = gridStore.gridConfig.columns
    const rows = gridStore.gridConfig.rows
    const gapX = gridStore.gridConfig.columnGap
    const gapY = gridStore.gridConfig.rowGap

    const totalGapX = gapX * (cols - 1)
    const totalGapY = gapY * (rows - 1)
    const cellW = (gridRect.width - totalGapX) / cols
    const cellH = (gridRect.height - totalGapY) / rows

    const col = Math.max(1, Math.min(Math.floor(x / (cellW + gapX)) + 1, cols))
    const row = Math.max(1, Math.min(Math.floor(y / (cellH + gapY)) + 1, rows))

    const cellLeft = (col - 1) * (cellW + gapX)
    const cellTop = (row - 1) * (cellH + gapY)

    const highlightLeft = gridRect.left - canvasRect.left + cellLeft
    const highlightTop = gridRect.top - canvasRect.top + cellTop

    return {
      left: highlightLeft,
      top: highlightTop,
      width: cellW,
      height: cellH,
      col,
      row,
    }
  }

  function onCanvasDragOver(e: DragEvent) {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
    isDragging.value = true
    dragOverCell.value = getCellHighlight(e)
  }

  function onCanvasDragLeave() {
    isDragging.value = false
    dragOverCell.value = null
  }

  function onCanvasDrop(e: DragEvent) {
    e.preventDefault()
    isDragging.value = false
    const highlight = getCellHighlight(e)
    if (!highlight) {
      dragOverCell.value = null
      return
    }

    const data = e.dataTransfer?.getData('text/plain') ?? ''

    if (data === 'new-grid-item') {
      gridStore.addItem({
        columnStart: highlight.col,
        columnEnd: highlight.col + 1,
        rowStart: highlight.row,
        rowEnd: highlight.row + 1,
        label: `Item ${highlight.col},${highlight.row}`,
      })
    } else {
      const existingItem = gridStore.items.find(i => i.id === data)
      if (existingItem) {
        const spanCols = existingItem.columnEnd - existingItem.columnStart
        const spanRows = existingItem.rowEnd - existingItem.rowStart
        const maxCol = gridStore.gridConfig.columns
        const maxRow = gridStore.gridConfig.rows
        const newColStart = Math.min(highlight.col, maxCol - spanCols + 1)
        const newRowStart = Math.min(highlight.row, maxRow - spanRows + 1)
        gridStore.updateItem(data, {
          columnStart: newColStart,
          columnEnd: newColStart + spanCols,
          rowStart: newRowStart,
          rowEnd: newRowStart + spanRows,
        })
      }
    }

    dragOverCell.value = null
  }

  return {
    dragOverCell,
    isDragging,
    onCanvasDragOver,
    onCanvasDragLeave,
    onCanvasDrop,
  }
}
