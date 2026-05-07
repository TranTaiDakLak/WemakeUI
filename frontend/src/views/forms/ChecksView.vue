<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseCheckbox, BaseRadio, BaseToggle, FormField } from '../../components/common'

const perms   = ref({ read: true, write: false, delete: false, admin: false })
const plan    = ref('pro')
const notify  = ref({ email: true, sms: false, push: true, weekly: false })
const showCode = ref(false)

const planOpts = [
  { value: 'free',       label: 'Free — Miễn phí' },
  { value: 'pro',        label: 'Pro — 99.000₫/tháng' },
  { value: 'enterprise', label: 'Enterprise — Liên hệ' },
]
const dayOpts = [
  { value: 'mon', label: 'T2' },
  { value: 'tue', label: 'T3' },
  { value: 'wed', label: 'T4' },
  { value: 'thu', label: 'T5' },
  { value: 'fri', label: 'T6' },
]
const day = ref('mon')
</script>

<template>
  <div class="fp">
    <AppTopbar title="WemakeUI" subtitle="forms — checkboxes & radio" />
    <main class="fp__main">

      <div class="fp__hdr">
        <h1 class="fp__title">Checks, Radio & Toggle</h1>
        <p class="fp__desc">Checkbox list, radio group, toggle switches — các patterns phổ biến trong form cài đặt và phân quyền.</p>
      </div>

      <!-- Checkbox list -->
      <div class="fp__card">
        <p class="fp__card-title">Checkbox List — Phân quyền</p>
        <div class="fp__check-list">
          <div class="fp__check-item">
            <BaseCheckbox v-model="perms.read" label="Đọc dữ liệu" />
            <span class="fp__check-desc">Xem tất cả bản ghi trong module.</span>
          </div>
          <div class="fp__check-item">
            <BaseCheckbox v-model="perms.write" label="Ghi / Chỉnh sửa" />
            <span class="fp__check-desc">Tạo mới và cập nhật bản ghi.</span>
          </div>
          <div class="fp__check-item">
            <BaseCheckbox v-model="perms.delete" label="Xóa dữ liệu" />
            <span class="fp__check-desc">Xóa bản ghi vĩnh viễn.</span>
          </div>
          <div class="fp__check-item">
            <BaseCheckbox v-model="perms.admin" label="Quản trị viên" />
            <span class="fp__check-desc">Toàn quyền bao gồm cài đặt hệ thống.</span>
          </div>
        </div>
      </div>

      <!-- Radio group vertical -->
      <div class="fp__card">
        <p class="fp__card-title">Radio Group — Gói dịch vụ</p>
        <FormField>
          <BaseRadio v-model="plan" name="plan" :options="planOpts" direction="vertical" />
        </FormField>
        <p class="fp__hint">Chọn: <strong>{{ planOpts.find(o => o.value === plan)?.label }}</strong></p>
      </div>

      <!-- Radio group horizontal -->
      <div class="fp__card">
        <p class="fp__card-title">Radio Group — Horizontal (ngày trong tuần)</p>
        <FormField>
          <BaseRadio v-model="day" name="day" :options="dayOpts" direction="horizontal" />
        </FormField>
      </div>

      <!-- Toggle list -->
      <div class="fp__card">
        <p class="fp__card-title">Toggle Switches — Thông báo</p>
        <div class="fp__toggle-list">
          <div class="fp__toggle-item">
            <div>
              <div class="fp__toggle-label">Thông báo qua Email</div>
              <div class="fp__toggle-sub">Nhận tóm tắt hoạt động hàng ngày qua email.</div>
            </div>
            <BaseToggle v-model="notify.email" />
          </div>
          <div class="fp__toggle-item">
            <div>
              <div class="fp__toggle-label">Thông báo qua SMS</div>
              <div class="fp__toggle-sub">Chỉ nhận khi có giao dịch quan trọng.</div>
            </div>
            <BaseToggle v-model="notify.sms" />
          </div>
          <div class="fp__toggle-item">
            <div>
              <div class="fp__toggle-label">Push notification</div>
              <div class="fp__toggle-sub">Thông báo trên trình duyệt / thiết bị di động.</div>
            </div>
            <BaseToggle v-model="notify.push" />
          </div>
          <div class="fp__toggle-item">
            <div>
              <div class="fp__toggle-label">Báo cáo tuần</div>
              <div class="fp__toggle-sub">Tổng hợp mỗi thứ Hai lúc 8:00 sáng.</div>
            </div>
            <BaseToggle v-model="notify.weekly" />
          </div>
        </div>
      </div>

      <!-- Code -->
      <div class="fp__card">
        <div class="fp__code-head">
          <p class="fp__card-title" style="margin:0">Code snippet</p>
          <button class="fp__code-toggle" @click="showCode = !showCode">{{ showCode ? '▲ Ẩn' : '▼ Hiện' }}</button>
        </div>
        <div v-if="showCode" class="fp__code">
<pre>&lt;!-- Checkbox list --&gt;
&lt;BaseCheckbox v-model="perms.read" label="Đọc dữ liệu" /&gt;

&lt;!-- Radio group (vertical / horizontal) --&gt;
&lt;BaseRadio
  v-model="plan"
  name="plan"
  :options="[
    { value: 'free', label: 'Free' },
    { value: 'pro',  label: 'Pro' },
  ]"
  direction="vertical"
/&gt;

&lt;!-- Toggle with description --&gt;
&lt;div class="toggle-item"&gt;
  &lt;div&gt;
    &lt;div class="toggle-label"&gt;Thông báo Email&lt;/div&gt;
    &lt;div class="toggle-sub"&gt;Nhận tóm tắt hàng ngày.&lt;/div&gt;
  &lt;/div&gt;
  &lt;BaseToggle v-model="notify.email" /&gt;
&lt;/div&gt;</pre>
        </div>
        <div class="fp__meta">
          <span class="fp__meta-label">Components:</span>
          <span v-for="c in ['BaseCheckbox','BaseRadio','BaseToggle','FormField']" :key="c" class="fp__chip">{{ c }}</span>
          <span class="fp__meta-label" style="margin-left:8px">Patterns:</span>
          <span v-for="p in ['CheckList','RadioGroup','ToggleList']" :key="p" class="fp__chip">{{ p }}</span>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.fp { min-height: 100vh; background: var(--wx-surface-sunken); }
.fp__main { max-width: 900px; margin: 0 auto; padding: var(--wx-space-5) var(--wx-space-5) var(--wx-space-10); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__hdr { margin-top: var(--wx-space-2); }
.fp__title { margin: 0 0 4px; font-size: var(--wx-fs-22); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.fp__desc  { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }
.fp__hint  { margin: 0; font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }
.fp__card { background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); padding: var(--wx-space-5); display: flex; flex-direction: column; gap: var(--wx-space-3); }
.fp__card-title { margin: 0; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .6px; color: var(--wx-text-muted); }

.fp__check-list { display: flex; flex-direction: column; gap: 2px; }
.fp__check-item { display: flex; flex-direction: column; gap: 2px; padding: var(--wx-space-2) 0; border-bottom: 1px solid var(--wx-border-subtle); }
.fp__check-item:last-child { border-bottom: none; }
.fp__check-desc { font-size: var(--wx-fs-12); color: var(--wx-text-muted); padding-left: 24px; }

.fp__toggle-list { display: flex; flex-direction: column; }
.fp__toggle-item { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-4); padding: var(--wx-space-3) 0; border-bottom: 1px solid var(--wx-border-subtle); }
.fp__toggle-item:last-child { border-bottom: none; }
.fp__toggle-label { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); }
.fp__toggle-sub   { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

.fp__code-head { display: flex; align-items: center; justify-content: space-between; }
.fp__code-toggle { background: none; border: none; font-family: var(--wx-font-primary); font-size: var(--wx-fs-12); color: var(--wx-brand-primary); cursor: pointer; }
.fp__code-toggle:hover { text-decoration: underline; }
.fp__code { background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); overflow: hidden; }
.fp__code pre { margin: 0; padding: var(--wx-space-4); font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.65; overflow-x: auto; }
.fp__meta { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; padding-top: var(--wx-space-2); border-top: 1px solid var(--wx-border-subtle); }
.fp__meta-label { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.fp__chip { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 10px; background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); font-family: var(--wx-font-mono); }
</style>
