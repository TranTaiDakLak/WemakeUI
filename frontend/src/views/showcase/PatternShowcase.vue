<script setup lang="ts">
/**
 * Phase 9 — Form Popup Patterns showcase.
 * FormModal · FormDrawer · ConfirmDialog — với full flow: open → fill → submit → toast → close.
 */
import { ref, reactive } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PageHeader from '../../components/layout/PageHeader.vue'
import {
  BaseButton, BaseInput, BaseSelect, BaseToggle, BaseBadge, BaseTag,
  FormField, FormModal, FormDrawer, ConfirmDialog,
} from '../../components/common'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

/* ── Add Modal ── */
const addModalOpen = ref(false)
const addLoading = ref(false)
const addForm = reactive({ name: '', email: '', role: 'member', active: true })
function openAdd() {
  addForm.name = ''
  addForm.email = ''
  addForm.role = 'member'
  addForm.active = true
  addModalOpen.value = true
}
async function handleAdd() {
  if (!addForm.name || !addForm.email) {
    showToast('error', 'vui lòng điền đầy đủ thông tin')
    return
  }
  addLoading.value = true
  await new Promise(r => setTimeout(r, 1200))
  addLoading.value = false
  addModalOpen.value = false
  showToast('success', `đã thêm ${addForm.name} thành công`)
}

/* ── Edit Modal ── */
const editModalOpen = ref(false)
const editLoading = ref(false)
const editForm = reactive({ name: 'Nguyễn Văn An', email: 'an@company.vn', role: 'admin', active: true })
async function handleEdit() {
  editLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  editLoading.value = false
  editModalOpen.value = false
  showToast('success', 'cập nhật thành công')
}

/* ── Form Drawer ── */
const drawerOpen = ref(false)
const drawerLoading = ref(false)
const drawerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  role: 'member',
  bio: '',
})
async function handleDrawerSubmit() {
  drawerLoading.value = true
  await new Promise(r => setTimeout(r, 1400))
  drawerLoading.value = false
  drawerOpen.value = false
  showToast('success', 'đã lưu thông tin liên hệ')
}

/* ── Confirm Dialogs ── */
const confirmDeleteOpen  = ref(false)
const confirmArchiveOpen = ref(false)
const confirmRevokeOpen  = ref(false)
const confirmLoading     = ref(false)

async function handleConfirmAction(action: string) {
  confirmLoading.value = true
  await new Promise(r => setTimeout(r, 900))
  confirmLoading.value = false
  confirmDeleteOpen.value  = false
  confirmArchiveOpen.value = false
  confirmRevokeOpen.value  = false
  showToast('success', `đã ${action} thành công`)
}

const roleOptions = [
  { value: 'admin',  label: 'Quản trị viên' },
  { value: 'member', label: 'Thành viên' },
  { value: 'viewer', label: 'Chỉ xem' },
]

const deptOptions = [
  { value: 'engineering', label: 'Kỹ thuật' },
  { value: 'design',      label: 'Thiết kế' },
  { value: 'product',     label: 'Sản phẩm' },
  { value: 'marketing',   label: 'Marketing' },
]
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="phase 9 — form popup patterns" />

    <main class="main">
      <PageHeader
        title="phase 9 — form popup patterns"
        description="FormModal · FormDrawer · ConfirmDialog — pattern thực chiến với đầy đủ: loading, validation, toast, và trạng thái form."
      />

      <!-- ── 1. Add Modal ─────────────────────────────── -->
      <section id="add-modal" class="card">
        <h2 class="h">1. add → modal form</h2>
        <p class="sub-desc">pattern chuẩn cho "thêm mới": nút mở modal → nhập form → validate → submit loading → success toast.</p>

        <div class="row">
          <BaseButton @click="openAdd">
            <template #default>+ thêm người dùng</template>
          </BaseButton>
        </div>

        <div class="code-hint">
          <code>v-model="addModalOpen" @submit="handleAdd"</code>
        </div>
      </section>

      <!-- ── 2. Edit Modal ─────────────────────────────── -->
      <section id="edit-modal" class="card">
        <h2 class="h">2. edit → modal form</h2>
        <p class="sub-desc">load data sẵn vào form, user sửa rồi submit. Dữ liệu mock được pre-fill.</p>

        <div class="row">
          <BaseButton variant="secondary" @click="editModalOpen = true">
            ✏️ chỉnh sửa Nguyễn Văn An
          </BaseButton>
        </div>
      </section>

      <!-- ── 3. Form Drawer ─────────────────────────────── -->
      <section id="form-drawer" class="card">
        <h2 class="h">3. add/edit → drawer form</h2>
        <p class="sub-desc">dùng drawer cho form nhiều field (không muốn mất context của trang chính).</p>

        <div class="row">
          <BaseButton variant="neutral" @click="drawerOpen = true">
            ☰ mở form drawer
          </BaseButton>
        </div>
      </section>

      <!-- ── 4. Confirm Actions ─────────────────────────── -->
      <section id="confirm" class="card">
        <h2 class="h">4. confirm action</h2>
        <p class="sub-desc">3 intent: danger (xoá), warning (archive/disable), info (revoke key).</p>

        <div class="row">
          <BaseButton variant="danger" @click="confirmDeleteOpen = true">
            🗑 xoá người dùng
          </BaseButton>
          <BaseButton variant="warning" @click="confirmArchiveOpen = true">
            📦 archive chiến dịch
          </BaseButton>
          <BaseButton variant="secondary" @click="confirmRevokeOpen = true">
            🔑 thu hồi API key
          </BaseButton>
        </div>
      </section>

      <!-- ── 5. Pattern States ─────────────────────────── -->
      <section id="states" class="card">
        <h2 class="h">5. trạng thái component</h2>
        <div class="states-grid">
          <div class="state-card">
            <BaseBadge variant="success">submit → loading</BaseBadge>
            <p>spinner xuất hiện trên button, form bị disable, overlay không đóng được</p>
          </div>
          <div class="state-card">
            <BaseBadge variant="danger">validation fail</BaseBadge>
            <p>toast error "điền đầy đủ thông tin", modal vẫn mở, không submit</p>
          </div>
          <div class="state-card">
            <BaseBadge variant="info">success</BaseBadge>
            <p>modal đóng, toast success, list cập nhật (implement ở parent)</p>
          </div>
        </div>
      </section>
    </main>

    <!-- ════════════════ FormModal: Add ════════════════ -->
    <FormModal
      v-model="addModalOpen"
      title="Thêm người dùng"
      size="md"
      submit-label="Tạo tài khoản"
      :loading="addLoading"
      @submit="handleAdd"
    >
      <div class="form-grid">
        <FormField label="Họ và tên" required>
          <BaseInput v-model="addForm.name" placeholder="Nguyễn Văn A" />
        </FormField>
        <FormField label="Email" required>
          <BaseInput v-model="addForm.email" type="email" placeholder="email@company.vn" />
        </FormField>
        <FormField label="Vai trò">
          <BaseSelect v-model="addForm.role" :options="roleOptions" />
        </FormField>
        <FormField label="Trạng thái">
          <div class="toggle-row">
            <BaseToggle v-model="addForm.active" />
            <span class="toggle-label">{{ addForm.active ? 'đang hoạt động' : 'vô hiệu hoá' }}</span>
          </div>
        </FormField>
      </div>
    </FormModal>

    <!-- ════════════════ FormModal: Edit ════════════════ -->
    <FormModal
      v-model="editModalOpen"
      title="Chỉnh sửa người dùng"
      size="md"
      submit-label="Lưu thay đổi"
      :loading="editLoading"
      @submit="handleEdit"
    >
      <div class="form-grid">
        <FormField label="Họ và tên" required>
          <BaseInput v-model="editForm.name" />
        </FormField>
        <FormField label="Email" required>
          <BaseInput v-model="editForm.email" type="email" />
        </FormField>
        <FormField label="Vai trò">
          <BaseSelect v-model="editForm.role" :options="roleOptions" />
        </FormField>
        <FormField label="Trạng thái">
          <div class="toggle-row">
            <BaseToggle v-model="editForm.active" />
            <span class="toggle-label">{{ editForm.active ? 'đang hoạt động' : 'vô hiệu hoá' }}</span>
          </div>
        </FormField>
      </div>
    </FormModal>

    <!-- ════════════════ FormDrawer ════════════════ -->
    <FormDrawer
      v-model="drawerOpen"
      title="Thêm liên hệ"
      size="lg"
      submit-label="Lưu liên hệ"
      :loading="drawerLoading"
      @submit="handleDrawerSubmit"
    >
      <div class="form-grid form-grid--2">
        <FormField label="Tên">
          <BaseInput v-model="drawerForm.firstName" placeholder="Nguyễn" />
        </FormField>
        <FormField label="Họ">
          <BaseInput v-model="drawerForm.lastName" placeholder="Văn A" />
        </FormField>
      </div>
      <FormField label="Email">
        <BaseInput v-model="drawerForm.email" type="email" placeholder="email@company.vn" />
      </FormField>
      <FormField label="Số điện thoại">
        <BaseInput v-model="drawerForm.phone" placeholder="0901 234 567" />
      </FormField>
      <FormField label="Phòng ban">
        <BaseSelect v-model="drawerForm.department" :options="deptOptions" placeholder="chọn phòng ban" />
      </FormField>
      <FormField label="Vai trò">
        <BaseSelect v-model="drawerForm.role" :options="roleOptions" />
      </FormField>
      <FormField label="Giới thiệu">
        <textarea
          v-model="drawerForm.bio"
          class="bio-input"
          placeholder="mô tả ngắn về người này..."
          rows="3"
        />
      </FormField>
    </FormDrawer>

    <!-- ════════════════ ConfirmDialog × 3 ════════════════ -->
    <ConfirmDialog
      v-model="confirmDeleteOpen"
      title="Xoá người dùng?"
      description="Tài khoản sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác."
      intent="danger"
      confirm-label="Xoá ngay"
      :loading="confirmLoading"
      @confirm="handleConfirmAction('xoá người dùng')"
    />

    <ConfirmDialog
      v-model="confirmArchiveOpen"
      title="Archive chiến dịch?"
      description="Chiến dịch sẽ bị tạm ngưng và không hiển thị với người dùng."
      intent="warning"
      confirm-label="Archive"
      :loading="confirmLoading"
      @confirm="handleConfirmAction('archive chiến dịch')"
    />

    <ConfirmDialog
      v-model="confirmRevokeOpen"
      title="Thu hồi API key?"
      description="Mọi ứng dụng đang dùng key này sẽ mất quyền truy cập ngay lập tức."
      intent="info"
      confirm-label="Thu hồi"
      :loading="confirmLoading"
      @confirm="handleConfirmAction('thu hồi key')"
    />
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--wx-surface-sunken); }
.main { max-width: 960px; margin: 0 auto; padding: var(--wx-space-6); display: flex; flex-direction: column; gap: var(--wx-space-5); }

.card {
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  padding: var(--wx-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
}

.h {
  font-size: var(--wx-fs-16);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
  margin: 0;
}

.sub-desc {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  margin: 0;
  line-height: 1.5;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--wx-space-3);
}

.code-hint {
  padding: var(--wx-space-3) var(--wx-space-4);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
  border: 1px solid var(--wx-border-subtle);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
}
.form-grid--2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--wx-space-4);
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
}
.toggle-label {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
}

.bio-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-14);
  color: var(--wx-text-primary);
  background: var(--wx-surface-base);
  resize: vertical;
  transition: border-color var(--wx-duration-fast);
}
.bio-input:focus {
  outline: none;
  border-color: var(--wx-brand-focus);
}

.states-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--wx-space-4);
}
.state-card {
  padding: var(--wx-space-4);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-lg);
  border: 1px solid var(--wx-border-subtle);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}
.state-card p {
  margin: 0;
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
  line-height: 1.5;
}
</style>
