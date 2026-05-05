<script setup lang="ts">
/**
 * AccountsView — matches WeFacebook frmFacebook layout:
 * Row 0: MenuStrip (35px)  — Cài đặt chung | Tương tác | Hiển thị | Tiện ích | Thùng rác | Liên hệ
 * Row 1: Toolbar (60px)    — [▶Run] [Category▼] [🔍Search...] [+Thêm TK] [Stop]
 * Row 2: DataGridView      — fill
 */

const mockAccounts = [
  { id: 1, chose: false, uid: '100012345678', name: 'Nguyễn Văn A', pass: '••••••', twofa: '✓', email: 'a@mail.com', cookie: '✓', token: '✓', status: 'Live', statusAds: '-', friends: 2340, follower: 120, note: '' },
  { id: 2, chose: false, uid: '100087654321', name: 'Trần Thị B', pass: '••••••', twofa: '✓', email: 'b@mail.com', cookie: '✓', token: '✓', status: 'Live', statusAds: '-', friends: 1820, follower: 85, note: '' },
  { id: 3, chose: false, uid: '100011112222', name: 'Lê Minh C', pass: '••••••', twofa: '✗', email: 'c@mail.com', cookie: '✗', token: '✗', status: 'Checkpoint', statusAds: '-', friends: 945, follower: 32, note: 'CP 282' },
  { id: 4, chose: false, uid: '100033334444', name: 'Phạm Quang D', pass: '••••••', twofa: '✗', email: 'd@mail.com', cookie: '✗', token: '✗', status: 'Die', statusAds: '-', friends: 0, follower: 0, note: '' },
  { id: 5, chose: false, uid: '100055556666', name: 'Hoàng Thị E', pass: '••••••', twofa: '✓', email: 'e@mail.com', cookie: '✓', token: '✓', status: 'Live', statusAds: 'Active', friends: 3102, follower: 450, note: 'VIP' },
  { id: 6, chose: false, uid: '100066667777', name: 'Vũ Đình F', pass: '••••••', twofa: '✓', email: 'f@mail.com', cookie: '✓', token: '✗', status: 'Live', statusAds: '-', friends: 560, follower: 20, note: '' },
  { id: 7, chose: false, uid: '100077778888', name: 'Đặng Thu G', pass: '••••••', twofa: '✗', email: 'g@mail.com', cookie: '✗', token: '✗', status: 'Die', statusAds: '-', friends: 0, follower: 0, note: 'Disabled' },
]
</script>

<template>
  <div class="fb-page">
    <!-- Row 0: MenuStrip — WeFacebook mnsSetting (35px) -->
    <div class="menu-strip">
      <button class="menu-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        Cài đặt chung
      </button>
      <button class="menu-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Thiết lập tương tác
      </button>
      <button class="menu-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        Cấu hình hiển thị
      </button>
      <button class="menu-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
        Tiện ích
      </button>
      <button class="menu-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        Thùng rác
      </button>
      <button class="menu-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
        Liên hệ
      </button>
    </div>

    <!-- Row 1: Toolbar — WeFacebook tlpButtonAction (60px) -->
    <div class="toolbar">
      <!-- gbRun — WeFacebook btnStart (green) -->
      <div class="toolbar-group">
        <button class="toolbar-btn toolbar-btn--run" title="Chạy tác vụ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Chạy
        </button>
      </div>

      <!-- gbCategory — WeFacebook Category selector -->
      <div class="toolbar-group toolbar-group--category">
        <span class="toolbar-label">Thư mục:</span>
        <select class="toolbar-select" disabled>
          <option>Tất cả (7 tài khoản)</option>
        </select>
      </div>

      <!-- gbFindAccount — Search bar -->
      <div class="toolbar-group toolbar-group--search">
        <select class="toolbar-select toolbar-select--sm" disabled>
          <option>UID</option>
          <option>Mật khẩu</option>
          <option>Email</option>
          <option>Nâng cao</option>
        </select>
        <div class="toolbar-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Tìm kiếm tài khoản..." class="toolbar-search-input" disabled />
        </div>
          <!-- btnAddAccount — WeFacebook orange button -->
        <button class="toolbar-btn toolbar-btn--add" title="Thêm tài khoản">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Thêm TK
        </button>
      </div>

      <!-- Spacer -->
      <div class="toolbar-spacer"></div>

      <!-- btnStop — WeFacebook red stop button -->
      <div class="toolbar-group">
        <button class="toolbar-btn toolbar-btn--stop" title="Dừng tác vụ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
          Dừng
        </button>
      </div>
    </div>

    <!-- Row 2: DataGridView — WeFacebook dgvAccount -->
    <div class="datagrid-wrapper">
      <div class="datagrid-scroll">
        <table class="datagrid">
          <thead>
            <tr>
              <th class="col-chk"><input type="checkbox" disabled /></th>
              <th class="col-stt">STT</th>
              <th class="col-uid">UID</th>
              <th class="col-name">Họ tên</th>
              <th class="col-pass">Mật khẩu</th>
              <th class="col-2fa">2FA</th>
              <th class="col-email">Email</th>
              <th class="col-cookie">Cookie</th>
              <th class="col-token">Token</th>
              <th class="col-status">Trạng thái</th>
              <th class="col-ads">Quảng cáo</th>
              <th class="col-friends">Bạn bè</th>
              <th class="col-follower">Theo dõi</th>
              <th class="col-note">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(acc, idx) in mockAccounts" :key="acc.id" :class="{ 'row-die': acc.status === 'Die' }">
              <td class="col-chk"><input type="checkbox" v-model="acc.chose" /></td>
              <td class="col-stt">{{ idx + 1 }}</td>
              <td class="col-uid">{{ acc.uid }}</td>
              <td class="col-name">{{ acc.name }}</td>
              <td class="col-pass">{{ acc.pass }}</td>
              <td class="col-2fa" :class="{ 'val-ok': acc.twofa === '✓', 'val-no': acc.twofa === '✗' }">{{ acc.twofa }}</td>
              <td class="col-email">{{ acc.email }}</td>
              <td class="col-cookie" :class="{ 'val-ok': acc.cookie === '✓', 'val-no': acc.cookie === '✗' }">{{ acc.cookie }}</td>
              <td class="col-token" :class="{ 'val-ok': acc.token === '✓', 'val-no': acc.token === '✗' }">{{ acc.token }}</td>
              <td class="col-status">
                <span class="status-dot" :class="{
                  'dot-live': acc.status === 'Live',
                  'dot-die': acc.status === 'Die',
                  'dot-cp': acc.status === 'Checkpoint'
                }"></span>
                {{ acc.status }}
              </td>
              <td class="col-ads">{{ acc.statusAds }}</td>
              <td class="col-friends">{{ acc.friends.toLocaleString() }}</td>
              <td class="col-follower">{{ acc.follower }}</td>
              <td class="col-note">{{ acc.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── Full-height layout matching WeFacebook frmFacebook ─── */
.fb-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: calc(var(--space-lg) * -1); /* cancel parent padding to go full-bleed */
}

/* ─── Row 0: MenuStrip — WeFacebook mnsSetting (H=35px) ─── */
.menu-strip {
  height: 35px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-sm);
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  gap: 2px;
  flex-shrink: 0;
}

.menu-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-family);
  font-size: 12px;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  white-space: nowrap;
}

.menu-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

/* ─── Row 1: Toolbar — WeFacebook tlpButtonAction (H=60px) ─── */
.toolbar {
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-md);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  gap: var(--space-sm);
  flex-shrink: 0;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-group--category {
  padding: 0 var(--space-sm);
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
}

.toolbar-group--search {
  flex: 1;
  max-width: 500px;
}

.toolbar-label {
  font-size: 12px;
  color: var(--text-tertiary);
  white-space: nowrap;
}

.toolbar-select {
  padding: 5px 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-family: var(--font-family);
  font-size: 12px;
  cursor: pointer;
  outline: none;
}

.toolbar-select--sm {
  width: 85px;
}

.toolbar-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
}

.toolbar-search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-secondary);
  font-family: var(--font-family);
  font-size: 12px;
}

.toolbar-search-input::placeholder {
  color: var(--text-tertiary);
}

.toolbar-spacer {
  flex: 1;
}

/* Toolbar Buttons — WX variant styles */
.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border: none;
  border-radius: 12px;
  font-family: var(--wx-font-primary, 'Inter', sans-serif);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.toolbar-btn:hover {
  filter: brightness(1.05);
}
.toolbar-btn:active {
  transform: scale(0.98);
}

/* Run = WxButton success */
.toolbar-btn--run {
  background: linear-gradient(to right, #10b981, #059669);
  color: #fff;
  box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.25);
}

/* Add = WxButton primary */
.toolbar-btn--add {
  background: linear-gradient(to right, #06b6d4, #3b82f6);
  color: #fff;
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.25);
}

/* Stop = WxButton danger */
.toolbar-btn--stop {
  background: linear-gradient(to right, #f43f5e, #dc2626);
  color: #fff;
  box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.25);
}

/* ─── Row 2: DataGridView — WeFacebook dgvAccount ───────── */
.datagrid-wrapper {
  flex: 1;
  overflow: hidden;
  background: var(--bg-primary);
}

.datagrid-scroll {
  height: 100%;
  overflow: auto;
}

.datagrid {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.datagrid thead {
  position: sticky;
  top: 0;
  z-index: 5;
}

.datagrid th {
  padding: 8px 10px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.datagrid td {
  padding: 7px 10px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.datagrid tbody tr:hover td {
  background: var(--hover-bg);
}

/* Column widths — similar to WeFacebook's dgvAccount */
.col-chk { width: 36px; text-align: center; }
.col-stt { width: 40px; text-align: center; color: var(--text-tertiary); }
.col-uid { width: 120px; font-family: 'Consolas', monospace; font-size: 11px; }
.col-name { min-width: 130px; color: var(--text-primary); font-weight: 500; }
.col-pass { width: 70px; }
.col-2fa { width: 36px; text-align: center; }
.col-email { min-width: 120px; }
.col-cookie { width: 50px; text-align: center; }
.col-token { width: 50px; text-align: center; }
.col-status { width: 95px; }
.col-ads { width: 70px; }
.col-friends { width: 65px; text-align: center; }
.col-follower { width: 70px; text-align: center; }
.col-note { min-width: 80px; }

/* Status dot — WeFacebook cStatusImage (20px image column) */
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
}

.dot-live { background: var(--success-color); }
.dot-die { background: var(--error-color); }
.dot-cp { background: var(--warning-color); }

/* Value indicators */
.val-ok { color: var(--success-color); }
.val-no { color: var(--text-tertiary); }

/* Die row — slightly dimmed */
.row-die td { opacity: 0.6; }

/* Checkbox styling */
.datagrid input[type="checkbox"] {
  accent-color: var(--brand-primary);
  cursor: pointer;
}
</style>
