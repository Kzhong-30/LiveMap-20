<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGridStore } from '@/stores/gridStore'
import { useDragDrop } from '@/composables/useDragDrop'
import GridItemCard from './GridItemCard.vue'
import { Plus } from 'lucide-vue-next'

const gridStore = useGridStore()

const canvasRef = ref<HTMLElement | null>(null)

const {
  dragOverCell,
  isDragging,
  onCanvasDragOver,
  onCanvasDragLeave,
  onCanvasDrop,
} = useDragDrop(canvasRef)

const emptyCells = computed(() => {
  const cells: { col: number; row: number }[] = []
  for (let r = 1; r <= gridStore.gridConfig.rows; r++) {
    for (let c = 1; c <= gridStore.gridConfig.columns; c++) {
      cells.push({ col: c, row: r })
    }
  }
  return cells
})

function handleAddItem() {
  gridStore.addItem({
    columnStart: 1,
    columnEnd: 2,
    rowStart: 1,
    rowEnd: 2,
    label: `Item 1,1`,
  })
}

function handleSelect(id: string) {
  gridStore.selectItem(id)
}

function handleDelete(id: string) {
  gridStore.removeItem(id)
}
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-sm font-semibold text-[#E0E0E8] tracking-wide uppercase">画布</h2>
      <span class="text-xs text-[#6B7280]">{{ gridStore.items.length }} 个网格项</span>
    </div>
    <div
      ref="canvasRef"
      class="relative flex-1 min-h-[500px] rounded-xl border border-[#2A2D3A] bg-[#0F1117] overflow-auto p-4 transition-all duration-300"
      :class="{ 'border-[#00D4AA]/50 shadow-[0_0_20px_rgba(0,212,170,0.1)]': isDragging }"
      @dragover="onCanvasDragOver"
      @dragleave="onCanvasDragLeave"
      @drop="onCanvasDrop"
    >
      <div
        data-grid-container
        class="w-full min-h-[460px]"
        :style="{
          display: 'grid',
          gridTemplateColumns: gridStore.gridConfig.columnWidths.join(' '),
          gridTemplateRows: gridStore.gridConfig.rowHeights.join(' '),
          columnGap: gridStore.gridConfig.columnGap + 'px',
          rowGap: gridStore.gridConfig.rowGap + 'px',
        }"
      >
        <template v-if="gridStore.items.length === 0">
          <div
            v-for="cell in emptyCells"
            :key="`empty-${cell.col}-${cell.row}`"
            class="rounded-lg border-2 border-dashed border-[#2A2D3A] flex items-center justify-center text-[#4A4D5A] text-[10px] min-h-[48px]"
            :style="{
              gridColumn: cell.col,
              gridRow: cell.row,
            }"
          >
            {{ cell.col }},{{ cell.row }}
          </div>
        </template>
        <GridItemCard
          v-for="item in gridStore.items"
          :key="item.id"
          :item="item"
          :is-selected="item.id === gridStore.selectedItemId"
          @select="handleSelect"
          @delete="handleDelete"
        />
      </div>

      <div
        v-if="isDragging && dragOverCell"
        class="absolute pointer-events-none rounded-lg bg-[#00D4AA]/20 border-2 border-[#00D4AA] animate-pulse z-10"
        :style="{
          left: dragOverCell.left + 'px',
          top: dragOverCell.top + 'px',
          width: dragOverCell.width + 'px',
          height: dragOverCell.height + 'px',
        }"
      />

      <div
        v-if="gridStore.items.length === 0 && !isDragging"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div class="text-center">
          <div class="text-[#4A4D5A] mb-3 text-sm">拖拽或点击添加网格项</div>
          <button
            class="inline-flex items-center gap-2 px-4 py-2 bg-[#00D4AA] text-[#0F1117] rounded-lg text-sm font-medium hover:bg-[#00E4BA] transition-colors"
            @click="handleAddItem"
          >
            <Plus :size="16" />
            添加网格项
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
