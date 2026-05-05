<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogout() {
  router.push('/login')
}
</script>

<template>
  <div class="dashboard-placeholder">
    <div class="dashboard-card">
      <div class="success-icon">✓</div>
      <h1 class="dashboard-title">Đăng nhập thành công!</h1>
      <p class="dashboard-text">
        Chào mừng bạn đến với <strong>WeFacebook</strong>.<br />
        Đây là trang placeholder sau khi đăng nhập mock.
      </p>
      <button class="btn-logout" @click="handleLogout">
        ← Quay lại đăng nhập
      </button>
    </div>
  </div>
</template>

<style scoped>
.dashboard-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: var(--bg-primary);
  font-family: var(--font-family);
}

.dashboard-card {
  text-align: center;
  padding: var(--space-2xl);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 440px;
}

.success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-lg);
  border-radius: 50%;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.dashboard-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.dashboard-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
}

.btn-logout {
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--hover-bg);
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: var(--active-bg);
}
</style>
