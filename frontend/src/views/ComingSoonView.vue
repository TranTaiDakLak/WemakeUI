<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ platform: string }>()

const platformInfo = computed(() => {
  const name = props.platform
  const platforms: Record<string, { label: string; icon: string; color: string; desc: string }> = {
    instagram: {
      label: 'Instagram',
      icon: '📸',
      color: '#E4405F',
      desc: 'Quản lý tài khoản Instagram, lên lịch đăng bài, tương tác tự động...'
    },
    youtube: {
      label: 'YouTube',
      icon: '🎬',
      color: '#FF0000',
      desc: 'Quản lý kênh YouTube, seeding bình luận, tăng view và subscribe...'
    },
    zalo: {
      label: 'Zalo',
      icon: '💬',
      color: '#0068FF',
      desc: 'Quản lý tài khoản Zalo, gửi tin nhắn hàng loạt, tương tác nhóm...'
    },
    devices: {
      label: 'Thiết bị',
      icon: '📱',
      color: '#6366F1',
      desc: 'Quản lý thiết bị kết nối, cấu hình proxy, giám sát trạng thái...'
    },
  }
  return platforms[name] ?? { label: name, icon: '🔧', color: '#6366F1', desc: 'Tính năng đang được phát triển...' }
})
</script>

<template>
  <div class="coming-soon-page">
    <div class="coming-soon-card">
      <!-- Icon -->
      <div class="cs-icon-wrapper" :style="{ '--accent': platformInfo.color }">
        <span class="cs-emoji">{{ platformInfo.icon }}</span>
        <div class="cs-ring"></div>
        <div class="cs-ring cs-ring-2"></div>
      </div>

      <!-- Content -->
      <h1 class="cs-title">{{ platformInfo.label }}</h1>
      <div class="cs-badge">ĐANG PHÁT TRIỂN</div>
      <p class="cs-desc">{{ platformInfo.desc }}</p>

      <!-- Progress -->
      <div class="cs-progress-wrapper">
        <div class="cs-progress-label">
          <span>Tiến độ phát triển</span>
          <span class="cs-progress-pct">15%</span>
        </div>
        <div class="cs-progress-bar">
          <div class="cs-progress-fill" :style="{ '--accent': platformInfo.color }"></div>
        </div>
      </div>

      <!-- Features -->
      <div class="cs-features">
        <div class="cs-feature">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Thiết kế giao diện
        </div>
        <div class="cs-feature cs-feature--pending">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/></svg>
          Tích hợp API
        </div>
        <div class="cs-feature cs-feature--pending">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/></svg>
          Kiểm thử tính năng
        </div>
      </div>

      <p class="cs-note">Tính năng sẽ sớm được cập nhật. Vui lòng quay lại sau!</p>
    </div>
  </div>
</template>

<style scoped>
.coming-soon-page {
  display: flex; align-items: center; justify-content: center;
  height: calc(100% + var(--space-lg) * 2); margin: calc(var(--space-lg) * -1);
  background: linear-gradient(135deg, #f0f4f8 0%, #e8eef5 50%, #f5f0ff 100%);
  overflow: hidden; position: relative;
}

.coming-soon-page::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(99,102,241,0.06) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%);
  pointer-events: none;
}

.coming-soon-card {
  position: relative; text-align: center;
  background: #fff; border-radius: 20px;
  padding: 48px 56px; max-width: 480px; width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
}

.cs-icon-wrapper {
  position: relative; width: 80px; height: 80px;
  margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;
}

.cs-emoji { font-size: 40px; position: relative; z-index: 1; }

.cs-ring {
  position: absolute; inset: -4px; border-radius: 50%;
  border: 2px solid var(--accent, #6366f1); opacity: 0.2;
  animation: cs-pulse 2.5s ease-in-out infinite;
}
.cs-ring-2 { inset: -12px; animation-delay: 0.8s; opacity: 0.1; }

@keyframes cs-pulse {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.1); opacity: 0.05; }
}

.cs-title {
  font-size: 28px; font-weight: 800; color: #1a1a2e;
  margin: 0 0 12px; letter-spacing: -0.5px;
}

.cs-badge {
  display: inline-block; padding: 4px 14px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e; font-size: 11px; font-weight: 800;
  border-radius: 20px; letter-spacing: 1px; margin-bottom: 16px;
}

.cs-desc {
  font-size: 14px; color: #64748b; line-height: 1.6;
  margin: 0 0 28px; max-width: 360px; margin-left: auto; margin-right: auto;
}

.cs-progress-wrapper { margin-bottom: 28px; }

.cs-progress-label {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; color: #94a3b8; margin-bottom: 8px;
}

.cs-progress-pct { font-weight: 700; color: #64748b; }

.cs-progress-bar {
  height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;
}

.cs-progress-fill {
  height: 100%; width: 15%; border-radius: 3px;
  background: linear-gradient(90deg, var(--accent, #6366f1), color-mix(in srgb, var(--accent, #6366f1), white 30%));
  animation: cs-fill 1.5s ease-out;
}

@keyframes cs-fill { from { width: 0; } }

.cs-features {
  display: flex; flex-direction: column; gap: 10px;
  text-align: left; margin-bottom: 24px;
  padding: 16px 20px; background: #f8fafc; border-radius: 12px;
}

.cs-feature {
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; font-weight: 500; color: #22c55e;
}

.cs-feature--pending { color: #cbd5e1; }

.cs-note {
  font-size: 12px; color: #94a3b8; margin: 0;
  font-style: italic;
}
</style>
