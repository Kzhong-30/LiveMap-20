<script setup lang="ts">
import { useGridStore } from '@/stores/gridStore'
import { presetLayouts } from '@/presets'

const gridStore = useGridStore()

function applyPreset(preset: typeof presetLayouts[0]) {
  gridStore.loadPreset(preset.gridConfig, preset.items)
}
</script>

<template>
  <div class="space-y-2">
    <button
      v-for="preset in presetLayouts"
      :key="preset.name"
      class="w-full px-3 py-2.5 rounded-lg text-left text-xs transition-all duration-200 border"
      :class="[
        'bg-[#0F1117] border-[#2A2D3A] text-[#9CA3AF] hover:border-[#00D4AA]/50 hover:text-[#E0E0E8] hover:bg-[#0F1117]/80',
      ]"
      @click="applyPreset(preset)"
    >
      {{ preset.label }}
    </button>
  </div>
</template>
