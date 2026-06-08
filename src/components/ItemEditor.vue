<script setup lang="ts">
import { useGridStore } from '@/stores/gridStore'
import { AlignLeft, AlignCenterHorizontal, AlignRight, AlignHorizontalSpaceAround, ArrowUp, ArrowDown, Minimize2, Trash2 } from 'lucide-vue-next'
import type { JustifySelf, AlignSelf } from '@/types'

const gridStore = useGridStore()

const justifyOptions: { value: JustifySelf; icon: any; label: string }[] = [
  { value: 'start', icon: AlignLeft, label: '左对齐' },
  { value: 'center', icon: AlignCenterHorizontal, label: '居中' },
  { value: 'end', icon: AlignRight, label: '右对齐' },
  { value: 'stretch', icon: AlignHorizontalSpaceAround, label: '拉伸' },
]

const alignOptions: { value: AlignSelf; icon: any; label: string }[] = [
  { value: 'start', icon: ArrowUp, label: '顶部' },
  { value: 'center', icon: Minimize2, label: '居中' },
  { value: 'end', icon: ArrowDown, label: '底部' },
  { value: 'stretch', icon: AlignHorizontalSpaceAround, label: '拉伸' },
]

const colorOptions = [
  '#00D4AA', '#FF6B6B', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F0B27A', '#82E0AA', '#F1948A', '#AED6F1', '#2A2D3A',
]

function updateField(field: string, value: any) {
  if (!gridStore.selectedItemId) return
  gridStore.updateItem(gridStore.selectedItemId, { [field]: value })
}

function updateSpan(type: 'columnEnd' | 'rowEnd', delta: number) {
  if (!gridStore.selectedItemId || !gridStore.selectedItem) return
  const item = gridStore.selectedItem
  if (type === 'columnEnd') {
    const newVal = Math.max(item.columnStart + 1, Math.min(item.columnEnd + delta, gridStore.gridConfig.columns + 1))
    gridStore.updateItem(gridStore.selectedItemId, { columnEnd: newVal })
  } else {
    const newVal = Math.max(item.rowStart + 1, Math.min(item.rowEnd + delta, gridStore.gridConfig.rows + 1))
    gridStore.updateItem(gridStore.selectedItemId, { rowEnd: newVal })
  }
}

function updatePosition(type: 'columnStart' | 'rowStart', delta: number) {
  if (!gridStore.selectedItemId || !gridStore.selectedItem) return
  const item = gridStore.selectedItem
  if (type === 'columnStart') {
    const newVal = Math.max(1, Math.min(item.columnStart + delta, gridStore.gridConfig.columns))
    const maxEnd = gridStore.gridConfig.columns + 1
    const span = item.columnEnd - item.columnStart
    const newEnd = Math.min(newVal + span, maxEnd)
    gridStore.updateItem(gridStore.selectedItemId, { columnStart: newVal, columnEnd: newEnd })
  } else {
    const newVal = Math.max(1, Math.min(item.rowStart + delta, gridStore.gridConfig.rows))
    const maxEnd = gridStore.gridConfig.rows + 1
    const span = item.rowEnd - item.rowStart
    const newEnd = Math.min(newVal + span, maxEnd)
    gridStore.updateItem(gridStore.selectedItemId, { rowStart: newVal, rowEnd: newEnd })
  }
}
</script>

<template>
  <div v-if="gridStore.selectedItem" class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-xs text-[#6B7280] uppercase tracking-wider">网格项属性</h3>
      <button
        class="p-1 rounded hover:bg-[#2A2D3A] text-[#6B7280] hover:text-[#FF6B6B] transition-colors"
        @click="gridStore.removeItem(gridStore.selectedItemId!)"
      >
        <Trash2 :size="14" />
      </button>
    </div>

    <div>
      <label class="text-[10px] text-[#6B7280] mb-1.5 block">名称</label>
      <input
        :value="gridStore.selectedItem.label"
        class="w-full h-7 bg-[#0F1117] border border-[#2A2D3A] rounded px-2 text-xs font-mono text-[#E0E0E8] focus:border-[#00D4AA] focus:outline-none transition-colors"
        @input="updateField('label', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-[10px] text-[#6B7280] mb-1.5 block">起始列</label>
        <div class="flex items-center gap-1">
          <button
            class="w-6 h-6 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors text-[10px]"
            @click="updatePosition('columnStart', -1)"
          >-</button>
          <span class="flex-1 text-center text-xs font-mono text-[#00D4AA]">{{ gridStore.selectedItem.columnStart }}</span>
          <button
            class="w-6 h-6 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors text-[10px]"
            @click="updatePosition('columnStart', 1)"
          >+</button>
        </div>
      </div>
      <div>
        <label class="text-[10px] text-[#6B7280] mb-1.5 block">起始行</label>
        <div class="flex items-center gap-1">
          <button
            class="w-6 h-6 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors text-[10px]"
            @click="updatePosition('rowStart', -1)"
          >-</button>
          <span class="flex-1 text-center text-xs font-mono text-[#00D4AA]">{{ gridStore.selectedItem.rowStart }}</span>
          <button
            class="w-6 h-6 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors text-[10px]"
            @click="updatePosition('rowStart', 1)"
          >+</button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-[10px] text-[#6B7280] mb-1.5 block">跨列数</label>
        <div class="flex items-center gap-1">
          <button
            class="w-6 h-6 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors text-[10px]"
            @click="updateSpan('columnEnd', -1)"
          >-</button>
          <span class="flex-1 text-center text-xs font-mono text-[#00D4AA]">{{ gridStore.selectedItem.columnEnd - gridStore.selectedItem.columnStart }}</span>
          <button
            class="w-6 h-6 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors text-[10px]"
            @click="updateSpan('columnEnd', 1)"
          >+</button>
        </div>
      </div>
      <div>
        <label class="text-[10px] text-[#6B7280] mb-1.5 block">跨行数</label>
        <div class="flex items-center gap-1">
          <button
            class="w-6 h-6 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors text-[10px]"
            @click="updateSpan('rowEnd', -1)"
          >-</button>
          <span class="flex-1 text-center text-xs font-mono text-[#00D4AA]">{{ gridStore.selectedItem.rowEnd - gridStore.selectedItem.rowStart }}</span>
          <button
            class="w-6 h-6 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors text-[10px]"
            @click="updateSpan('rowEnd', 1)"
          >+</button>
        </div>
      </div>
    </div>

    <div>
      <label class="text-[10px] text-[#6B7280] mb-1.5 block">水平对齐 (justify-self)</label>
      <div class="flex gap-1">
        <button
          v-for="opt in justifyOptions"
          :key="opt.value"
          class="flex-1 h-7 flex items-center justify-center rounded transition-colors"
          :class="[
            gridStore.selectedItem.justifySelf === opt.value
              ? 'bg-[#00D4AA] text-[#0F1117]'
              : 'bg-[#2A2D3A] text-[#9CA3AF] hover:bg-[#3A3D4A]',
          ]"
          :title="opt.label"
          @click="updateField('justifySelf', opt.value)"
        >
          <component :is="opt.icon" :size="12" />
        </button>
      </div>
    </div>

    <div>
      <label class="text-[10px] text-[#6B7280] mb-1.5 block">垂直对齐 (align-self)</label>
      <div class="flex gap-1">
        <button
          v-for="opt in alignOptions"
          :key="opt.value"
          class="flex-1 h-7 flex items-center justify-center rounded transition-colors"
          :class="[
            gridStore.selectedItem.alignSelf === opt.value
              ? 'bg-[#00D4AA] text-[#0F1117]'
              : 'bg-[#2A2D3A] text-[#9CA3AF] hover:bg-[#3A3D4A]',
          ]"
          :title="opt.label"
          @click="updateField('alignSelf', opt.value)"
        >
          <component :is="opt.icon" :size="12" />
        </button>
      </div>
    </div>

    <div>
      <label class="text-[10px] text-[#6B7280] mb-1.5 block">背景颜色</label>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="color in colorOptions"
          :key="color"
          class="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
          :class="[
            gridStore.selectedItem.backgroundColor === color ? 'border-white scale-110' : 'border-transparent',
          ]"
          :style="{ backgroundColor: color }"
          @click="updateField('backgroundColor', color)"
        />
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center py-8 text-[#4A4D5A]">
    <p class="text-xs">选择一个网格项以编辑属性</p>
  </div>
</template>
