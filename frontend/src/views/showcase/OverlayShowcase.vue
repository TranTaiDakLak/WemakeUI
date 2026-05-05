<script setup lang="ts">
/**
 * Phase 2 — Overlay showcase
 *  Modal · Drawer · Toast · Tooltip · Dropdown · Popover · ContextMenu
 */
import { ref, reactive } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PageHeader from '../../components/layout/PageHeader.vue'
import {
  BaseButton, BaseInput, BaseModal, BaseDrawer, BaseTooltip,
  BaseDropdown, BasePopover, ContextMenu, BaseTag, BaseBadge,
} from '../../components/common'
import { useToast } from '../../composables/useToast'
import type { ContextMenuItem } from '../../types'

const { showToast } = useToast()

/* ── modal ── */
const modalShow = ref(false)
const modalSize = ref<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md')

/* ── drawer ── */
const drawerShow = ref(false)
const drawerPlacement = ref<'right' | 'left' | 'top' | 'bottom'>('right')

/* ── context menu ── */
const ctxShow = ref(false)
const ctxX = ref(0)
const ctxY = ref(0)
const ctxItems: ContextMenuItem[] = [
  { id: 'open',   label: 'mở',                 action: () => showToast('info', 'đã mở') },
  { id: 'edit',   label: 'chỉnh sửa',          action: () => showToast('info', 'sửa') },
  { id: 'copy',   label: 'sao chép',           action: () => showToast('success', 'đã sao chép') },
  { id: 'sep1',   label: '',  separator: true },
  { id: 'share',  label: 'chia sẻ', children: [
    { id: 'link',  label: 'sao chép liên kết', action: () => showToast('success', 'đã sao chép link') },
    { id: 'email', label: 'gửi qua email',     action: () => showToast('info', 'mở email') },
  ]},
  { id: 'sep2',   label: '',  separator: true },
  { id: 'delete', label: 'xoá',  danger: true,  action: () => showToast('error', 'đã xoá') },
]
function openCtx(e: MouseEvent) {
  e.preventDefault()
  ctxX.value = e.clientX
  ctxY.value = e.clientY
  ctxShow.value = true
}

const popForm = reactive({ name: '', tag: '' })
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="phase 2 — overlay" />
    <main class="main">
      <PageHeader
        title="phase 2 — overlay"
        description="modal · drawer · toast · tooltip · dropdown · popover · context menu. focus trap + esc đóng tự test bằng phím."
      />

      <!-- ── 1. Modal ─── -->
      <section class="card">
        <h2 class="h">1. modal — 5 size, focus trap, esc</h2>
        <div class="row">
          <BaseButton @click="modalSize = 'sm';   modalShow = true">sm</BaseButton>
          <BaseButton @click="modalSize = 'md';   modalShow = true">md (default)</BaseButton>
          <BaseButton @click="modalSize = 'lg';   modalShow = true">lg</BaseButton>
          <BaseButton @click="modalSize = 'xl';   modalShow = true">xl</BaseButton>
          <BaseButton @click="modalSize = 'full'; modalShow = true">full</BaseButton>
        </div>
        <BaseModal
          v-model:show="modalShow"
          :title="`modal size = ${modalSize}`"
          :size="modalSize"
          show-save
          save-label="đồng ý"
          close-label="huỷ"
        >
          <p class="muted">
            đây là body của modal. bấm ESC hoặc click backdrop để đóng. tab phím
            để di chuyển focus trong modal — không ra ngoài được (focus trap).
          </p>
          <BaseInput placeholder="thử focus tại đây" />
        </BaseModal>
      </section>

      <!-- ── 2. Drawer ─── -->
      <section class="card">
        <h2 class="h">2. drawer — 4 placement</h2>
        <div class="row">
          <BaseButton @click="drawerPlacement = 'right';  drawerShow = true">right (default)</BaseButton>
          <BaseButton @click="drawerPlacement = 'left';   drawerShow = true">left</BaseButton>
          <BaseButton @click="drawerPlacement = 'top';    drawerShow = true">top</BaseButton>
          <BaseButton @click="drawerPlacement = 'bottom'; drawerShow = true">bottom</BaseButton>
        </div>
        <BaseDrawer
          v-model:show="drawerShow"
          :placement="drawerPlacement"
          :title="`drawer ${drawerPlacement}`"
          size="md"
        >
          <p class="muted">
            drawer slide từ cạnh {{ drawerPlacement }} với easing decelerate
            (250ms). đóng bằng nút × hoặc ESC hoặc click backdrop.
          </p>
          <div class="stack">
            <BaseInput placeholder="trường nhập 1" />
            <BaseInput placeholder="trường nhập 2" />
          </div>
          <template #footer>
            <BaseButton variant="ghost" @click="drawerShow = false">huỷ</BaseButton>
            <BaseButton variant="primary" @click="drawerShow = false">lưu</BaseButton>
          </template>
        </BaseDrawer>
      </section>

      <!-- ── 3. Toast ─── -->
      <section class="card">
        <h2 class="h">3. toast — queue 5, auto-dismiss 3s</h2>
        <div class="row">
          <BaseButton variant="success" @click="showToast('success', 'đã lưu thành công')">success</BaseButton>
          <BaseButton variant="danger"  @click="showToast('error',   'không lưu được')">error</BaseButton>
          <BaseButton                   @click="showToast('warning', 'sắp hết hạn dùng thử')">warning</BaseButton>
          <BaseButton variant="ghost"   @click="showToast('info',    'có cập nhật mới')">info</BaseButton>
          <BaseButton variant="secondary" @click="
            showToast('info','toast 1');
            showToast('success','toast 2');
            showToast('warning','toast 3');
            showToast('error','toast 4');
            showToast('info','toast 5')
          ">stack 5</BaseButton>
        </div>
      </section>

      <!-- ── 4. Tooltip ─── -->
      <section class="card">
        <h2 class="h">4. tooltip — 4 placement, delay 300ms</h2>
        <div class="row">
          <BaseTooltip content="hiện ở trên" placement="top">
            <BaseButton variant="ghost">top</BaseButton>
          </BaseTooltip>
          <BaseTooltip content="hiện bên phải" placement="right">
            <BaseButton variant="ghost">right</BaseButton>
          </BaseTooltip>
          <BaseTooltip content="hiện ở dưới" placement="bottom">
            <BaseButton variant="ghost">bottom</BaseButton>
          </BaseTooltip>
          <BaseTooltip content="hiện bên trái" placement="left">
            <BaseButton variant="ghost">left</BaseButton>
          </BaseTooltip>
        </div>
      </section>

      <!-- ── 5. Dropdown ─── -->
      <section class="card">
        <h2 class="h">5. dropdown — menu list</h2>
        <div class="row">
          <BaseDropdown placement="bottom-start">
            <template #trigger>
              <BaseButton variant="secondary">tuỳ chọn ▾</BaseButton>
            </template>
            <button class="menu-item">đổi tên</button>
            <button class="menu-item">nhân bản</button>
            <button class="menu-item">xuất file</button>
            <div class="menu-sep" />
            <button class="menu-item menu-item--danger">xoá</button>
          </BaseDropdown>

          <BaseDropdown placement="bottom-end">
            <template #trigger>
              <BaseButton variant="ghost">menu phải ▾</BaseButton>
            </template>
            <button class="menu-item">mục 1</button>
            <button class="menu-item">mục 2</button>
            <button class="menu-item">mục 3</button>
          </BaseDropdown>
        </div>
      </section>

      <!-- ── 6. Popover ─── -->
      <section class="card">
        <h2 class="h">6. popover — rich content</h2>
        <p class="muted">khác dropdown: chứa form / link / list bất kỳ qua slot.</p>
        <div class="row">
          <BasePopover placement="bottom" width="300px">
            <template #trigger>
              <BaseButton variant="primary">+ thêm tag</BaseButton>
            </template>
            <template #default="{ close }">
              <div class="pop-form">
                <label class="pop-label">tên tag</label>
                <BaseInput v-model="popForm.name" placeholder="ví dụ: ưu tiên cao" size="sm" />
                <label class="pop-label">màu</label>
                <div class="row" style="gap:6px">
                  <BaseTag label="đỏ"   variant="danger"  size="sm" />
                  <BaseTag label="vàng" variant="warning" size="sm" />
                  <BaseTag label="xanh" variant="success" size="sm" />
                  <BaseTag label="lam"  variant="info"    size="sm" />
                </div>
                <div class="pop-actions">
                  <BaseButton variant="ghost" size="sm" @click="close">huỷ</BaseButton>
                  <BaseButton variant="primary" size="sm" @click="close">tạo</BaseButton>
                </div>
              </div>
            </template>
          </BasePopover>

          <BasePopover placement="right" width="240px">
            <template #trigger>
              <BaseButton variant="ghost">thông tin →</BaseButton>
            </template>
            <div>
              <strong>chi tiết</strong>
              <p class="muted" style="margin: 6px 0 0">
                popover có thể chứa nhiều dòng văn bản, link, ảnh, hay form ngắn.
              </p>
            </div>
          </BasePopover>
        </div>
      </section>

      <!-- ── 7. ContextMenu ─── -->
      <section class="card">
        <h2 class="h">7. context menu — chuột phải vào vùng dưới</h2>
        <div class="ctx-target" @contextmenu="openCtx">
          <BaseBadge text="vùng test" variant="primary" />
          <span>chuột phải để mở menu (có sub-menu "chia sẻ")</span>
        </div>
        <ContextMenu
          :show="ctxShow"
          :x="ctxX"
          :y="ctxY"
          :items="ctxItems"
          @close="ctxShow = false"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--wx-bg-sunken);
  color: var(--wx-content-primary);
  font-family: var(--wx-font-primary);
}
.main {
  max-width: 1080px;
  margin: 0 auto;
  padding: var(--wx-space-5) var(--wx-space-4) var(--wx-space-9);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}
.card {
  background: var(--wx-bg-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-5);
  box-shadow: var(--wx-shadow-md);
}
.h {
  margin: 0 0 var(--wx-space-3);
  font-size: var(--wx-fs-20);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}
.muted {
  color: var(--wx-content-secondary);
  font-size: var(--wx-fs-14);
  margin: 0 0 var(--wx-space-3);
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wx-space-3);
  align-items: center;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  margin-top: var(--wx-space-3);
}

.menu-item {
  width: 100%;
  text-align: left;
  padding: var(--wx-space-2) var(--wx-space-3);
  border: none;
  background: transparent;
  border-radius: var(--wx-radius-md);
  font: inherit;
  font-size: var(--wx-fs-14);
  color: var(--wx-content-primary);
  cursor: pointer;
}
.menu-item:hover { background: var(--wx-hover-bg); }
.menu-item--danger { color: var(--wx-status-danger-text, var(--wx-danger-text)); }
.menu-sep {
  height: 1px;
  background: var(--wx-border-subtle);
  margin: var(--wx-space-1) 0;
}

.pop-form {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}
.pop-label {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-secondary);
}
.pop-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--wx-space-2);
  margin-top: var(--wx-space-2);
}

.ctx-target {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-5);
  border: 2px dashed var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  color: var(--wx-content-secondary);
  font-size: var(--wx-fs-14);
  user-select: none;
}
</style>
