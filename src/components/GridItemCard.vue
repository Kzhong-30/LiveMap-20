<script setup lang="ts">
import type { GridItem } from '@/types'
import { X, GripVertical } from 'lucide-vue-next'

const props = defineProps<{
  item: GridItem
  isSelected: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  delete: [id: string]
}>()

function onClick() {
  emit('select', props.item.id)
}

function onDelete(e: Event) {
  e.stopPropagation()
  emit('delete', props.item.id)
}

function onDragStart(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', props.item.id)
    e.dataTransfer.effectAllowed = 'move'
  }
}
</script>

<template>
  <div
    class="group relative rounded-lg cursor-pointer transition-all duration-200 select-none overflow-hidden min-h-[48px]"
    :class="[
      isSelected
        ? 'ring-2 ring-[#00D4AA] shadow-[0_0_12px_rgba(0,212,170,0.3)] scale-[1.01]'
        : 'hover:ring-1 hover:ring-[#00D4AA]/40',
    ]"
    :style="{
      gridColumn: `${item.columnStart} / ${item.columnEnd}`,
      gridRow: `${item.rowStart} / ${item.rowEnd}`,
      justifyContent: item.justifySelf,
      alignSelf: item.alignSelf,
      backgroundColor: item.backgroundColor + '22',
      border: `1px solid ${item.backgroundColor}44`,
    }"
    draggable="true"
    @click="onClick"
    @dragstart="onDragStart"
  >
    <div
      class="flex items-center gap-2 px-3 py-2 h-full"
      :style="{ color: item.backgroundColor }"
    >
      <GripVertical :size="14" class="opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
      <span class="text-xs font-semibold truncate">{{ item.label }}</span>
      <span class="text-[10px] opacity-60 ml-auto flex-shrink-0">
        {{ item.columnEnd - item.columnStart }}×{{ item.rowEnd - item.rowStart }}
      </span>
    </div>

    <div
      class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <button
        class="w-5 h-5 flex items-center justify-center rounded bg-[#0F1117]/80 text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-colors"
        @click="onDelete"
      >
        <X :size="12" />
      </button>
    </div>

    <div
      v-if="isSelected"
      class="absolute inset-0 rounded-lg pointer-events-none border-2 border-[#00D4AA] animate-pulse"
    />
  </div>
</template>
