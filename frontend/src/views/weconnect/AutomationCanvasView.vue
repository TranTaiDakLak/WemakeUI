<script setup lang="ts">
import { ref, computed } from 'vue'
import WeConnectLayout from '../_layouts/WeConnectLayout.vue'
import { BaseButton, BaseBadge } from '../../components/common'

interface NodeDef {
  id: string
  type: 'trigger' | 'condition' | 'action' | 'delay'
  label: string
  sub: string
  x: number
  y: number
}

interface EdgeDef {
  from: string
  to: string
  label?: string
}

const NODES = ref<NodeDef[]>([
  { id: 'n1', type: 'trigger', label: 'Tin nhắn mới', sub: 'Khi nhận tin nhắn từ khách', x: 80, y: 80 },
  { id: 'n2', type: 'condition', label: 'Kiểm tra từ khoá', sub: 'Chứa "giá" hoặc "mua"?', x: 320, y: 80 },
  { id: 'n3', type: 'action', label: 'GPT trả lời', sub: 'Gọi ChatGPT API', x: 560, y: 40 },
  { id: 'n4', type: 'action', label: 'Gửi catalogue', sub: 'Gửi file PDF sản phẩm', x: 560, y: 140 },
  { id: 'n5', type: 'delay', label: 'Chờ 10 phút', sub: 'Delay node', x: 800, y: 40 },
  { id: 'n6', type: 'action', label: 'Tạo lead CRM', sub: 'Ghi vào HubSpot', x: 800, y: 140 },
  { id: 'n7', type: 'action', label: 'Notify Slack', sub: 'Gửi alert team sales', x: 1040, y: 40 },
])

const EDGES = ref<EdgeDef[]>([
  { from: 'n1', to: 'n2' },
  { from: 'n2', to: 'n3', label: 'Có' },
  { from: 'n2', to: 'n4', label: 'Không' },
  { from: 'n3', to: 'n5' },
  { from: 'n4', to: 'n6' },
  { from: 'n5', to: 'n7' },
])

const NODE_W = 200
const NODE_H = 64

const TYPE_CFG: Record<string, { color: string; icon: string; variant: 'info' | 'warning' | 'success' | 'neutral' }> = {
  trigger: { color: 'var(--wx-brand-600)', icon: '⚡', variant: 'info' },
  condition: { color: 'var(--wx-status-warning-text)', icon: '◇', variant: 'warning' },
  action: { color: 'var(--wx-status-success-text)', icon: '▶', variant: 'success' },
  delay: { color: 'var(--wx-content-muted)', icon: '⏱', variant: 'neutral' },
}

const selectedNode = ref<string | null>(null)
const dragging = ref<string | null>(null)
const dragOffset = ref({ x: 0, y: 0 })

function getNodeCenter(id: string) {
  const n = NODES.value.find(n => n.id === id)
  if (!n) return { x: 0, y: 0 }
  return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 }
}

const svgEdges = computed(() =>
  EDGES.value.map(e => {
    const a = getNodeCenter(e.from)
    const b = getNodeCenter(e.to)
    const mx = (a.x + b.x) / 2
    const d = `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`
    return { ...e, d, lx: mx, ly: (a.y + b.y) / 2 }
  })
)

const canvasW = computed(() => Math.max(...NODES.value.map(n => n.x + NODE_W + 60), 900))
const canvasH = computed(() => Math.max(...NODES.value.map(n => n.y + NODE_H + 80), 300))

function startDrag(e: MouseEvent, id: string) {
  const node = NODES.value.find(n => n.id === id)
  if (!node) return
  dragging.value = id; selectedNode.value = id
  dragOffset.value = { x: e.offsetX - node.x, y: e.offsetY - node.y }
}

function onMouseMove(e: MouseEvent) {
  if (!dragging.value) return
  const svg = (e.currentTarget as SVGElement).getBoundingClientRect()
  const node = NODES.value.find(n => n.id === dragging.value)
  if (node) { node.x = e.clientX - svg.left - dragOffset.value.x; node.y = e.clientY - svg.top - dragOffset.value.y }
}

function stopDrag() { dragging.value = null }

const running = ref(false)
function runFlow() { running.value = true; setTimeout(() => { running.value = false }, 2000) }

const NODE_TYPES = ['trigger', 'condition', 'action', 'delay'] as const
const addType = ref<'trigger' | 'condition' | 'action' | 'delay'>('action')
const addLabel = ref('')
function addNode() {
  if (!addLabel.value.trim()) return
  const id = 'n' + (Date.now() % 10000)
  NODES.value.push({ id, type: addType.value, label: addLabel.value, sub: 'New node', x: 200, y: 200 })
  addLabel.value = ''
}
</script>

<template>
  <WeConnectLayout current="automation" page-title="Automation Canvas" page-description="Thiết kế luồng tự động hoá bằng kéo thả node">
    <template #actions>
      <BaseButton size="sm" variant="ghost" @click="runFlow">{{ running ? '⏳ Đang chạy...' : '▶ Chạy luồng' }}</BaseButton>
      <BaseButton size="sm" variant="primary">Lưu luồng</BaseButton>
    </template>

    <div class="canvas-container">
      <div class="canvas-sidebar">
        <div class="sidebar-title">Node mới</div>
        <div class="add-form">
          <select v-model="addType" class="wx-select">
            <option v-for="t in NODE_TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
          <input v-model="addLabel" class="wx-input" placeholder="Tên node..." @keyup.enter="addNode" />
          <BaseButton size="sm" variant="primary" @click="addNode">Thêm</BaseButton>
        </div>

        <div class="sidebar-title" style="margin-top: 16px;">Loại node</div>
        <div v-for="(cfg, type) in TYPE_CFG" :key="type" class="type-legend">
          <span class="type-dot" :style="{ background: cfg.color }"></span>
          <span class="type-icon">{{ cfg.icon }}</span>
          <BaseBadge :text="type" :variant="cfg.variant" size="sm" />
        </div>

        <div v-if="selectedNode" class="node-detail">
          <div class="sidebar-title" style="margin-top: 16px;">Chi tiết node</div>
          <div v-for="n in NODES.filter(nd => nd.id === selectedNode)" :key="n.id" class="node-info">
            <div class="ni-row"><span class="ni-k">ID</span><code>{{ n.id }}</code></div>
            <div class="ni-row"><span class="ni-k">Loại</span><span>{{ n.type }}</span></div>
            <div class="ni-row"><span class="ni-k">Label</span><span>{{ n.label }}</span></div>
            <div class="ni-row"><span class="ni-k">Vị trí</span><span>{{ Math.round(n.x) }}, {{ Math.round(n.y) }}</span></div>
          </div>
          <BaseButton size="sm" variant="danger" style="margin-top: 8px; width: 100%"
            @click="NODES = NODES.filter(n => n.id !== selectedNode); EDGES = EDGES.filter(e => e.from !== selectedNode && e.to !== selectedNode); selectedNode = null">
            Xoá node
          </BaseButton>
        </div>
      </div>

      <div class="canvas-area">
        <svg
          :width="canvasW" :height="canvasH"
          class="canvas-svg"
          :class="{ running }"
          @mousemove="onMouseMove"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="var(--wx-border-default)" />
            </marker>
          </defs>

          <g class="edges">
            <path v-for="(e, i) in svgEdges" :key="i"
              :d="e.d" fill="none" stroke="var(--wx-border-default)" stroke-width="2"
              marker-end="url(#arrow)" :class="{ pulse: running }" />
            <template v-for="(e, i) in svgEdges" :key="'lbl'+i">
              <text v-if="e.label" :x="e.lx" :y="e.ly - 6"
                text-anchor="middle" font-size="11" fill="var(--wx-content-muted)">{{ e.label }}</text>
            </template>
          </g>

          <g v-for="node in NODES" :key="node.id"
            :transform="`translate(${node.x},${node.y})`"
            class="node-group"
            :class="{ selected: selectedNode === node.id }"
            @mousedown="startDrag($event, node.id)"
            @click="selectedNode = node.id"
          >
            <rect :width="NODE_W" :height="NODE_H" rx="10"
              fill="var(--wx-bg-base)" stroke="var(--wx-border-default)"
              :stroke-width="selectedNode === node.id ? 2 : 1"
              :stroke-dasharray="node.type === 'condition' ? '6 3' : undefined" />
            <rect :width="4" :height="NODE_H" rx="2"
              :fill="TYPE_CFG[node.type].color" />
            <text x="20" y="24" font-size="12" font-weight="600" fill="var(--wx-content-primary)">
              {{ TYPE_CFG[node.type].icon }} {{ node.label }}
            </text>
            <text x="20" y="44" font-size="11" fill="var(--wx-content-muted)">{{ node.sub }}</text>
          </g>
        </svg>
      </div>
    </div>
  </WeConnectLayout>
</template>

<style scoped>
.canvas-container { display: flex; gap: var(--wx-space-4); align-items: flex-start; }
.canvas-sidebar { width: 200px; flex-shrink: 0; display: flex; flex-direction: column; gap: var(--wx-space-2); }
.sidebar-title { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.add-form { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.wx-select, .wx-input { padding: 6px 8px; border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-md); background: var(--wx-bg-base); color: var(--wx-content-primary); font-size: var(--wx-fs-13); width: 100%; }
.type-legend { display: flex; align-items: center; gap: var(--wx-space-2); padding: 3px 0; }
.type-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.type-icon { font-size: 12px; }
.node-detail { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.node-info { display: flex; flex-direction: column; gap: 4px; background: var(--wx-bg-sunken); border-radius: var(--wx-radius-md); padding: var(--wx-space-2); }
.ni-row { display: flex; justify-content: space-between; font-size: var(--wx-fs-12); }
.ni-k { color: var(--wx-content-muted); }
.canvas-area { flex: 1; overflow: auto; background: var(--wx-bg-sunken); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); }
.canvas-svg { display: block; cursor: default; user-select: none; }
.canvas-svg.running .pulse { animation: dash-anim 1s linear infinite; stroke-dasharray: 8 4; }
@keyframes dash-anim { to { stroke-dashoffset: -24; } }
.node-group { cursor: grab; }
.node-group:active { cursor: grabbing; }
.node-group.selected rect:first-child { stroke: var(--wx-brand-600); }
</style>
