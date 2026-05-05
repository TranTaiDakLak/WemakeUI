<script setup lang="ts">
import PageHeader from '../components/layout/PageHeader.vue'
</script>

<template>
  <div class="page animate-in">
    <PageHeader title="Cài đặt" description="Cấu hình ứng dụng WeConnect" />

    <div class="settings-grid">
      <!-- General -->
      <div class="card settings-section animate-in animate-delay-1">
        <h3 class="settings-section-title">Cài đặt chung</h3>
        <div class="settings-row">
          <div class="settings-label">
            <div class="settings-name">Ngôn ngữ</div>
            <div class="settings-desc">Ngôn ngữ hiển thị của ứng dụng</div>
          </div>
          <select class="settings-select" disabled>
            <option>Tiếng Việt</option>
          </select>
        </div>
        <div class="settings-row">
          <div class="settings-label">
            <div class="settings-name">Giao diện</div>
            <div class="settings-desc">Chế độ sáng hoặc tối</div>
          </div>
          <select class="settings-select" disabled>
            <option>Dark Mode</option>
          </select>
        </div>
        <div class="settings-row">
          <div class="settings-label">
            <div class="settings-name">Khởi động cùng hệ thống</div>
            <div class="settings-desc">Tự động mở khi bật máy</div>
          </div>
          <div class="toggle-placeholder">
            <div class="toggle-track"><div class="toggle-thumb"></div></div>
          </div>
        </div>
      </div>

      <!-- Proxy -->
      <div class="card settings-section animate-in animate-delay-2">
        <h3 class="settings-section-title">Proxy</h3>
        <div class="settings-row">
          <div class="settings-label">
            <div class="settings-name">Sử dụng Proxy</div>
            <div class="settings-desc">Dùng proxy cho các kết nối</div>
          </div>
          <div class="toggle-placeholder">
            <div class="toggle-track"><div class="toggle-thumb"></div></div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-label">
            <div class="settings-name">Proxy mặc định</div>
            <div class="settings-desc">Proxy chung cho tất cả tài khoản</div>
          </div>
          <input class="settings-input" placeholder="host:port:user:pass" disabled />
        </div>
      </div>

      <!-- About -->
      <div class="card settings-section animate-in animate-delay-3">
        <h3 class="settings-section-title">Thông tin</h3>
        <div class="settings-row">
          <div class="settings-label">
            <div class="settings-name">Phiên bản</div>
          </div>
          <span class="settings-value">1.0.0</span>
        </div>
        <div class="settings-row">
          <div class="settings-label">
            <div class="settings-name">Mã phần mềm</div>
          </div>
          <span class="settings-value" style="font-family: monospace; font-size: 12px;">WMKC-XXXX-XXXX</span>
        </div>
        <div class="settings-row">
          <div class="settings-label">
            <div class="settings-name">Hỗ trợ</div>
          </div>
          <span class="settings-value">support@wemake.vn</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.settings-section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-color);
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) 0;
}

.settings-row + .settings-row {
  border-top: 1px solid var(--border-color);
}

.settings-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.settings-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.settings-value {
  font-size: 13px;
  color: var(--text-secondary);
}

.settings-select,
.settings-input {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 13px;
  min-width: 160px;
}

/* Toggle placeholder */
.toggle-track {
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: var(--border-color);
  position: relative;
  cursor: pointer;
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--text-tertiary);
  transition: left 0.15s;
}
</style>
