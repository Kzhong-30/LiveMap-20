<script setup lang="ts">
import { ref } from 'vue'
import { useGridStore } from '@/stores/gridStore'
import ToolBar from '@/components/ToolBar.vue'
import GridCanvas from '@/components/GridCanvas.vue'
import ItemEditor from '@/components/ItemEditor.vue'
import CodePanel from '@/components/CodePanel.vue'
import BreakpointEditor from '@/components/BreakpointEditor.vue'
import HistoryPanel from '@/components/HistoryPanel.vue'

const gridStore = useGridStore()

const rightTab = ref<'properties' | 'code' | 'breakpoints' | 'history'>('properties')

const tabs = [
  { key: 'properties' as const, label: '属性' },
  { key: 'code' as const, label: '代码' },
  { key: 'breakpoints' as const, label: '断点' },
  { key: 'history' as const, label: '历史' },
]
</script>

<template>
  <div class="h-screen w-screen flex bg-[#0F1117] text-[#E0E0E8] overflow-hidden">
    <ToolBar />

    <div class="flex-1 flex flex-col min-w-0 p-4">
      <GridCanvas />
    </div>

    <div class="w-[300px] flex-shrink-0 bg-[#1A1D27] border-l border-[#2A2D3A] flex flex-col h-full">
      <div class="flex border-b border-[#2A2D3A]">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="flex-1 py-2.5 text-[10px] uppercase tracking-wider transition-colors"
          :class="[
            rightTab === tab.key
              ? 'text-[#00D4AA] border-b-2 border-[#00D4AA]'
              : 'text-[#6B7280] hover:text-[#9CA3AF]',
          ]"
          @click="rightTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <ItemEditor v-if="rightTab === 'properties'" />
        <CodePanel v-else-if="rightTab === 'code'" />
        <BreakpointEditor v-else-if="rightTab === 'breakpoints'" />
        <HistoryPanel v-else-if="rightTab === 'history'" />
      </div>
    </div>
  </div>
</template>
