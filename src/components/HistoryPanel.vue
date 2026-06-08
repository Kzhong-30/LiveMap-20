<script setup lang="ts">
import { useHistoryStore } from '@/stores/historyStore'
import { useGridStore } from '@/stores/gridStore'
import { Save, Clock, Trash2, RotateCcw, X } from 'lucide-vue-next'
import { ref } from 'vue'

const historyStore = useHistoryStore()
const gridStore = useGridStore()

const saveName = ref('')
const showSaveInput = ref(false)

function saveLayout() {
  const name = saveName.value.trim() || `布局 ${historyStore.histories.length + 1}`
  const snap = gridStore.getSnapshot()
  historyStore.save(name, snap.gridConfig, snap.items, snap.breakpoints)
  saveName.value = ''
  showSaveInput.value = false
}

function restoreLayout(id: string) {
  const entry = historyStore.getEntry(id)
  if (entry) {
    gridStore.restoreSnapshot({
      gridConfig: entry.gridConfig,
      items: entry.items,
      breakpoints: entry.breakpoints,
    })
  }
}

function removeHistory(id: string) {
  historyStore.remove(id)
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-xs text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
        <Clock :size="12" />
        布局历史
      </h3>
      <button
        class="p-1 rounded hover:bg-[#2A2D3A] text-[#6B7280] hover:text-[#00D4AA] transition-colors"
        @click="showSaveInput = !showSaveInput"
      >
        <Save :size="14" />
      </button>
    </div>

    <div v-if="showSaveInput" class="p-3 bg-[#0F1117] rounded-lg border border-[#2A2D3A] space-y-2">
      <input
        v-model="saveName"
        placeholder="布局名称"
        class="w-full h-7 bg-[#1A1D27] border border-[#2A2D3A] rounded px-2 text-xs text-[#E0E0E8] placeholder-[#4A4D5A] focus:border-[#00D4AA] focus:outline-none transition-colors"
        @keyup.enter="saveLayout"
      />
      <button
        class="w-full h-7 bg-[#00D4AA] text-[#0F1117] rounded text-xs font-semibold hover:bg-[#00E4BA] transition-colors"
        @click="saveLayout"
      >
        保存当前布局
      </button>
    </div>

    <div v-if="historyStore.histories.length === 0" class="text-[10px] text-[#4A4D5A] text-center py-3">
      暂无保存的布局
    </div>

    <div class="space-y-1.5 max-h-[200px] overflow-y-auto">
      <div
        v-for="h in historyStore.histories"
        :key="h.id"
        class="flex items-center gap-2 p-2 rounded-lg bg-[#0F1117] border border-[#2A2D3A] hover:border-[#00D4AA]/30 transition-colors group"
      >
        <div class="flex-1 min-w-0">
          <div class="text-xs text-[#E0E0E8] truncate">{{ h.name }}</div>
          <div class="text-[10px] text-[#6B7280]">{{ formatTime(h.timestamp) }} · {{ h.gridConfig.columns }}×{{ h.gridConfig.rows }}</div>
        </div>
        <button
          class="p-1 rounded hover:bg-[#2A2D3A] text-[#6B7280] hover:text-[#00D4AA] transition-colors opacity-0 group-hover:opacity-100"
          title="恢复"
          @click="restoreLayout(h.id)"
        >
          <RotateCcw :size="12" />
        </button>
        <button
          class="p-1 rounded hover:bg-[#2A2D3A] text-[#6B7280] hover:text-[#FF6B6B] transition-colors opacity-0 group-hover:opacity-100"
          title="删除"
          @click="removeHistory(h.id)"
        >
          <Trash2 :size="12" />
        </button>
      </div>
    </div>
  </div>
</template>
