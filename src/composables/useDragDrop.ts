import { ref, type Ref, computed } from 'vue'
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
    return canvasRef.value.querySelector('[style*="display: grid"]') as HTMLElement | null
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
    if (highlight) {
      gridStore.addItem({
        columnStart: highlight.col,
        columnEnd: highlight.col + 1,
        rowStart: highlight.row,
        rowEnd: highlight.row + 1,
        label: `Item ${highlight.col},${highlight.row}`,
      })
    }
    dragOverCell.value = null
  }

  function onDragSourceStart(e: DragEvent) {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', 'new-grid-item')
      e.dataTransfer.effectAllowed = 'copy'
    }
  }

  function onItemDragStart(e: DragEvent, itemId: string) {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', itemId)
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  function onItemDrop(e: DragEvent, targetItemId: string) {
    e.preventDefault()
    e.stopPropagation()
    const sourceId = e.dataTransfer?.getData('text/plain')
    if (sourceId && sourceId !== targetItemId && sourceId !== 'new-grid-item') {
      const sourceItem = gridStore.items.find(i => i.id === sourceId)
      const targetItem = gridStore.items.find(i => i.id === targetItemId)
      if (sourceItem && targetItem) {
        gridStore.updateItem(sourceId, {
          columnStart: targetItem.columnStart,
          columnEnd: targetItem.columnEnd,
          rowStart: targetItem.rowStart,
          rowEnd: targetItem.rowEnd,
        })
      }
    }
  }

  return {
    dragOverCell,
    isDragging,
    onCanvasDragOver,
    onCanvasDragLeave,
    onCanvasDrop,
    onDragSourceStart,
    onItemDragStart,
    onItemDrop,
  }
}
