<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGridStore } from '@/stores/gridStore'
import { useExport } from '@/composables/useExport'
import { Copy, Check, Code, FileCode } from 'lucide-vue-next'
import ExportModal from './ExportModal.vue'

const gridStore = useGridStore()
const { cssCode, copyToClipboard } = useExport()

const copied = ref(false)
const showExport = ref(false)

async function handleCopy() {
  const ok = await copyToClipboard(cssCode.value)
  if (ok) {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const syntaxHighlighted = computed(() => {
  let code = escapeHtml(cssCode.value)
  code = code
    .replace(/(display|grid-template-columns|grid-template-rows|column-gap|row-gap|grid-column|grid-row|justify-self|align-self):/g, '<span class="text-[#FF6B6B]">$1</span>:')
    .replace(/(grid);/g, '<span class="text-[#00D4AA]">$1</span>;')
    .replace(/(\d+fr|\d+px)(?=[;\s])/g, '<span class="text-[#FFEAA7]">$1</span>')
    .replace(/:\s*(auto|start|center|end|stretch)(?=[;\s])/g, ': <span class="text-[#FFEAA7]">$1</span>')
    .replace(/(\/)/g, '<span class="text-[#9CA3AF]">$1</span>')
    .replace(/(\.grid-container|\.grid-item)/g, '<span class="text-[#DDA0DD]">$1</span>')
    .replace(/(&gt; :nth-child\(\d+\))/g, '<span class="text-[#DDA0DD]">$1</span>')
  return code
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-xs text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
        <Code :size="12" />
        CSS 代码
      </h3>
      <div class="flex gap-1">
        <button
          class="p-1.5 rounded hover:bg-[#2A2D3A] text-[#6B7280] hover:text-[#00D4AA] transition-colors"
          title="复制CSS"
          @click="handleCopy"
        >
          <component :is="copied ? Check : Copy" :size="13" />
        </button>
        <button
          class="p-1.5 rounded hover:bg-[#2A2D3A] text-[#6B7280] hover:text-[#00D4AA] transition-colors"
          title="导出HTML"
          @click="showExport = true"
        >
          <FileCode :size="13" />
        </button>
      </div>
    </div>

    <div class="bg-[#0A0C10] rounded-lg border border-[#2A2D3A] p-3 overflow-auto max-h-[300px]">
      <pre class="text-[11px] leading-5 font-mono whitespace-pre-wrap" v-html="syntaxHighlighted" />
    </div>

    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-[10px]">
        <span class="text-[#6B7280]">grid-template-columns</span>
        <span class="font-mono text-[#00D4AA]">{{ gridStore.gridConfig.columnWidths.join(' ') }}</span>
      </div>
      <div class="flex items-center justify-between text-[10px]">
        <span class="text-[#6B7280]">grid-template-rows</span>
        <span class="font-mono text-[#00D4AA]">{{ gridStore.gridConfig.rowHeights.join(' ') }}</span>
      </div>
      <div class="flex items-center justify-between text-[10px]">
        <span class="text-[#6B7280]">gap</span>
        <span class="font-mono text-[#00D4AA]">{{ gridStore.gridConfig.rowGap }}px {{ gridStore.gridConfig.columnGap }}px</span>
      </div>
    </div>

    <ExportModal v-if="showExport" @close="showExport = false" />
  </div>
</template>
