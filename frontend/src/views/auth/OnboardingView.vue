<script setup lang="ts">
/** auth/onboarding — wizard 5 bước: chào → workspace → mời → theme → hoàn tất */
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import { BaseButton, BaseInput, BaseTag, BaseProgress, FormField, BaseSelectMenu } from '../../components/common'
import { useTheme } from '../../ui-system/composables/useTheme'
import { Monitor, Sun, Moon, Check } from 'lucide-vue-next'

const step = ref<0 | 1 | 2 | 3 | 4>(0)
const ws = ref({ name: 'Công ty của tôi', subdomain: 'mycompany', size: '11-50' })
const invites = ref<string[]>([''])
const themeChoice = ref<'system' | 'light' | 'dark'>('system')
const { setTheme } = useTheme()

const themeOptions = [
  { id: 'system', label: 'Theo hệ thống', icon: Monitor, desc: 'Bám theo OS' },
  { id: 'light',  label: 'Sáng',          icon: Sun,     desc: 'Trắng + xanh' },
  { id: 'dark',   label: 'Tối',           icon: Moon,    desc: 'Xám + xanh' },
] as const

const totalSteps = 5
const progress = computed(() => ((step.value + 1) / totalSteps) * 100)

const sizeOpts = [
  { value: '1-10',   label: '1–10 người' },
  { value: '11-50',  label: '11–50 người' },
  { value: '51-200', label: '51–200 người' },
  { value: '200+',   label: 'Trên 200 người' },
]

function addInvite() { invites.value.push('') }
function removeInvite(i: number) { invites.value.splice(i, 1) }

function next() {
  if (step.value === 3) setTheme(themeChoice.value)
  if (step.value < 4) step.value = (step.value + 1) as typeof step.value
}
function back() {
  if (step.value > 0) step.value = (step.value - 1) as typeof step.value
}
</script>

<template>
  <AuthLayout :no-aside="false" align="top">
    <header class="auth-head">
      <div class="onb-progress">
        <span>Bước {{ step + 1 }}/{{ totalSteps }}</span>
        <BaseProgress :value="progress" size="sm" variant="primary" />
      </div>
    </header>

    <!-- 0: chào -->
    <div v-if="step === 0" class="card">
      <lord-icon
        src="https://cdn.lordicon.com/tyvtvbcy.json"
        trigger="loop"
        colors="primary:#8b5cf6,secondary:#ec4899"
        style="width: 80px; height: 80px;"
      />
      <h1>Chào mừng đến với WemakeUI!</h1>
      <p>Chúng ta sẽ thiết lập workspace của bạn trong 4 bước nhanh.</p>
      <ul class="hint-list">
        <li><Check :size="14" class="check-icon" /> Tạo workspace cho team</li>
        <li><Check :size="14" class="check-icon" /> Mời thành viên</li>
        <li><Check :size="14" class="check-icon" /> Chọn giao diện</li>
        <li><Check :size="14" class="check-icon" /> Hoàn tất</li>
      </ul>
      <BaseButton block @click="next">Bắt đầu →</BaseButton>
    </div>

    <!-- 1: workspace -->
    <div v-else-if="step === 1" class="card">
      <h1>Tạo workspace</h1>
      <p>Tên này sẽ hiển thị cho mọi thành viên trong team.</p>
      <FormField label="Tên workspace" required>
        <BaseInput v-model="ws.name" placeholder="Tên công ty hoặc team" />
      </FormField>
      <FormField label="Subdomain" hint="dùng cho URL workspace của bạn">
        <BaseInput v-model="ws.subdomain" />
      </FormField>
      <FormField label="Quy mô team">
        <BaseSelectMenu v-model="ws.size" :options="sizeOpts" />
      </FormField>
      <div class="auth-row">
        <BaseButton variant="ghost" @click="back">← Quay lại</BaseButton>
        <BaseButton @click="next">Tiếp tục →</BaseButton>
      </div>
    </div>

    <!-- 2: mời -->
    <div v-else-if="step === 2" class="card">
      <h1>Mời thành viên</h1>
      <p>Mời ngay hoặc bỏ qua — bạn có thể mời sau ở Cài đặt.</p>
      <FormField v-for="(_, i) in invites" :key="i" :label="i === 0 ? 'Email thành viên' : ''" show-optional>
        <div class="invite-row">
          <BaseInput v-model="invites[i]" placeholder="ban@congty.vn" type="email" />
          <BaseButton v-if="invites.length > 1" variant="ghost" @click="removeInvite(i)">Xoá</BaseButton>
        </div>
      </FormField>
      <button class="add-link" type="button" @click="addInvite">+ Thêm email khác</button>
      <div class="auth-row">
        <BaseButton variant="ghost" @click="back">← Quay lại</BaseButton>
        <BaseButton variant="ghost" @click="next">Bỏ qua</BaseButton>
        <BaseButton @click="next">Mời {{ invites.filter(Boolean).length || 0 }} người →</BaseButton>
      </div>
    </div>

    <!-- 3: theme -->
    <div v-else-if="step === 3" class="card">
      <h1>Chọn giao diện</h1>
      <p>Bạn có thể đổi sau ở phần Cài đặt.</p>
      <div class="theme-grid">
        <button
          v-for="t in themeOptions"
          :key="t.id"
          class="theme-card"
          :class="{ 'theme-card--active': themeChoice === t.id }"
          @click="themeChoice = t.id as 'system' | 'light' | 'dark'"
        >
          <component :is="t.icon" :size="28" class="theme-icon" />
          <span class="theme-label">{{ t.label }}</span>
          <span class="theme-desc">{{ t.desc }}</span>
        </button>
      </div>
      <div class="auth-row">
        <BaseButton variant="ghost" @click="back">← Quay lại</BaseButton>
        <BaseButton @click="next">Tiếp tục →</BaseButton>
      </div>
    </div>

    <!-- 4: finish -->
    <div v-else class="card finish">
      <lord-icon
        src="https://cdn.lordicon.com/lupuorrc.json"
        trigger="loop"
        colors="primary:#8b5cf6,secondary:#ec4899"
        style="width: 80px; height: 80px;"
      />
      <h1>Hoàn tất!</h1>
      <p>Workspace <strong>{{ ws.name }}</strong> đã sẵn sàng.</p>
      <BaseTag size="md" variant="success" text="đã thiết lập xong" />
      <RouterLink to="/dashboard/overview" class="cta">
        <BaseButton block>Vào dashboard →</BaseButton>
      </RouterLink>
    </div>
  </AuthLayout>
</template>

<style scoped>
.auth-head { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.onb-progress {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
}
.card h1 { margin: 0; font-size: var(--wx-fs-24); font-weight: var(--wx-fw-semibold); letter-spacing: var(--wx-tracking-tight); }
.card p { margin: 0; color: var(--wx-content-muted); font-size: var(--wx-fs-14); }

.hint-list {
  list-style: none;
  margin: 0;
  padding: var(--wx-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
  font-size: var(--wx-fs-13);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
}
.hint-list li { display: flex; align-items: center; gap: var(--wx-space-2); }
.check-icon { color: var(--wx-brand-primary); flex-shrink: 0; }

.auth-row { display: flex; gap: var(--wx-space-2); justify-content: flex-end; flex-wrap: wrap; }
.invite-row { display: flex; gap: var(--wx-space-2); align-items: center; }
.invite-row > :first-child { flex: 1; }

.add-link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--wx-content-link);
  cursor: pointer;
  text-align: left;
  font-size: var(--wx-fs-13);
}
.add-link:hover { text-decoration: underline; }

.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--wx-space-2);
}
.theme-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  padding: var(--wx-space-4) var(--wx-space-2);
  background: var(--wx-surface-base);
  border: 2px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--wx-d-fast) var(--wx-ease-standard);
}
.theme-card:hover { border-color: var(--wx-border-focus); }
.theme-card--active {
  border-color: var(--wx-brand-primary);
  background: rgba(37, 99, 235, 0.06);
}
.theme-icon { color: var(--wx-content-secondary); }
.theme-card--active .theme-icon { color: var(--wx-brand-primary); }
.theme-label { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); }
.theme-desc { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }

.finish {
  align-items: center;
  text-align: center;
  padding: var(--wx-space-5);
  background: var(--wx-success-bg);
  border-radius: var(--wx-radius-xl);
}
.cta { width: 100%; text-decoration: none; }
</style>
