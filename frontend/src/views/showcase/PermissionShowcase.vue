<script setup lang="ts">
/**
 * Phase 5 — permission / RBAC / capability showcase.
 *
 * Hiển thị: useCan, CanShow, PermissionGate, UpgradeTooltip, v-can, v-flag, useFlag.
 * Cho phép switch role realtime để xem hidden vs disabled vs upgrade.
 */
import { computed, onMounted, ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PageHeader from '../../components/layout/PageHeader.vue'
import { CanShow, PermissionGate, UpgradeTooltip } from '../../components/permission'
import { useCan, type Role } from '../../composables/useCan'
import { setFlag, useFlagValue } from '../../composables/useFlag'
import { vCan } from '../../directives/v-can'
import { vFlag } from '../../directives/v-flag'

const { can, roles, setRoles } = useCan()
const { isOn } = useFlagValue()

const roleOptions: Role[] = ['owner', 'admin', 'member', 'viewer', 'guest']
const currentRole = ref<Role>('member')

function pickRole(r: Role) {
  currentRole.value = r
  setRoles([r])
}

/* khởi tạo */
onMounted(() => {
  setRoles([currentRole.value])
  setFlag('beta-canvas', false)
  setFlag('pro-export', false)
  setFlag('checkout-flow', 'variant-a')
})

const flags = ref({
  beta: false,
  pro: false,
  checkoutVariant: 'variant-a' as 'variant-a' | 'variant-b',
})

function toggleBeta() {
  flags.value.beta = !flags.value.beta
  setFlag('beta-canvas', flags.value.beta)
}
function togglePro() {
  flags.value.pro = !flags.value.pro
  setFlag('pro-export', flags.value.pro)
}
function flipVariant() {
  flags.value.checkoutVariant = flags.value.checkoutVariant === 'variant-a' ? 'variant-b' : 'variant-a'
  setFlag('checkout-flow', flags.value.checkoutVariant)
}

const checks = computed(() => [
  { perm: 'invoice.read',     hint: 'mọi role >= viewer có' },
  { perm: 'invoice.create',   hint: 'member trở lên' },
  { perm: 'team.invite',      hint: 'admin / owner' },
  { perm: 'billing.manage',   hint: 'admin / owner' },
  { perm: 'settings.edit',    hint: 'admin / owner' },
])
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="phase 5 · permission + flag" />
    <main class="main">
      <PageHeader
        title="permission (RBAC) + capability (flag)"
        description="hidden khi thiếu permission, disabled+upgrade khi thiếu capability. switch role để xem realtime."
      />

      <!-- Role switcher -->
      <section class="card">
        <h3 class="card__title">role hiện tại: <code>{{ roles[0] }}</code></h3>
        <p class="card__hint">đổi role để thấy mọi block bên dưới ẩn / hiện / disable theo permission map.</p>
        <div class="role-row">
          <button
            v-for="r in roleOptions"
            :key="r"
            type="button"
            class="role-btn"
            :data-active="currentRole === r ? 'true' : 'false'"
            @click="pickRole(r)"
          >{{ r }}</button>
        </div>
      </section>

      <!-- Flag switcher -->
      <section class="card">
        <h3 class="card__title">feature flag</h3>
        <div class="flag-row">
          <label class="flag-toggle">
            <input type="checkbox" :checked="flags.beta" @change="toggleBeta" />
            <span>beta-canvas</span>
            <span class="flag-state">{{ flags.beta ? 'on' : 'off' }}</span>
          </label>
          <label class="flag-toggle">
            <input type="checkbox" :checked="flags.pro" @change="togglePro" />
            <span>pro-export</span>
            <span class="flag-state">{{ flags.pro ? 'on' : 'off' }}</span>
          </label>
          <button type="button" class="flag-btn" @click="flipVariant">
            checkout-flow variant: <code>{{ flags.checkoutVariant }}</code>
          </button>
        </div>
      </section>

      <!-- useCan check table -->
      <section class="card">
        <h3 class="card__title">useCan() — kết quả check theo role hiện tại</h3>
        <table class="check-table">
          <thead>
            <tr><th>permission</th><th>can?</th><th>hint</th></tr>
          </thead>
          <tbody>
            <tr v-for="c in checks" :key="c.perm">
              <td><code>{{ c.perm }}</code></td>
              <td>
                <span class="badge" :data-allow="can(c.perm) ? 'true' : 'false'">
                  {{ can(c.perm) ? '✓ allow' : '✕ deny' }}
                </span>
              </td>
              <td class="hint">{{ c.hint }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- CanShow -->
      <section class="card">
        <h3 class="card__title">&lt;CanShow&gt; — hidden khi thiếu</h3>
        <div class="row">
          <CanShow do="team.invite">
            <button class="primary-btn">mời thành viên</button>
            <template #fallback>
              <span class="ghost-text">(role hiện tại không thấy nút "mời thành viên")</span>
            </template>
          </CanShow>
          <CanShow do="billing.manage">
            <button class="primary-btn">quản lý billing</button>
            <template #fallback>
              <span class="ghost-text">(role hiện tại không thấy nút "billing")</span>
            </template>
          </CanShow>
        </div>
      </section>

      <!-- v-can directive -->
      <section class="card">
        <h3 class="card__title">v-can directive — hidden / disable</h3>
        <div class="row">
          <button class="primary-btn" v-can="'team.invite'">mời (v-can)</button>
          <button class="primary-btn" v-can.disable="'team.invite'">mời (v-can.disable)</button>
          <button class="primary-btn" v-can:any="['settings.edit', 'invoice.create']">edit-settings hoặc invoice (any)</button>
          <button class="primary-btn" v-can:all="['team.invite', 'billing.manage']">mời + billing (all)</button>
        </div>
      </section>

      <!-- v-flag directive -->
      <section class="card">
        <h3 class="card__title">v-flag directive — capability gate</h3>
        <div class="row">
          <button class="primary-btn" v-flag="'beta-canvas'">vào canvas beta</button>
          <button class="primary-btn" v-flag.disable="'pro-export'">xuất CSV (pro)</button>
          <span v-flag:variant="'checkout-flow'" class="variant-pill">
            checkout flow đang dùng:
            <code class="variant-code">{{ flags.checkoutVariant }}</code>
          </span>
        </div>
        <p class="hint">↑ "vào canvas beta" ẩn khi flag off; "xuất CSV" disable khi off; "checkout flow" set <code>data-flag-variant</code> attribute.</p>
      </section>

      <!-- PermissionGate combined -->
      <section class="card">
        <h3 class="card__title">&lt;PermissionGate&gt; — kết hợp RBAC + capability</h3>
        <div class="row">
          <PermissionGate do="invoice.create" flag="pro-export" upgrade-label="cần gói pro để xuất CSV">
            <button class="primary-btn">xuất hoá đơn CSV</button>
            <template #fallback>
              <span class="ghost-text">(chưa có quyền tạo hoá đơn)</span>
            </template>
          </PermissionGate>

          <PermissionGate do="settings.edit" mode="fallback">
            <button class="primary-btn">đổi tên tổ chức</button>
            <template #fallback>
              <span class="ghost-text">↑ chỉ admin/owner mới đổi được</span>
            </template>
          </PermissionGate>
        </div>
      </section>

      <!-- UpgradeTooltip -->
      <section class="card">
        <h3 class="card__title">&lt;UpgradeTooltip&gt; — tooltip "nâng cấp pro"</h3>
        <div class="row">
          <UpgradeTooltip
            :locked="!isOn('pro-export')"
            plan="pro"
            description="xuất file Excel chỉ khả dụng cho gói pro"
          >
            <button class="primary-btn">xuất Excel</button>
          </UpgradeTooltip>

          <UpgradeTooltip
            :locked="!isOn('beta-canvas')"
            plan="beta"
            description="trình thiết kế canvas đang trong giai đoạn beta"
            placement="right"
            cta-label="bật beta"
          >
            <button class="primary-btn">mở canvas designer</button>
          </UpgradeTooltip>
        </div>
        <p class="hint">↑ hover/focus để thấy tooltip. Tắt flag tương ứng để khoá lại.</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--wx-surface-sunken);
  color: var(--wx-text-primary);
  font-family: var(--wx-font-primary);
}
.main {
  max-width: 980px;
  margin: 0 auto;
  padding: var(--wx-space-5) var(--wx-space-4) var(--wx-space-9);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
}

.card {
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-4) var(--wx-space-5);
  box-shadow: var(--wx-shadow-sm);
}
.card__title {
  margin: 0 0 var(--wx-space-2);
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}
.card__hint {
  margin: 0 0 var(--wx-space-3);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
}

code {
  font-family: var(--wx-font-mono);
  font-size: 0.9em;
  background: var(--wx-surface-sunken);
  padding: 1px 6px;
  border-radius: var(--wx-radius-sm);
  color: var(--wx-text-secondary);
}

.role-row, .flag-row, .row {
  display: flex;
  gap: var(--wx-space-2);
  flex-wrap: wrap;
  align-items: center;
}

.role-btn {
  font-family: inherit;
  font-size: var(--wx-fs-13);
  padding: 6px 14px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-base);
  color: var(--wx-text-secondary);
  border: 1px solid var(--wx-border-default);
  cursor: pointer;
  text-transform: lowercase;
  transition: background var(--wx-d-micro) var(--wx-ease-standard);
}
.role-btn:hover { background: var(--wx-hover-bg); }
.role-btn[data-active='true'] {
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
  border-color: var(--wx-brand-primary);
}
.role-btn:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}

.flag-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-1);
  padding: 6px 12px;
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-default);
  cursor: pointer;
  font-size: var(--wx-fs-13);
  user-select: none;
}
.flag-toggle input { margin: 0; }
.flag-state {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  margin-left: var(--wx-space-1);
}

.flag-btn {
  font-family: inherit;
  font-size: var(--wx-fs-13);
  padding: 6px 12px;
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  cursor: pointer;
  transition: background var(--wx-d-micro) var(--wx-ease-standard);
}
.flag-btn:hover { background: var(--wx-hover-bg); }

.check-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--wx-fs-13);
}
.check-table th,
.check-table td {
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid var(--wx-border-subtle);
}
.check-table th {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-muted);
}
.check-table .hint {
  color: var(--wx-text-muted);
  font-size: var(--wx-fs-12);
}

.badge {
  display: inline-flex;
  align-items: center;
  font-size: var(--wx-fs-12);
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
  font-family: var(--wx-font-mono);
}
.badge[data-allow='true']  { background: var(--wx-success-bg); color: var(--wx-success-text); }
.badge[data-allow='false'] { background: var(--wx-danger-bg);  color: var(--wx-danger-text); }

.primary-btn {
  font-family: inherit;
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  padding: 8px 14px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
  border: none;
  cursor: pointer;
  transition:
    background var(--wx-d-micro) var(--wx-ease-standard),
    transform var(--wx-d-micro) var(--wx-ease-standard);
}
.primary-btn:hover { transform: translateY(-1px); filter: brightness(0.95); }
.primary-btn:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}

.ghost-text {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  font-style: italic;
}

.variant-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-1);
  font-size: var(--wx-fs-13);
  padding: 6px 12px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-info-bg);
  color: var(--wx-info-text);
  border: 1px solid var(--wx-info-border);
}
.variant-pill[data-flag-variant='variant-b'] {
  background: var(--wx-success-bg);
  color: var(--wx-success-text);
  border-color: var(--wx-success-border);
}
.variant-code {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
}

.hint {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  margin: var(--wx-space-2) 0 0;
}
</style>
