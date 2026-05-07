<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseButton, BaseInput, BaseSelectMenu, BaseCheckbox, BaseTextarea, BaseToggle, FormField } from '../../components/common'

const name     = ref('')
const email    = ref('')
const phone    = ref('')
const website  = ref('')
const bio      = ref('')
const country  = ref('')
const size     = ref('')
const enabled  = ref(true)
const showCode = ref(false)

const countryOpts = [
  { value: 'vn', label: 'Việt Nam' },
  { value: 'us', label: 'United States' },
  { value: 'sg', label: 'Singapore' },
  { value: 'jp', label: 'Japan' },
]
const sizeOpts = [
  { value: 'sm', label: 'Nhỏ (sm)' },
  { value: 'md', label: 'Vừa (md)' },
  { value: 'lg', label: 'Lớn (lg)' },
]
</script>

<template>
  <div class="fp">
    <AppTopbar title="WemakeUI" subtitle="forms — form controls" />
    <main class="fp__main">

      <div class="fp__hdr">
        <h1 class="fp__title">Form Controls</h1>
        <p class="fp__desc">Tất cả form controls cơ bản: input, textarea, select, toggle, checkbox. Dùng làm reference khi xây dựng form.</p>
      </div>

      <!-- Text inputs -->
      <div class="fp__card">
        <p class="fp__card-title">Text Inputs</p>
        <div class="fp__form fp-glow">
          <div class="fp__row">
            <FormField label="Họ và tên" required>
              <BaseInput v-model="name" placeholder="Nguyễn Văn A" />
            </FormField>
            <FormField label="Email" required>
              <BaseInput v-model="email" type="email" placeholder="ban@congty.vn" />
            </FormField>
          </div>
          <div class="fp__row">
            <FormField label="Số điện thoại" hint="Bao gồm mã quốc gia">
              <BaseInput v-model="phone" placeholder="+84 900 000 000" />
            </FormField>
            <FormField label="Website">
              <BaseInput v-model="website" placeholder="https://example.com" />
            </FormField>
          </div>
          <FormField label="Tiểu sử" hint="Tối đa 300 ký tự.">
            <BaseTextarea v-model="bio" :rows="3" placeholder="Mô tả ngắn về bản thân..." :maxlength="300" />
          </FormField>
        </div>
      </div>

      <!-- Select & Toggle -->
      <div class="fp__card">
        <p class="fp__card-title">Select & Toggle</p>
        <div class="fp__form fp-glow">
          <div class="fp__row">
            <FormField label="Quốc gia">
              <BaseSelectMenu v-model="country" :options="countryOpts" placeholder="Chọn quốc gia..." />
            </FormField>
            <FormField label="Cỡ giao diện">
              <BaseSelectMenu v-model="size" :options="sizeOpts" placeholder="Chọn cỡ..." />
            </FormField>
          </div>
          <div class="fp__toggle-row">
            <BaseToggle v-model="enabled" label="Bật thông báo email" />
          </div>
          <div class="fp__toggle-row">
            <BaseToggle :model-value="false" label="Chế độ hai yếu tố (2FA)" />
          </div>
        </div>
      </div>

      <!-- States -->
      <div class="fp__card">
        <p class="fp__card-title">States</p>
        <div class="fp__form">
          <div class="fp__row">
            <FormField label="Mặc định">
              <BaseInput model-value="" placeholder="Default state" />
            </FormField>
            <FormField label="Disabled">
              <BaseInput model-value="Nội dung cố định" disabled />
            </FormField>
          </div>
          <div class="fp__row">
            <FormField label="Readonly">
              <BaseInput model-value="readonly@example.com" :disabled="true" />
            </FormField>
            <FormField label="Lỗi" error="Email không hợp lệ.">
              <BaseInput model-value="wrong-email" type="email" :error="'Email không hợp lệ.'" />
            </FormField>
          </div>
          <div class="fp__row">
            <FormField label="Với gợi ý" hint="Sử dụng địa chỉ email công ty.">
              <BaseInput model-value="" placeholder="user@company.com" />
            </FormField>
            <FormField label="Không bắt buộc" :show-optional="true">
              <BaseInput model-value="" placeholder="Tùy chọn..." />
            </FormField>
          </div>
        </div>
      </div>

      <!-- Sizes -->
      <div class="fp__card">
        <p class="fp__card-title">Kích thước (sm / md / lg)</p>
        <div class="fp__form">
          <FormField label="Small (sm)">
            <BaseInput model-value="" placeholder="size='sm'" size="sm" />
          </FormField>
          <FormField label="Medium (md — mặc định)">
            <BaseInput model-value="" placeholder="size='md'" size="md" />
          </FormField>
          <FormField label="Medium (lg equiv — max size)">
            <BaseInput model-value="" placeholder="size='md' (max)" size="md" />
          </FormField>
        </div>
      </div>

      <!-- Actions -->
      <div class="fp__card">
        <div class="fp__actions">
          <BaseButton variant="ghost" size="sm">Hủy</BaseButton>
          <BaseButton size="sm">Lưu thay đổi</BaseButton>
        </div>
      </div>

      <!-- Code -->
      <div class="fp__card">
        <div class="fp__code-head">
          <p class="fp__card-title" style="margin:0">Code snippet</p>
          <button class="fp__code-toggle" @click="showCode = !showCode">{{ showCode ? '▲ Ẩn' : '▼ Hiện' }}</button>
        </div>
        <div v-if="showCode" class="fp__code">
<pre>&lt;FormField label="Email" required&gt;
  &lt;BaseInput v-model="email" type="email" /&gt;
&lt;/FormField&gt;

&lt;FormField label="Ghi chú" hint="Tối đa 300 ký tự"&gt;
  &lt;BaseTextarea v-model="note" :rows="3" :maxlength="300" /&gt;
&lt;/FormField&gt;

&lt;FormField label="Quốc gia"&gt;
  &lt;BaseSelect v-model="country" :options="opts" placeholder="Chọn..." /&gt;
&lt;/FormField&gt;

&lt;BaseToggle v-model="enabled" label="Bật thông báo" /&gt;

&lt;!-- States --&gt;
&lt;BaseInput :invalid="true" /&gt;   &lt;!-- error border --&gt;
&lt;BaseInput disabled /&gt;          &lt;!-- disabled --&gt;
&lt;BaseInput readonly /&gt;          &lt;!-- readonly --&gt;

&lt;!-- Sizes: sm | md (default) | lg --&gt;
&lt;BaseInput size="sm" /&gt;</pre>
        </div>
        <div class="fp__meta">
          <span class="fp__meta-label">Components:</span>
          <span v-for="c in ['BaseInput','BaseTextarea','BaseSelect','BaseToggle','FormField']" :key="c" class="fp__chip">{{ c }}</span>
          <span class="fp__meta-label" style="margin-left:8px">Patterns:</span>
          <span v-for="p in ['FormLayout','FieldState','SizeVariant']" :key="p" class="fp__chip">{{ p }}</span>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.fp { min-height: 100vh; background: var(--wx-surface-sunken); }
.fp__main { max-width: 900px; margin: 0 auto; padding: var(--wx-space-5) var(--wx-space-5) var(--wx-space-10); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__hdr { margin-top: var(--wx-space-2); }
.fp__title { margin: 0 0 4px; font-size: var(--wx-fs-22); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); letter-spacing: -.4px; }
.fp__desc { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }
.fp__card { background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); padding: var(--wx-space-5); display: flex; flex-direction: column; gap: var(--wx-space-3); }
.fp__card-title { margin: 0; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .6px; color: var(--wx-text-muted); }
.fp__form { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.fp__row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-3); }
@media (max-width: 600px) { .fp__row { grid-template-columns: 1fr; } }
.fp__toggle-row { padding: var(--wx-space-2) 0; border-bottom: 1px solid var(--wx-border-subtle); }
.fp__toggle-row:last-child { border-bottom: none; }
.fp__actions { display: flex; justify-content: flex-end; gap: var(--wx-space-2); }
.fp__code-head { display: flex; align-items: center; justify-content: space-between; }
.fp__code-toggle { background: none; border: none; font-family: var(--wx-font-primary); font-size: var(--wx-fs-12); color: var(--wx-brand-primary); cursor: pointer; }
.fp__code-toggle:hover { text-decoration: underline; }
.fp__code { background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); overflow: hidden; }
.fp__code pre { margin: 0; padding: var(--wx-space-4); font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.65; overflow-x: auto; }
.fp__meta { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; padding-top: var(--wx-space-2); border-top: 1px solid var(--wx-border-subtle); }
.fp__meta-label { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.fp__chip { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 10px; background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); font-family: var(--wx-font-mono); }
/* Focus glow */
.fp-glow :deep(input:focus),
.fp-glow :deep(textarea:focus),
.fp-glow :deep(select:focus) {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wx-brand-primary) 18%, transparent) !important;
  transition: box-shadow var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1));
}
</style>
