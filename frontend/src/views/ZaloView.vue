<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '../composables'

const { showToast } = useToast()

const mockAccounts = [
  { id: 1, chose: false, phone: '0901234567', name: 'Nguyễn Văn A', pass: '••••••', status: 'Live', friends: 450, groups: 12, note: '' },
  { id: 2, chose: false, phone: '0912345678', name: 'Trần Thị B', pass: '••••••', status: 'Live', friends: 320, groups: 8, note: '' },
  { id: 3, chose: false, phone: '0923456789', name: 'Lê Minh C', pass: '••••••', status: 'Locked', friends: 180, groups: 5, note: 'Spam detected' },
  { id: 4, chose: false, phone: '0934567890', name: 'Phạm Quang D', pass: '••••••', status: 'Die', friends: 0, groups: 0, note: 'Banned' },
  { id: 5, chose: false, phone: '0945678901', name: 'Hoàng Thị E', pass: '••••••', status: 'Live', friends: 890, groups: 25, note: 'VIP' },
]

function handleAction(action: string) {
  showToast('info', `${action} — chức năng đang phát triển`)
}
</script>

<template>
  <div class="zalo-page">
    <!-- MenuStrip -->
    <div class="menu-strip">
      <button class="menu-btn" @click="handleAction('Cài đặt')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        Cài đặt
      </button>
      <button class="menu-btn" @click="handleAction('Tương tác')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        Tương tác
      </button>
      <button class="menu-btn" @click="handleAction('Tiện ích')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
        Tiện ích
      </button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-group">
        <button class="toolbar-btn toolbar-btn--run" @click="handleAction('Chạy')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Chạy
        </button>
      </div>
      <div class="toolbar-group toolbar-group--search">
        <div class="toolbar-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Tìm kiếm tài khoản..." class="toolbar-search-input" />
        </div>
        <button class="toolbar-btn toolbar-btn--add" @click="handleAction('Thêm TK')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Thêm TK
        </button>
      </div>
      <div class="toolbar-spacer"></div>
      <div class="toolbar-group">
        <button class="toolbar-btn toolbar-btn--stop" @click="handleAction('Dừng')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
          Dừng
        </button>
      </div>
    </div>

    <!-- DataGrid -->
    <div class="datagrid-wrapper">
      <div class="datagrid-scroll">
        <table class="datagrid">
          <thead>
            <tr>
              <th class="col-chk"><input type="checkbox" /></th>
              <th class="col-stt">STT</th>
              <th class="col-phone">Số điện thoại</th>
              <th class="col-name">Họ tên</th>
              <th class="col-pass">Mật khẩu</th>
              <th class="col-status">Trạng thái</th>
              <th class="col-num">Bạn bè</th>
              <th class="col-num">Nhóm</th>
              <th class="col-note">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(acc, idx) in mockAccounts" :key="acc.id" :class="{ 'row-die': acc.status === 'Die' }">
              <td class="col-chk"><input type="checkbox" v-model="acc.chose" /></td>
              <td class="col-stt">{{ idx + 1 }}</td>
              <td class="col-phone">{{ acc.phone }}</td>
              <td class="col-name">{{ acc.name }}</td>
              <td class="col-pass">{{ acc.pass }}</td>
              <td class="col-status">
                <span class="status-dot" :class="{ 'dot-live': acc.status === 'Live', 'dot-die': acc.status === 'Die', 'dot-cp': acc.status === 'Locked' }"></span>
                {{ acc.status }}
              </td>
              <td class="col-num">{{ acc.friends }}</td>
              <td class="col-num">{{ acc.groups }}</td>
              <td class="col-note">{{ acc.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- StatusBar -->
    <div class="status-bar">
      <span>Tổng: {{ mockAccounts.length }}</span>
      <span>Live: {{ mockAccounts.filter(a => a.status === 'Live').length }}</span>
      <span>Die: {{ mockAccounts.filter(a => a.status === 'Die').length }}</span>
      <span>Locked: {{ mockAccounts.filter(a => a.status === 'Locked').length }}</span>
    </div>
  </div>
</template>

<style scoped>
.zalo-page { display: flex; flex-direction: column; height: 100%; margin: calc(var(--space-lg) * -1); }
.menu-strip { height: 35px; display: flex; align-items: center; padding: 0 var(--space-sm); background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); gap: 2px; flex-shrink: 0; }
.menu-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border: none; border-radius: var(--radius-sm); background: transparent; color: var(--text-secondary); font-family: var(--font-family); font-size: 12px; cursor: pointer; transition: background 0.12s, color 0.12s; white-space: nowrap; }
.menu-btn:hover { background: var(--hover-bg); color: var(--text-primary); }
.toolbar { height: 52px; display: flex; align-items: center; padding: 0 var(--space-md); background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); gap: var(--space-sm); flex-shrink: 0; }
.toolbar-group { display: flex; align-items: center; gap: 6px; }
.toolbar-group--search { flex: 1; max-width: 500px; }
.toolbar-search { flex: 1; display: flex; align-items: center; gap: 5px; padding: 5px 8px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-tertiary); }
.toolbar-search-input { flex: 1; background: none; border: none; outline: none; color: var(--text-secondary); font-family: var(--font-family); font-size: 12px; }
.toolbar-search-input::placeholder { color: var(--text-tertiary); }
.toolbar-spacer { flex: 1; }
.toolbar-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; border: none; border-radius: 12px; font-family: var(--wx-font-primary, 'Inter', sans-serif); font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; overflow: hidden; border-top: 1px solid rgba(255,255,255,0.2); }
.toolbar-btn:hover { filter: brightness(1.05); }
.toolbar-btn:active { transform: scale(0.98); }
.toolbar-btn--run { background: linear-gradient(to right, #10b981, #059669); color: #fff; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.25); }
.toolbar-btn--add { background: linear-gradient(to right, #06b6d4, #3b82f6); color: #fff; box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.25); }
.toolbar-btn--stop { background: linear-gradient(to right, #f43f5e, #dc2626); color: #fff; box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.25); }
.datagrid-wrapper { flex: 1; overflow: hidden; background: var(--bg-primary); }
.datagrid-scroll { height: 100%; overflow: auto; }
.datagrid { width: 100%; border-collapse: collapse; font-size: 12px; }
.datagrid thead { position: sticky; top: 0; z-index: 5; }
.datagrid th { padding: 8px 10px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.3px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); white-space: nowrap; }
.datagrid td { padding: 7px 10px; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); white-space: nowrap; }
.datagrid tbody tr:hover td { background: var(--hover-bg); }
.col-chk { width: 36px; text-align: center; }
.col-stt { width: 40px; text-align: center; color: var(--text-tertiary); }
.col-phone { width: 120px; font-family: 'Consolas', monospace; font-size: 11px; }
.col-name { min-width: 130px; color: var(--text-primary); font-weight: 500; }
.col-pass { width: 70px; }
.col-status { width: 95px; }
.col-num { width: 80px; text-align: center; }
.col-note { min-width: 80px; }
.status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; vertical-align: middle; }
.dot-live { background: var(--success-color); }
.dot-die { background: var(--error-color); }
.dot-cp { background: var(--warning-color); }
.row-die td { opacity: 0.6; }
.datagrid input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; }
.status-bar { height: 28px; display: flex; align-items: center; gap: 16px; padding: 0 var(--space-md); background: var(--bg-tertiary); border-top: 1px solid var(--border-color); font-size: 11px; color: var(--text-tertiary); flex-shrink: 0; }
</style>
