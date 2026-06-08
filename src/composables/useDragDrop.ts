import { ref, type Ref } from 'vue'
import { useGridStore } from '@/stores/gridStore'

export function useDragDrop(canvasRef: Ref<HTMLElement | null>) {
  const gridStore = useGridStore()
  const dragOverCell = ref<{ col: number; row: number } | null>(null)
  const isDragging = ref(false)

  function getCellFromEvent(e: DragEvent): { col: number; row: number } | null {
    if (!canvasRef.value) return null
    const rect = canvasRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const cols = gridStore.gridConfig.columns
    const rows = gridStore.gridConfig.rows
    const gapX = gridStore.gridConfig.columnGap
    const gapY = gridStore.gridConfig.rowGap

    const totalGapX = gapX * (cols - 1)
    const totalGapY = gapY * (rows - 1)
    const cellW = (rect.width - totalGapX) / cols
    const cellH = (rect.height - totalGapY) / rows

    const col = Math.min(Math.floor(x / (cellW + gapX)) + 1, cols)
    const row = Math.min(Math.floor(y / (cellH + gapY)) + 1, rows)

    if (col < 1 || row < 1) return null
    return { col, row }
  }

  function onCanvasDragOver(e: DragEvent) {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
    isDragging.value = true
    dragOverCell.value = getCellFromEvent(e)
  }

  function onCanvasDragLeave() {
    isDragging.value = false
    dragOverCell.value = null
  }

  function onCanvasDrop(e: DragEvent) {
    e.preventDefault()
    isDragging.value = false
    const cell = getCellFromEvent(e)
    if (cell) {
      gridStore.addItem({
        columnStart: cell.col,
        columnEnd: cell.col + 1,
        rowStart: cell.row,
        rowEnd: cell.row + 1,
        label: `Item ${cell.col},${cell.row}`,
      })
    }
    dragOverCell.value = null
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
    if (sourceId && sourceId !== targetItemId) {
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
    onItemDragStart,
    onItemDrop,
  }
}
