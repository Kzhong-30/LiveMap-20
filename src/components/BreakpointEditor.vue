<script setup lang="ts">
import { ref } from 'vue'
import { useGridStore } from '@/stores/gridStore'
import { Plus, Trash2, Monitor, Smartphone, Tablet } from 'lucide-vue-next'
import type { BreakpointConfig } from '@/types'

const gridStore = useGridStore()

const newName = ref('')
const newMinWidth = ref(768)
const showAdd = ref(false)

const deviceIcons: Record<string, any> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
}

function guessDevice(width: number): string {
  if (width <= 480) return 'mobile'
  if (width <= 1024) return 'tablet'
  return 'desktop'
}

function addBreakpoint() {
  if (!newName.value.trim()) return
  gridStore.addBreakpoint(newName.value.trim(), newMinWidth.value)
  newName.value = ''
  newMinWidth.value = 768
  showAdd.value = false
}

function removeBreakpoint(index: number) {
  gridStore.removeBreakpoint(index)
}

function captureCurrent(index: number) {
  gridStore.updateBreakpoint(index, {
    gridConfig: {
      ...gridStore.gridConfig,
      columnWidths: [...gridStore.gridConfig.columnWidths],
      rowHeights: [...gridStore.gridConfig.rowHeights],
    },
    items: gridStore.items.map(i => ({ ...i })),
  })
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-xs text-[#6B7280] uppercase tracking-wider">响应式断点</h3>
      <button
        class="p-1 rounded hover:bg-[#2A2D3A] text-[#6B7280] hover:text-[#00D4AA] transition-colors"
        @click="showAdd = !showAdd"
      >
        <Plus :size="14" />
      </button>
    </div>

    <div v-if="showAdd" class="p-3 bg-[#0F1117] rounded-lg border border-[#2A2D3A] space-y-2">
      <input
        v-model="newName"
        placeholder="断点名称 (如: mobile)"
        class="w-full h-7 bg-[#1A1D27] border border-[#2A2D3A] rounded px-2 text-xs text-[#E0E0E8] placeholder-[#4A4D5A] focus:border-[#00D4AA] focus:outline-none transition-colors"
      />
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-[#6B7280]">max-width:</span>
        <input
          v-model.number="newMinWidth"
          type="number"
          class="flex-1 h-7 bg-[#1A1D27] border border-[#2A2D3A] rounded px-2 text-xs font-mono text-[#E0E0E8] focus:border-[#00D4AA] focus:outline-none transition-colors"
        />
        <span class="text-[10px] text-[#6B7280]">px</span>
      </div>
      <button
        class="w-full h-7 bg-[#00D4AA] text-[#0F1117] rounded text-xs font-semibold hover:bg-[#00E4BA] transition-colors"
        @click="addBreakpoint"
      >
        添加断点
      </button>
    </div>

    <div v-if="gridStore.breakpoints.length === 0" class="text-[10px] text-[#4A4D5A] text-center py-3">
      暂无断点配置
    </div>

    <div
      v-for="(bp, i) in gridStore.breakpoints"
      :key="i"
      class="p-3 bg-[#0F1117] rounded-lg border border-[#2A2D3A] space-y-2"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <component :is="deviceIcons[guessDevice(bp.minWidth)] || Monitor" :size="12" class="text-[#00D4AA]" />
          <span class="text-xs text-[#E0E0E8] font-medium">{{ bp.name }}</span>
          <span class="text-[10px] text-[#6B7280]">@media (max-width: {{ bp.minWidth }}px)</span>
        </div>
        <button
          class="p-1 rounded hover:bg-[#2A2D3A] text-[#6B7280] hover:text-[#FF6B6B] transition-colors"
          @click="removeBreakpoint(i)"
        >
          <Trash2 :size="12" />
        </button>
      </div>
      <div class="text-[10px] text-[#6B7280]">
        {{ bp.gridConfig.columns }}列 × {{ bp.gridConfig.rows }}行 · {{ bp.items.length }}项
      </div>
      <button
        class="w-full h-6 bg-[#2A2D3A] text-[#9CA3AF] rounded text-[10px] hover:bg-[#3A3D4A] hover:text-[#E0E0E8] transition-colors"
        @click="captureCurrent(i)"
      >
        捕获当前布局
      </button>
    </div>
  </div>
</template>
