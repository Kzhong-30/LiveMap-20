<script setup lang="ts">
import { useGridStore } from '@/stores/gridStore'
import { presetLayouts } from '@/presets'
import { LayoutGrid, Columns, Rows, Space, RotateCcw, Plus, Minus, Grid3x3 } from 'lucide-vue-next'
import PresetLayouts from './PresetLayouts.vue'

const gridStore = useGridStore()

function adjustColumns(delta: number) {
  const newCols = Math.max(1, gridStore.gridConfig.columns + delta)
  gridStore.updateGridConfig({ columns: newCols })
}

function adjustRows(delta: number) {
  const newRows = Math.max(1, gridStore.gridConfig.rows + delta)
  gridStore.updateGridConfig({ rows: newRows })
}

function updateGap(type: 'columnGap' | 'rowGap', value: number) {
  gridStore.updateGridConfig({ [type]: Math.max(0, value) })
}

function resetGrid() {
  gridStore.clearAll()
}
</script>

<template>
  <div class="w-[280px] flex-shrink-0 bg-[#1A1D27] border-r border-[#2A2D3A] flex flex-col h-full overflow-y-auto">
    <div class="p-4 border-b border-[#2A2D3A]">
      <div class="flex items-center gap-2 mb-4">
        <Grid3x3 :size="18" class="text-[#00D4AA]" />
        <h1 class="text-sm font-bold text-[#E0E0E8] tracking-wide">Grid 可视化工具</h1>
      </div>

      <div class="flex items-center justify-between mb-4">
        <span class="text-xs text-[#6B7280] uppercase tracking-wider">网格参数</span>
        <button
          class="p-1 rounded hover:bg-[#2A2D3A] text-[#6B7280] hover:text-[#FF6B6B] transition-colors"
          title="重置"
          @click="resetGrid"
        >
          <RotateCcw :size="14" />
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-[#9CA3AF] flex items-center gap-1.5">
              <Columns :size="12" />
              列数
            </label>
            <span class="text-xs font-mono text-[#00D4AA]">{{ gridStore.gridConfig.columns }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="w-7 h-7 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors"
              @click="adjustColumns(-1)"
            >
              <Minus :size="12" />
            </button>
            <div class="flex-1 h-7 bg-[#0F1117] rounded flex items-center justify-center text-xs font-mono text-[#E0E0E8]">
              {{ gridStore.gridConfig.columns }}
            </div>
            <button
              class="w-7 h-7 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors"
              @click="adjustColumns(1)"
            >
              <Plus :size="12" />
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-[#9CA3AF] flex items-center gap-1.5">
              <Rows :size="12" />
              行数
            </label>
            <span class="text-xs font-mono text-[#00D4AA]">{{ gridStore.gridConfig.rows }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="w-7 h-7 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors"
              @click="adjustRows(-1)"
            >
              <Minus :size="12" />
            </button>
            <div class="flex-1 h-7 bg-[#0F1117] rounded flex items-center justify-center text-xs font-mono text-[#E0E0E8]">
              {{ gridStore.gridConfig.rows }}
            </div>
            <button
              class="w-7 h-7 flex items-center justify-center rounded bg-[#2A2D3A] text-[#E0E0E8] hover:bg-[#3A3D4A] transition-colors"
              @click="adjustRows(1)"
            >
              <Plus :size="12" />
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-[#9CA3AF] flex items-center gap-1.5">
              <Space :size="12" />
              列间距
            </label>
            <span class="text-xs font-mono text-[#00D4AA]">{{ gridStore.gridConfig.columnGap }}px</span>
          </div>
          <input
            type="range"
            :min="0"
            :max="48"
            :value="gridStore.gridConfig.columnGap"
            class="w-full h-1 bg-[#2A2D3A] rounded-lg appearance-none cursor-pointer accent-[#00D4AA]"
            @input="updateGap('columnGap', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-[#9CA3AF] flex items-center gap-1.5">
              <Space :size="12" class="rotate-90" />
              行间距
            </label>
            <span class="text-xs font-mono text-[#00D4AA]">{{ gridStore.gridConfig.rowGap }}px</span>
          </div>
          <input
            type="range"
            :min="0"
            :max="48"
            :value="gridStore.gridConfig.rowGap"
            class="w-full h-1 bg-[#2A2D3A] rounded-lg appearance-none cursor-pointer accent-[#00D4AA]"
            @input="updateGap('rowGap', Number(($event.target as HTMLInputElement).value))"
          />
        </div>
      </div>
    </div>

    <div class="p-4 border-b border-[#2A2D3A]">
      <h3 class="text-xs text-[#6B7280] uppercase tracking-wider mb-3">列宽配置</h3>
      <div class="space-y-2">
        <div
          v-for="(w, i) in gridStore.gridConfig.columnWidths"
          :key="'col-' + i"
          class="flex items-center gap-2"
        >
          <span class="text-[10px] text-[#6B7280] w-6">C{{ i + 1 }}</span>
          <input
            :value="w"
            class="flex-1 h-7 bg-[#0F1117] border border-[#2A2D3A] rounded px-2 text-xs font-mono text-[#E0E0E8] focus:border-[#00D4AA] focus:outline-none transition-colors"
            @change="gridStore.updateColumnWidth(i, ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </div>

    <div class="p-4 border-b border-[#2A2D3A]">
      <h3 class="text-xs text-[#6B7280] uppercase tracking-wider mb-3">行高配置</h3>
      <div class="space-y-2">
        <div
          v-for="(h, i) in gridStore.gridConfig.rowHeights"
          :key="'row-' + i"
          class="flex items-center gap-2"
        >
          <span class="text-[10px] text-[#6B7280] w-6">R{{ i + 1 }}</span>
          <input
            :value="h"
            class="flex-1 h-7 bg-[#0F1117] border border-[#2A2D3A] rounded px-2 text-xs font-mono text-[#E0E0E8] focus:border-[#00D4AA] focus:outline-none transition-colors"
            @change="gridStore.updateRowHeight(i, ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </div>

    <div class="p-4">
      <h3 class="text-xs text-[#6B7280] uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <LayoutGrid :size="12" />
        预设布局
      </h3>
      <PresetLayouts />
    </div>

    <div class="p-4 border-t border-[#2A2D3A]">
      <button
        class="w-full h-9 bg-[#00D4AA] text-[#0F1117] rounded-lg text-xs font-semibold hover:bg-[#00E4BA] transition-colors flex items-center justify-center gap-1.5"
        @click="gridStore.addItem()"
      >
        <Plus :size="14" />
        添加网格项
      </button>
    </div>
  </div>
</template>
