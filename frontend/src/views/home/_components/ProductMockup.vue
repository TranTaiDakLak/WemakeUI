<script setup lang="ts">
/**
 * ProductMockup — mockup giao diện ứng dụng dựng bằng HTML/CSS (không phải ảnh chụp).
 * Lấy cảm hứng từ màn hình bảng tài khoản của MindAds: thanh cửa sổ, capsule tab,
 * ô tìm kiếm, nút thêm, bảng có pill trạng thái và hai panel tóm tắt.
 *
 * TOÀN BỘ DỮ LIỆU LÀ GIẢ ĐỊNH (landing-content.ts) — không tài khoản / số dư thật.
 * Cố ý không dùng BaseDataGrid để trang marketing không kéo thêm logic bảng thật.
 */
import { MOCK_TABLE, STATUS_LABEL } from './landing-content'
</script>

<template>
  <div class="pm" aria-hidden="true">
    <div class="pm__bar">
      <span class="pm__dots"><span /><span /><span /></span>
      <span class="pm__title">{{ MOCK_TABLE.title }}</span>
    </div>

    <div class="pm__toolbar">
      <span class="pm__tabs">
        <span
          v-for="(tab, i) in MOCK_TABLE.tabs"
          :key="tab"
          class="pm__tab"
          :class="{ 'pm__tab--on': i === 0 }"
        >{{ tab }}</span>
      </span>
      <span class="pm__search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        {{ MOCK_TABLE.search }}
      </span>
      <span class="pm__add">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        {{ MOCK_TABLE.addButton }}
      </span>
    </div>

    <div class="pm__body">
      <table class="pm__table">
        <thead>
          <tr><th v-for="c in MOCK_TABLE.columns" :key="c">{{ c }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="r in MOCK_TABLE.rows" :key="r.id">
            <td class="pm__num">{{ r.stt }}</td>
            <td>
              <div class="pm__name">{{ r.name }}</div>
              <div class="pm__id">{{ r.id }}</div>
            </td>
            <td><span class="pm__kind">{{ r.kind }}</span></td>
            <td><span class="pm__pill" :class="`pm__pill--${r.status}`">{{ STATUS_LABEL[r.status] }}</span></td>
            <td class="pm__money">{{ r.balance }}</td>
            <td><span class="pm__more">•••</span></td>
          </tr>
        </tbody>
      </table>

      <div class="pm__side">
        <div class="pm__panel">
          <div class="pm__panel-title">Hành động nhanh</div>
          <span
            v-for="(a, i) in MOCK_TABLE.quickActions"
            :key="a"
            class="pm__item"
            :class="{ 'pm__item--on': i === 0 }"
          >{{ a }}</span>
        </div>
        <div class="pm__panel">
          <div class="pm__panel-title">Tổng ngân sách</div>
          <div v-for="b in MOCK_TABLE.budget" :key="b.label" class="pm__row"><span>{{ b.label }}</span><b>{{ b.value }}</b></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pm {
  position: relative;
  border-radius: var(--wx-radius-2xl);
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  box-shadow: var(--wx-shadow-2xl);
  overflow: hidden;
  text-align: left;
  font-size: var(--wx-fs-12);
  color: var(--wx-text-primary);
  pointer-events: none;
  user-select: none;
}

.pm__bar {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  height: 38px;
  padding: 0 var(--wx-space-4);
  background: var(--wx-shell-topbar-bg);
  color: var(--wx-text-on-brand);
}
.pm__dots { display: inline-flex; gap: 6px; }
.pm__dots span { width: 10px; height: 10px; border-radius: 50%; background: rgba(255, 255, 255, 0.45); }
.pm__title { font-size: 11.5px; font-weight: var(--wx-fw-semibold); letter-spacing: 0.01em; }

.pm__toolbar {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3) var(--wx-space-4);
  border-bottom: 1px solid var(--wx-border-subtle);
  background: var(--wx-shell-frame-bg);
}
.pm__tabs {
  display: inline-flex;
  padding: 3px;
  gap: 2px;
  border-radius: 10px;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
}
.pm__tab { padding: 5px 12px; border-radius: 7px; font-weight: var(--wx-fw-bold); color: var(--wx-text-muted); white-space: nowrap; }
.pm__tab--on { background: var(--wx-shell-rail-active-bg); color: var(--wx-shell-rail-active-fg); box-shadow: var(--wx-shadow-sm); }
.pm__search {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  min-width: 190px;
  padding: 7px 12px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  color: var(--wx-text-muted);
}
.pm__add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-shell-grad-solid);
  color: var(--wx-text-on-brand);
  font-weight: var(--wx-fw-bold);
  white-space: nowrap;
  box-shadow: var(--wx-shadow-brand);
}

.pm__body { display: grid; grid-template-columns: minmax(0, 1fr) 210px; }
.pm__table { width: 100%; border-collapse: collapse; }
.pm__table th {
  padding: 9px 12px;
  text-align: left;
  font-size: 10.5px;
  font-weight: var(--wx-fw-bold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--wx-text-muted);
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-default);
}
.pm__table td { padding: 10px 12px; border-bottom: 1px solid var(--wx-border-subtle); vertical-align: middle; }
.pm__table tr:last-child td { border-bottom: 0; }
.pm__num { color: var(--wx-text-muted); font-variant-numeric: tabular-nums; width: 40px; }
.pm__name { font-weight: var(--wx-fw-semibold); }
.pm__id { margin-top: 1px; font-family: var(--wx-font-mono); font-size: 10.5px; color: var(--wx-text-muted); }
.pm__kind { padding: 2px 8px; border-radius: var(--wx-radius-full); background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-default); font-weight: var(--wx-fw-semibold); color: var(--wx-text-secondary); }
.pm__money { font-variant-numeric: tabular-nums; font-weight: var(--wx-fw-semibold); text-align: right; }
.pm__more { color: var(--wx-text-muted); letter-spacing: 0.1em; }

.pm__pill { display: inline-flex; align-items: center; gap: 5px; padding: 2px 9px; border-radius: var(--wx-radius-full); font-weight: var(--wx-fw-bold); white-space: nowrap; }
.pm__pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.pm__pill--live   { background: var(--wx-success-bg); color: var(--wx-success-text); }
.pm__pill--review { background: var(--wx-warning-bg); color: var(--wx-warning-text); }
.pm__pill--paused { background: var(--wx-neutral-bg);  color: var(--wx-neutral-text); }
.pm__pill--error  { background: var(--wx-danger-bg);   color: var(--wx-danger-text); }

.pm__side {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3);
  border-left: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-sunken);
}
.pm__panel { padding: 10px; border-radius: var(--wx-radius-lg); background: var(--wx-surface-base); border: 1px solid var(--wx-border-default); box-shadow: var(--wx-shadow-sm); }
.pm__panel-title { margin-bottom: 8px; font-size: 10.5px; font-weight: var(--wx-fw-bold); letter-spacing: 0.05em; text-transform: uppercase; color: var(--wx-text-muted); }
.pm__item { display: block; padding: 6px 8px; border-radius: 7px; font-weight: var(--wx-fw-semibold); color: var(--wx-text-secondary); }
.pm__item--on { background: var(--wx-shell-rail-active-bg); color: var(--wx-shell-rail-active-fg); }
.pm__row { display: flex; justify-content: space-between; gap: 8px; padding: 3px 0; color: var(--wx-text-secondary); }
.pm__row b { color: var(--wx-text-primary); font-variant-numeric: tabular-nums; }

@media (max-width: 900px) {
  .pm__body { grid-template-columns: 1fr; }
  .pm__side { display: none; }
  .pm__search { display: none; }
  .pm__add { margin-left: auto; }
}
@media (max-width: 560px) {
  .pm__tabs .pm__tab:nth-child(n + 3) { display: none; }
  .pm__table th:nth-child(3), .pm__table td:nth-child(3),
  .pm__table th:nth-child(5), .pm__table td:nth-child(5) { display: none; }
}
</style>
