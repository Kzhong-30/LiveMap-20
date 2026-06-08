<script setup lang="ts">
import { useExport } from '@/composables/useExport'
import { X, Copy, Check } from 'lucide-vue-next'
import { ref } from 'vue'

const emit = defineEmits<{
  close: []
}>()

const { fullHTML, copyToClipboard } = useExport()
const copied = ref(false)
const activeTab = ref<'html' | 'css'>('html')

const { cssCode } = useExport()

async function handleCopy(text: string) {
  const ok = await copyToClipboard(text)
  if (ok) {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="emit('close')">
    <div class="w-[680px] max-h-[80vh] bg-[#1A1D27] rounded-xl border border-[#2A2D3A] shadow-2xl flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-[#2A2D3A]">
        <h3 class="text-sm font-semibold text-[#E0E0E8]">导出代码</h3>
        <button
          class="p-1 rounded hover:bg-[#2A2D3A] text-[#6B7280] hover:text-[#E0E0E8] transition-colors"
          @click="emit('close')"
        >
          <X :size="16" />
        </button>
      </div>

      <div class="flex border-b border-[#2A2D3A]">
        <button
          class="px-4 py-2 text-xs transition-colors"
          :class="[
            activeTab === 'html'
              ? 'text-[#00D4AA] border-b-2 border-[#00D4AA]'
              : 'text-[#6B7280] hover:text-[#E0E0E8]',
          ]"
          @click="activeTab = 'html'"
        >
          完整 HTML
        </button>
        <button
          class="px-4 py-2 text-xs transition-colors"
          :class="[
            activeTab === 'css'
              ? 'text-[#00D4AA] border-b-2 border-[#00D4AA]'
              : 'text-[#6B7280] hover:text-[#E0E0E8]',
          ]"
          @click="activeTab = 'css'"
        >
          CSS Only
        </button>
      </div>

      <div class="flex-1 overflow-auto p-4">
        <pre class="text-[11px] leading-5 font-mono text-[#9CA3AF] whitespace-pre-wrap bg-[#0A0C10] rounded-lg p-4 border border-[#2A2D3A]">{{ activeTab === 'html' ? fullHTML : cssCode }}</pre>
      </div>

      <div class="flex items-center justify-end gap-2 p-4 border-t border-[#2A2D3A]">
        <button
          class="px-4 py-2 bg-[#2A2D3A] text-[#9CA3AF] rounded-lg text-xs hover:bg-[#3A3D4A] transition-colors"
          @click="emit('close')"
        >
          关闭
        </button>
        <button
          class="px-4 py-2 bg-[#00D4AA] text-[#0F1117] rounded-lg text-xs font-semibold hover:bg-[#00E4BA] transition-colors flex items-center gap-1.5"
          @click="handleCopy(activeTab === 'html' ? fullHTML : cssCode)"
        >
          <component :is="copied ? Check : Copy" :size="13" />
          {{ copied ? '已复制' : '复制代码' }}
        </button>
      </div>
    </div>
  </div>
</template>
