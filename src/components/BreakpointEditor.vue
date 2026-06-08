<script setup lang="ts">
import { ref } from 'vue'
import { useGridStore } from '@/stores/gridStore'
import { Plus, Trash2, Monitor, Smartphone, Tablet, ArrowRight, Save } from 'lucide-vue-next'
import type { BreakpointConfig } from '@/types'

const gridStore = useGridStore()

const newName = ref('')
const newMaxWidth = ref(768)
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
  gridStore.addBreakpoint(newName.value.trim(), newMaxWidth.value)
  newName.value = ''
  newMaxWidth.value = 768
  showAdd.value = false
}

function removeBreakpoint(index: number) {
  if (gridStore.activeBreakpoint === gridStore.breakpoints[index]?.name) {
    gridStore.switchToDefault()
  }
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

function switchToBreakpoint(index: number) {
  if (gridStore.activeBreakpoint !== null) {
    gridStore.saveCurrentToActiveBreakpoint()
  }
  gridStore.switchToBreakpoint(index)
}

function switchToDefault() {
  if (gridStore.activeBreakpoint !== null) {
    gridStore.saveCurrentToActiveBreakpoint()
  }
  gridStore.switchToDefault()
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

    <div
      v-if="gridStore.activeBreakpoint"
      class="p-2 bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-lg flex items-center gap-2"
    >
      <span class="text-[10px] text-[#00D4AA]">正在编辑: {{ gridStore.activeBreakpoint }}</span>
      <button
        class="ml-auto text-[10px] px-2 py-0.5 bg-[#2A2D3A] text-[#9CA3AF] rounded hover:bg-[#3A3D4A] hover:text-[#E0E0E8] transition-colors"
        @click="switchToDefault"
      >
        返回默认
      </button>
    </div>

    <button
      v-if="gridStore.activeBreakpoint === null && gridStore.breakpoints.length > 0"
      class="w-full h-7 bg-[#2A2D3A] text-[#9CA3AF] rounded text-[10px] hover:bg-[#3A3D4A] hover:text-[#E0E0E8] transition-colors flex items-center justify-center gap-1"
      @click="switchToDefault"
    >
      默认布局（当前）
    </button>

    <div v-if="showAdd" class="p-3 bg-[#0F1117] rounded-lg border border-[#2A2D3A] space-y-2">
      <input
        v-model="newName"
        placeholder="断点名称 (如: mobile)"
        class="w-full h-7 bg-[#1A1D27] border border-[#2A2D3A] rounded px-2 text-xs text-[#E0E0E8] placeholder-[#4A4D5A] focus:border-[#00D4AA] focus:outline-none transition-colors"
      />
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-[#6B7280]">max-width:</span>
        <input
          v-model.number="newMaxWidth"
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
      :class="{ 'border-[#00D4AA]/50': gridStore.activeBreakpoint === bp.name }"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <component :is="deviceIcons[guessDevice(bp.maxWidth)] || Monitor" :size="12" class="text-[#00D4AA]" />
          <span class="text-xs text-[#E0E0E8] font-medium">{{ bp.name }}</span>
          <span class="text-[10px] text-[#6B7280]">@media (max-width: {{ bp.maxWidth }}px)</span>
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
      <div class="flex gap-1.5">
        <button
          class="flex-1 h-6 bg-[#2A2D3A] text-[#9CA3AF] rounded text-[10px] hover:bg-[#3A3D4A] hover:text-[#E0E0E8] transition-colors flex items-center justify-center gap-1"
          :class="{ 'bg-[#00D4AA] text-[#0F1117] hover:bg-[#00E4BA]': gridStore.activeBreakpoint === bp.name }"
          @click="gridStore.activeBreakpoint === bp.name ? switchToDefault() : switchToBreakpoint(i)"
        >
          <ArrowRight :size="10" />
          {{ gridStore.activeBreakpoint === bp.name ? '编辑中' : '切换编辑' }}
        </button>
        <button
          class="h-6 px-2 bg-[#2A2D3A] text-[#9CA3AF] rounded text-[10px] hover:bg-[#3A3D4A] hover:text-[#E0E0E8] transition-colors flex items-center gap-1"
          @click="captureCurrent(i)"
        >
          <Save :size="10" />
          捕获
        </button>
      </div>
    </div>
  </div>
</template>
