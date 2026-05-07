<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseButton, BaseInput, BaseSelectMenu, FormField, BaseModal } from '../../components/common'

interface Member {
  id: number
  name: string
  email: string
  role: string
}

const showModal = ref(false)
const showCode  = ref(false)
const saving    = ref(false)

const newName  = ref('')
const newEmail = ref('')
const newRole  = ref('')

const roleOpts = [
  { value: 'admin',   label: 'Quản trị viên' },
  { value: 'editor',  label: 'Biên tập viên' },
  { value: 'viewer',  label: 'Chỉ xem' },
  { value: 'billing', label: 'Kế toán' },
]

const members = ref<Member[]>([
  { id: 1, name: 'Nguyễn Văn A', email: 'nva@congty.vn',  role: 'admin' },
  { id: 2, name: 'Trần Thị B',   email: 'ttb@congty.vn',  role: 'editor' },
  { id: 3, name: 'Lê Văn C',     email: 'lvc@congty.vn',  role: 'viewer' },
])
let nextId = 4

function openAdd() {
  newName.value = ''; newEmail.value = ''; newRole.value = ''
  showModal.value = true
}

function save() {
  if (!newName.value.trim() || !newEmail.value.trim() || !newRole.value) return
  saving.value = true
  setTimeout(() => {
    members.value.push({
      id: nextId++, name: newName.value, email: newEmail.value, role: newRole.value,
    })
    saving.value = false
    showModal.value = false
  }, 600)
}

function roleLabel(v: string) {
  return roleOpts.find(o => o.value === v)?.label ?? v
}
</script>

<template>
  <div class="fp">
    <AppTopbar title="WemakeUI" subtitle="forms — add modal" />
    <main class="fp__main">

      <div class="fp__hdr">
        <h1 class="fp__title">Add Modal Form</h1>
        <p class="fp__desc">
          Data table với nút "Thêm mới" mở <code>BaseModal</code>. Pattern chuẩn cho CRUD — modal chứa form nhập liệu, save với loading state.
        </p>
      </div>

      <!-- Table card -->
      <div class="fp__card">
        <div class="fp__card-head">
          <p class="fp__card-title" style="margin:0">Danh sách thành viên</p>
          <BaseButton size="sm" @click="openAdd">+ Thêm thành viên</BaseButton>
        </div>

        <div class="am-table-wrap">
          <table class="am-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
              </tr>
            </thead>
            <tbody>
              <TransitionGroup name="am-row" tag="tbody" v-if="false" />
              <tr v-for="m in members" :key="m.id" class="am-row-item">
                <td>{{ m.name }}</td>
                <td class="am-td--muted">{{ m.email }}</td>
                <td><span class="am-badge">{{ roleLabel(m.role) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add modal -->
      <BaseModal :show="showModal" title="Thêm thành viên mới" :show-save="true"
        save-label="Thêm vào" :loading="saving"
        @close="showModal = false" @save="save">
        <div class="am-form">
          <FormField label="Họ và tên" required>
            <BaseInput v-model="newName" placeholder="Nguyễn Văn A" />
          </FormField>
          <FormField label="Email" required>
            <BaseInput v-model="newEmail" type="email" placeholder="ban@congty.vn" />
          </FormField>
          <FormField label="Vai trò" required>
            <BaseSelectMenu v-model="newRole" :options="roleOpts" placeholder="Chọn vai trò..." />
          </FormField>
        </div>
      </BaseModal>

      <!-- How it works -->
      <div class="fp__card fp__card--info">
        <p class="fp__card-title">Cách hoạt động</p>
        <ul class="fp__list">
          <li><code>showModal</code> toggle đóng/mở BaseModal</li>
          <li>BaseModal nhận <code>:show-save="true"</code> → hiển thị nút Lưu, emit <code>@save</code></li>
          <li><code>:loading="saving"</code> → nút save spinner trong khi gọi API giả</li>
          <li>Sau save thành công → push vào array <code>members</code> → table tự cập nhật</li>
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
&lt;BaseButton @click="openAdd"&gt;+ Thêm&lt;/BaseButton&gt;

&lt;!-- Modal --&gt;
&lt;BaseModal
  :show="showModal"
  title="Thêm thành viên mới"
  :show-save="true"
  save-label="Thêm vào"
  :loading="saving"
  @close="showModal = false"
  @save="save"
&gt;
  &lt;FormField label="Họ và tên" required&gt;
    &lt;BaseInput v-model="newName" placeholder="Nguyễn Văn A" /&gt;
  &lt;/FormField&gt;
  &lt;FormField label="Vai trò" required&gt;
    &lt;BaseSelect v-model="newRole" :options="roleOpts" /&gt;
  &lt;/FormField&gt;
&lt;/BaseModal&gt;

// Save handler (optimistic or after API)
function save() {
  saving.value = true
  setTimeout(() => {
    members.value.push({ ...newData })
    saving.value = false
    showModal.value = false
  }, 600)
}</pre>
        </div>
        <div class="fp__meta">
          <span class="fp__meta-label">Components:</span>
          <span v-for="c in ['BaseModal','BaseInput','BaseSelect','FormField','BaseButton']" :key="c" class="fp__chip">{{ c }}</span>
          <span class="fp__meta-label" style="margin-left:8px">Patterns:</span>
          <span v-for="p in ['AddModal','DataTable','LoadingState','CRUDCreate']" :key="p" class="fp__chip">{{ p }}</span>
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

/* Table */
.am-table-wrap { overflow-x: auto; border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); }
.am-table { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-13); }
.am-table th { padding: 10px 14px; text-align: left; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .5px; color: var(--wx-text-muted); border-bottom: 1px solid var(--wx-border-subtle); background: var(--wx-surface-sunken); }
.am-table td { padding: 12px 14px; border-bottom: 1px solid var(--wx-border-subtle); color: var(--wx-text-primary); }
.am-table tbody tr:last-child td { border-bottom: none; }
.am-table tbody tr:hover td { background: color-mix(in srgb, var(--wx-brand-primary) 3%, transparent); }
.am-td--muted { color: var(--wx-text-muted); }
.am-badge { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 11px; font-weight: var(--wx-fw-medium); background: color-mix(in srgb, var(--wx-brand-primary) 12%, transparent); color: var(--wx-brand-primary); }

/* Modal form */
.am-form { display: flex; flex-direction: column; gap: var(--wx-space-3); }

/* Row enter animation */
.am-row-item { animation: row-in var(--wx-d-fast, 150ms) var(--wx-ease-decelerate, cubic-bezier(0,0,.2,1)); }
@keyframes row-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
</style>
