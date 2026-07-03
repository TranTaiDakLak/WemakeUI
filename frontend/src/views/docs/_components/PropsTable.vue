<script setup lang="ts">
/**
 * PropsTable — bảng tham chiếu props / emits / slots cho trang docs.
 */
export interface PropRow {
  name: string
  type: string
  default?: string
  desc?: string
}

withDefaults(defineProps<{
  rows: PropRow[]
  /** Nhãn cột đầu — 'Prop' | 'Event' | 'Slot' | 'Token'… */
  nameLabel?: string
  /** Ẩn cột default (cho bảng emits/slots). */
  hideDefault?: boolean
}>(), {
  nameLabel: 'Prop',
  hideDefault: false,
})
</script>

<template>
  <div class="props-table">
    <table>
      <thead>
        <tr>
          <th>{{ nameLabel }}</th>
          <th>Kiểu</th>
          <th v-if="!hideDefault">Mặc định</th>
          <th>Mô tả</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.name">
          <td><code class="pt-name">{{ row.name }}</code></td>
          <td><code class="pt-type">{{ row.type }}</code></td>
          <td v-if="!hideDefault">
            <code v-if="row.default" class="pt-default">{{ row.default }}</code>
            <span v-else class="pt-dash">—</span>
          </td>
          <td class="pt-desc">{{ row.desc }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.props-table {
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  overflow: auto;
  margin: 0 0 28px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}
thead th {
  text-align: left;
  padding: 10px 14px;
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-default);
  font-weight: 600;
  font-size: 12.5px;
  color: var(--wx-text-secondary);
  white-space: nowrap;
}
tbody td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--wx-border-subtle);
  vertical-align: top;
  color: var(--wx-text-primary);
}
tbody tr:last-child td { border-bottom: none; }
code {
  font-family: var(--wx-font-mono);
  font-size: 12.5px;
  padding: 1px 6px;
  border-radius: var(--wx-radius-sm);
  white-space: nowrap;
}
.pt-name {
  background: color-mix(in srgb, var(--wx-brand-primary) 12%, transparent);
  color: var(--wx-brand-primary);
  font-weight: 600;
}
.pt-type {
  background: var(--wx-surface-sunken);
  color: var(--wx-text-secondary);
  white-space: normal;
}
.pt-default {
  background: var(--wx-surface-sunken);
  color: var(--wx-text-primary);
}
.pt-dash { color: var(--wx-text-muted); }
.pt-desc {
  color: var(--wx-text-secondary);
  line-height: 1.55;
  min-width: 180px;
}
</style>
