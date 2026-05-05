<script setup lang="ts">
import { ref } from 'vue'

export interface KanbanCard {
  id: string
  title: string
  description?: string
  tags?: string[]
  assignee?: string
  priority?: 'low' | 'medium' | 'high'
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
  color?: string
  limit?: number
}

const props = defineProps<{
  modelValue: KanbanColumn[]
}>()

const emit = defineEmits<{
  'update:modelValue': [cols: KanbanColumn[]]
  'card-click': [card: KanbanCard, column: KanbanColumn]
  'card-move': [cardId: string, fromCol: string, toCol: string]
}>()

const dragCardId = ref<string | null>(null)
const dragFromCol = ref<string | null>(null)
const dragOverCol = ref<string | null>(null)

function onDragStart(card: KanbanCard, col: KanbanColumn, e: DragEvent) {
  dragCardId.value = card.id
  dragFromCol.value = col.id
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', card.id)
  }
}

function onDragOver(col: KanbanColumn, e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dragOverCol.value = col.id
}

function onDragLeave(col: KanbanColumn) {
  if (dragOverCol.value === col.id) dragOverCol.value = null
}

function onDrop(targetCol: KanbanColumn, e: DragEvent) {
  e.preventDefault()
  const cardId = dragCardId.value
  const fromColId = dragFromCol.value
  dragOverCol.value = null
  dragCardId.value = null
  dragFromCol.value = null

  if (!cardId || !fromColId || fromColId === targetCol.id) return

  const cols = props.modelValue.map((c) => ({ ...c, cards: [...c.cards] }))
  const from = cols.find((c) => c.id === fromColId)
  const to = cols.find((c) => c.id === targetCol.id)
  if (!from || !to) return

  const idx = from.cards.findIndex((c) => c.id === cardId)
  if (idx === -1) return
  const [moved] = from.cards.splice(idx, 1)
  to.cards.push(moved)

  emit('update:modelValue', cols)
  emit('card-move', cardId, fromColId, targetCol.id)
}

function onDragEnd() {
  dragOverCol.value = null
  dragCardId.value = null
  dragFromCol.value = null
}
</script>

<template>
  <div class="kanban">
    <div
      v-for="col in modelValue"
      :key="col.id"
      class="kanban-col"
      :class="{ 'kanban-col--drop': dragOverCol === col.id }"
      @dragover="onDragOver(col, $event)"
      @dragleave="onDragLeave(col)"
      @drop="onDrop(col, $event)"
    >
      <div class="kanban-col__header" :style="col.color ? { borderTopColor: col.color } : {}">
        <span class="kanban-col__title">{{ col.title }}</span>
        <span class="kanban-col__count">
          {{ col.cards.length }}<span v-if="col.limit">/{{ col.limit }}</span>
        </span>
      </div>
      <div class="kanban-col__body">
        <div
          v-for="card in col.cards"
          :key="card.id"
          class="kanban-card"
          :class="{ 'kanban-card--dragging': dragCardId === card.id }"
          draggable="true"
          @dragstart="onDragStart(card, col, $event)"
          @dragend="onDragEnd"
          @click="$emit('card-click', card, col)"
        >
          <div v-if="card.priority" class="kanban-card__priority" :class="`kanban-card__priority--${card.priority}`">
            {{ card.priority }}
          </div>
          <h4 class="kanban-card__title">{{ card.title }}</h4>
          <p v-if="card.description" class="kanban-card__desc">{{ card.description }}</p>
          <div v-if="card.tags?.length" class="kanban-card__tags">
            <span v-for="t in card.tags" :key="t" class="kanban-tag">{{ t }}</span>
          </div>
          <div v-if="card.assignee" class="kanban-card__assignee">
            <span class="kanban-avatar">{{ card.assignee.slice(0, 1).toUpperCase() }}</span>
            <span class="kanban-card__assignee-name">{{ card.assignee }}</span>
          </div>
        </div>
        <div v-if="!col.cards.length" class="kanban-col__empty">Chưa có thẻ</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  overflow-x: auto;
  min-height: 400px;
}

.kanban-col {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
  transition: background var(--wx-duration-fast), border-color var(--wx-duration-fast);
}

.kanban-col--drop {
  background: var(--wx-info-bg);
  border-color: var(--wx-brand-primary);
}

.kanban-col__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--wx-surface-base);
  border-bottom: 1px solid var(--wx-border-default);
  border-top: 3px solid var(--wx-brand-primary);
}

.kanban-col__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--wx-text-primary);
}

.kanban-col__count {
  font-size: 11px;
  color: var(--wx-text-muted);
  font-family: var(--wx-font-mono);
  background: var(--wx-surface-sunken);
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
}

.kanban-col__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  overflow-y: auto;
}

.kanban-col__empty {
  text-align: center;
  font-size: 12px;
  color: var(--wx-text-muted);
  padding: 20px 0;
  font-style: italic;
}

.kanban-card {
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  padding: 10px 12px;
  cursor: grab;
  transition: all var(--wx-duration-fast);
  box-shadow: var(--wx-shadow-sm);
}

.kanban-card:hover {
  box-shadow: var(--wx-shadow-md);
  border-color: var(--wx-brand-primary);
}

.kanban-card:active {
  cursor: grabbing;
}

.kanban-card--dragging {
  opacity: 0.4;
}

.kanban-card__priority {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 1px 6px;
  border-radius: var(--wx-radius-sm);
  margin-bottom: 6px;
}

.kanban-card__priority--low { background: var(--wx-neutral-bg); color: var(--wx-neutral-text); }
.kanban-card__priority--medium { background: var(--wx-warning-bg); color: var(--wx-warning-text); }
.kanban-card__priority--high { background: var(--wx-danger-bg); color: var(--wx-danger-text); }

.kanban-card__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--wx-text-primary);
  margin: 0 0 4px;
  line-height: 1.4;
}

.kanban-card__desc {
  font-size: 12px;
  color: var(--wx-text-secondary);
  margin: 0 0 8px;
  line-height: 1.4;
}

.kanban-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.kanban-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  background: var(--wx-info-bg);
  color: var(--wx-info-text);
  border-radius: var(--wx-radius-sm);
}

.kanban-card__assignee {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}

.kanban-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-gradient-button);
  color: var(--wx-text-inverse);
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.kanban-card__assignee-name {
  font-size: 11px;
  color: var(--wx-text-muted);
}
</style>
