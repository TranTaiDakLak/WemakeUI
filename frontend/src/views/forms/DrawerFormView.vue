<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseButton, BaseInput, BaseSelectMenu, BaseToggle, BaseTextarea, FormField, BaseDrawer } from '../../components/common'

const showDrawer = ref(false)
const showCode   = ref(false)
const saving     = ref(false)

const displayName  = ref('Nguyễn Văn A')
const bio          = ref('')
const timezone     = ref('utc+7')
const lang         = ref('vi')
const emailNotify  = ref(true)
const publicProfile = ref(false)

const tzOpts = [
  { value: 'utc+7', label: '(UTC+7) Hà Nội' },
  { value: 'utc+8', label: '(UTC+8) Singapore' },
  { value: 'utc+9', label: '(UTC+9) Tokyo' },
  { value: 'utc+0', label: '(UTC+0) London' },
]
const langOpts = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
]

function saveSettings() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    showDrawer.value = false
  }, 700)
}

interface SettingRow { label: string; value: string }
function settingRows(): SettingRow[] {
  return [
    { label: 'Tên hiển thị', value: displayName.value },
    { label: 'Múi giờ', value: tzOpts.find(o => o.value === timezone.value)?.label ?? timezone.value },
    { label: 'Ngôn ngữ', value: langOpts.find(o => o.value === lang.value)?.label ?? lang.value },
    { label: 'Thông báo email', value: emailNotify.value ? 'Bật' : 'Tắt' },
    { label: 'Hồ sơ công khai', value: publicProfile.value ? 'Công khai' : 'Riêng tư' },
  ]
}
</script>

<template>
  <div class="fp">
    <AppTopbar title="WemakeUI" subtitle="forms — drawer form" />
    <main class="fp__main">

      <div class="fp__hdr">
        <h1 class="fp__title">Drawer Form</h1>
        <p class="fp__desc">
          Settings panel mở <code>BaseDrawer</code> từ bên phải. Phù hợp cho cài đặt chi tiết không muốn che khuất toàn bộ nội dung phía sau.
        </p>
      </div>

      <!-- Settings preview card -->
      <div class="fp__card">
        <div class="fp__card-head">
          <p class="fp__card-title" style="margin:0">Cài đặt tài khoản</p>
          <BaseButton size="sm" @click="showDrawer = true">Chỉnh sửa →</BaseButton>
        </div>
        <div class="df-summary">
          <div v-for="row in settingRows()" :key="row.label" class="df-summary-row">
            <span class="df-summary-k">{{ row.label }}</span>
            <span class="df-summary-v">{{ row.value }}</span>
          </div>
        </div>
      </div>

      <!-- Drawer -->
      <BaseDrawer :show="showDrawer" title="Cài đặt tài khoản" placement="right" size="md"
        @close="showDrawer = false" @update:show="showDrawer = $event">
        <div class="df-drawer-body">
          <div class="df-section">
            <p class="df-section-title">Thông tin cá nhân</p>
            <div class="df-form">
              <FormField label="Tên hiển thị" required>
                <BaseInput v-model="displayName" />
              </FormField>
              <FormField label="Giới thiệu bản thân" hint="Tối đa 200 ký tự.">
                <BaseTextarea v-model="bio" :rows="3" :maxlength="200" placeholder="Mô tả ngắn..." />
              </FormField>
            </div>
          </div>

          <div class="df-section">
            <p class="df-section-title">Tùy chọn khu vực</p>
            <div class="df-form">
              <FormField label="Múi giờ">
                <BaseSelectMenu v-model="timezone" :options="tzOpts" />
              </FormField>
              <FormField label="Ngôn ngữ">
                <BaseSelectMenu v-model="lang" :options="langOpts" />
              </FormField>
            </div>
          </div>

          <div class="df-section">
            <p class="df-section-title">Thông báo & Quyền riêng tư</p>
            <div class="df-toggle-list">
              <div class="df-toggle-item">
                <div>
                  <div class="df-toggle-label">Thông báo email</div>
                  <div class="df-toggle-sub">Nhận cập nhật và thông báo quan trọng.</div>
                </div>
                <BaseToggle v-model="emailNotify" />
              </div>
              <div class="df-toggle-item">
                <div>
                  <div class="df-toggle-label">Hồ sơ công khai</div>
                  <div class="df-toggle-sub">Người dùng khác có thể tìm thấy bạn.</div>
                </div>
                <BaseToggle v-model="publicProfile" />
              </div>
            </div>
          </div>
        </div>

        <!-- Drawer footer -->
        <template #footer>
          <div class="df-footer">
            <BaseButton variant="ghost" size="sm" @click="showDrawer = false">Hủy</BaseButton>
            <BaseButton size="sm" :loading="saving" @click="saveSettings">Lưu cài đặt</BaseButton>
          </div>
        </template>
      </BaseDrawer>

      <!-- How it works -->
      <div class="fp__card fp__card--info">
        <p class="fp__card-title">Cách hoạt động</p>
        <ul class="fp__list">
          <li><code>BaseDrawer</code>: <code>:show</code> + <code>@close</code> + <code>@update:show</code> để đóng bằng backdrop/ESC</li>
          <li><code>placement="right"</code> — slide in từ bên phải, không che nội dung trái</li>
          <li>Drawer có <code>#footer</code> slot — đặt actions cố định ở dưới cùng</li>
          <li>Summary card cập nhật tự động khi đóng drawer vì dùng reactive refs</li>
        </ul>
      </div>

      <!-- Code -->
      <div class="fp__card">
        <div class="fp__code-head">
          <p class="fp__card-title" style="margin:0">Code snippet</p>
          <button class="fp__code-toggle" @click="showCode = !showCode">{{ showCode ? '▲ Ẩn' : '▼ Hiện' }}</button>
        </div>
        <div v-if="showCode" class="fp__code">
<pre>&lt;!-- Trigger --&gt;
&lt;BaseButton @click="showDrawer = true"&gt;Chỉnh sửa&lt;/BaseButton&gt;

&lt;!-- Drawer --&gt;
&lt;BaseDrawer
  :show="showDrawer"
  title="Cài đặt"
  placement="right"
  size="md"
  @close="showDrawer = false"
  @update:show="showDrawer = $event"
&gt;
  &lt;!-- Body content --&gt;
  &lt;FormField label="Tên hiển thị"&gt;
    &lt;BaseInput v-model="displayName" /&gt;
  &lt;/FormField&gt;

  &lt;!-- Footer slot --&gt;
  &lt;template #footer&gt;
    &lt;BaseButton @click="saveSettings" :loading="saving"&gt;Lưu&lt;/BaseButton&gt;
  &lt;/template&gt;
&lt;/BaseDrawer&gt;</pre>
        </div>
        <div class="fp__meta">
          <span class="fp__meta-label">Components:</span>
          <span v-for="c in ['BaseDrawer','BaseInput','BaseSelect','BaseToggle','BaseTextarea','FormField']" :key="c" class="fp__chip">{{ c }}</span>
          <span class="fp__meta-label" style="margin-left:8px">Patterns:</span>
          <span v-for="p in ['DrawerForm','SettingsPanel','FooterSlot','SlideinPanel']" :key="p" class="fp__chip">{{ p }}</span>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.fp { min-height: 100vh; background: var(--wx-surface-sunken); }
.fp__main { max-width: 860px; margin: 0 auto; padding: var(--wx-space-5) var(--wx-space-5) var(--wx-space-10); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__hdr { margin-top: var(--wx-space-2); }
.fp__title { margin: 0 0 4px; font-size: var(--wx-fs-22); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.fp__desc  { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); line-height: 1.6; }
.fp__card { background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); padding: var(--wx-space-5); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__card--info { background: color-mix(in srgb, var(--wx-brand-primary) 5%, var(--wx-surface-elevated)); border-color: color-mix(in srgb, var(--wx-brand-primary) 20%, transparent); }
.fp__card-title { margin: 0; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .6px; color: var(--wx-text-muted); }
.fp__card-head { display: flex; align-items: center; justify-content: space-between; }
.fp__list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.fp__list li { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); line-height: 1.5; }
.fp__code-head { display: flex; align-items: center; justify-content: space-between; }
.fp__code-toggle { background: none; border: none; font-family: var(--wx-font-primary); font-size: var(--wx-fs-12); color: var(--wx-brand-primary); cursor: pointer; }
.fp__code-toggle:hover { text-decoration: underline; }
.fp__code { background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); overflow: hidden; }
.fp__code pre { margin: 0; padding: var(--wx-space-4); font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.65; overflow-x: auto; }
.fp__meta { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; padding-top: var(--wx-space-2); border-top: 1px solid var(--wx-border-subtle); }
.fp__meta-label { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.fp__chip { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 10px; background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); font-family: var(--wx-font-mono); }

/* Summary card */
.df-summary { display: flex; flex-direction: column; }
.df-summary-row { display: flex; gap: var(--wx-space-3); padding: 10px 0; border-bottom: 1px solid var(--wx-border-subtle); }
.df-summary-row:last-child { border-bottom: none; }
.df-summary-k { min-width: 140px; font-size: var(--wx-fs-13); color: var(--wx-text-muted); }
.df-summary-v { font-size: var(--wx-fs-13); color: var(--wx-text-primary); font-weight: var(--wx-fw-medium); }

/* Drawer body */
.df-drawer-body { display: flex; flex-direction: column; gap: var(--wx-space-5); padding: var(--wx-space-4); }
.df-section { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.df-section-title { margin: 0 0 var(--wx-space-2); font-size: var(--wx-fs-12); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .5px; color: var(--wx-text-muted); }
.df-form { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.df-toggle-list { display: flex; flex-direction: column; }
.df-toggle-item { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-3); padding: var(--wx-space-2) 0; border-bottom: 1px solid var(--wx-border-subtle); }
.df-toggle-item:last-child { border-bottom: none; }
.df-toggle-label { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); }
.df-toggle-sub   { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

/* Footer */
.df-footer { display: flex; justify-content: flex-end; gap: var(--wx-space-2); padding: var(--wx-space-3) var(--wx-space-4); border-top: 1px solid var(--wx-border-subtle); }
</style>
