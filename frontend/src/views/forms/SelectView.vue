<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseSelectMenu, FormField } from '../../components/common'

const country  = ref('')
const timezone = ref('')
const role     = ref('')
const currency = ref('vnd')
const sizeDemo = ref('')
const showCode = ref(false)

const countryOpts = [
  { value: 'vn', label: '🇻🇳 Việt Nam' },
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'sg', label: '🇸🇬 Singapore' },
  { value: 'jp', label: '🇯🇵 Japan' },
  { value: 'kr', label: '🇰🇷 South Korea' },
  { value: 'au', label: '🇦🇺 Australia' },
]
const timezoneOpts = [
  { value: 'utc+7', label: '(UTC+7) Hà Nội, Bangkok, Jakarta' },
  { value: 'utc+8', label: '(UTC+8) Singapore, Bắc Kinh, Perth' },
  { value: 'utc+9', label: '(UTC+9) Tokyo, Seoul, Osaka' },
  { value: 'utc+0', label: '(UTC+0) London, Reykjavik' },
]
const roleOpts = [
  { value: 'admin',   label: 'Quản trị viên' },
  { value: 'editor',  label: 'Biên tập viên' },
  { value: 'viewer',  label: 'Chỉ xem' },
  { value: 'billing', label: 'Kế toán' },
]
const currencyOpts = [
  { value: 'vnd', label: 'VND — Việt Nam Đồng' },
  { value: 'usd', label: 'USD — US Dollar' },
  { value: 'eur', label: 'EUR — Euro' },
  { value: 'sgd', label: 'SGD — Singapore Dollar' },
]
const sizeOpts = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]
</script>

<template>
  <div class="fp">
    <AppTopbar title="WemakeUI" subtitle="forms — select" />
    <main class="fp__main">

      <div class="fp__hdr">
        <h1 class="fp__title">Select</h1>
        <p class="fp__desc">BaseSelect với nhiều kiểu dữ liệu: quốc gia, timezone, vai trò, tiền tệ. Hỗ trợ placeholder và kích thước sm/md/lg.</p>
      </div>

      <!-- Basic selects -->
      <div class="fp__card">
        <p class="fp__card-title">Basic Selects</p>
        <div class="fp__form fp-glow">
          <div class="fp__row">
            <FormField label="Quốc gia" required>
              <BaseSelectMenu v-model="country" :options="countryOpts" placeholder="Chọn quốc gia..." />
            </FormField>
            <FormField label="Múi giờ">
              <BaseSelectMenu v-model="timezone" :options="timezoneOpts" placeholder="Chọn múi giờ..." />
            </FormField>
          </div>
          <div class="fp__row">
            <FormField label="Vai trò" hint="Quyền hạn theo vai trò được áp dụng ngay lập tức.">
              <BaseSelectMenu v-model="role" :options="roleOpts" placeholder="Chọn vai trò..." />
            </FormField>
            <FormField label="Tiền tệ mặc định">
              <BaseSelectMenu v-model="currency" :options="currencyOpts" />
            </FormField>
          </div>
        </div>
      </div>

      <!-- States -->
      <div class="fp__card">
        <p class="fp__card-title">States</p>
        <div class="fp__form">
          <div class="fp__row">
            <FormField label="Disabled">
              <BaseSelectMenu :model-value="'vn'" :options="countryOpts" :disabled="true" />
            </FormField>
            <FormField label="Lỗi" error="Vui lòng chọn vai trò.">
              <BaseSelectMenu :model-value="''" :options="roleOpts" placeholder="Chưa chọn..." />
            </FormField>
          </div>
        </div>
      </div>

      <!-- Sizes -->
      <div class="fp__card">
        <p class="fp__card-title">Kích thước</p>
        <div class="fp__form">
          <FormField label="Small (sm)">
            <BaseSelectMenu v-model="sizeDemo" :options="sizeOpts" placeholder="sm" size="sm" />
          </FormField>
          <FormField label="Medium (md — mặc định)">
            <BaseSelectMenu v-model="sizeDemo" :options="sizeOpts" placeholder="md" size="md" />
          </FormField>
          <FormField label="Medium (md — max size)">
            <BaseSelectMenu v-model="sizeDemo" :options="sizeOpts" placeholder="md (max)" size="md" />
          </FormField>
        </div>
      </div>

      <!-- Code -->
      <div class="fp__card">
        <div class="fp__code-head">
          <p class="fp__card-title" style="margin:0">Code snippet</p>
          <button class="fp__code-toggle" @click="showCode = !showCode">{{ showCode ? '▲ Ẩn' : '▼ Hiện' }}</button>
        </div>
        <div v-if="showCode" class="fp__code">
<pre>&lt;!-- Khai báo options --&gt;
const roleOpts = [
  { value: 'admin',  label: 'Quản trị viên' },
  { value: 'editor', label: 'Biên tập viên' },
]

&lt;!-- Template --&gt;
&lt;FormField label="Vai trò" required&gt;
  &lt;BaseSelect
    v-model="role"
    :options="roleOpts"
    placeholder="Chọn vai trò..."
    size="md"
  /&gt;
&lt;/FormField&gt;

&lt;!-- Disabled state --&gt;
&lt;BaseSelect :disabled="true" /&gt;

&lt;!-- Size variants: sm | md | lg --&gt;
&lt;BaseSelect size="sm" /&gt;</pre>
        </div>
        <div class="fp__meta">
          <span class="fp__meta-label">Components:</span>
          <span v-for="c in ['BaseSelect','FormField']" :key="c" class="fp__chip">{{ c }}</span>
          <span class="fp__meta-label" style="margin-left:8px">Patterns:</span>
          <span v-for="p in ['SelectOptions','Placeholder','SizeVariant','DisabledState']" :key="p" class="fp__chip">{{ p }}</span>
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
.fp__card { background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); padding: var(--wx-space-5); display: flex; flex-direction: column; gap: var(--wx-space-3); }
.fp__card-title { margin: 0; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .6px; color: var(--wx-text-muted); }
.fp__form { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.fp__row  { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-3); }
@media (max-width: 600px) { .fp__row { grid-template-columns: 1fr; } }
.fp__code-head { display: flex; align-items: center; justify-content: space-between; }
.fp__code-toggle { background: none; border: none; font-family: var(--wx-font-primary); font-size: var(--wx-fs-12); color: var(--wx-brand-primary); cursor: pointer; }
.fp__code-toggle:hover { text-decoration: underline; }
.fp__code { background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); overflow: hidden; }
.fp__code pre { margin: 0; padding: var(--wx-space-4); font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.65; overflow-x: auto; }
.fp__meta { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; padding-top: var(--wx-space-2); border-top: 1px solid var(--wx-border-subtle); }
.fp__meta-label { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.fp__chip { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 10px; background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); font-family: var(--wx-font-mono); }
.fp-glow :deep(select:focus) {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wx-brand-primary) 18%, transparent) !important;
  transition: box-shadow var(--wx-d-fast, 150ms);
}
</style>
