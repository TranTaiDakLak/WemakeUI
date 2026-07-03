<script setup lang="ts">
/** auth/workspace — chọn workspace / tổ chức (grid card) */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import { BaseButton, BaseInput, BaseTag, BaseAvatarGroup, BaseAvatar } from '../../components/common'

const search = ref('')
const selectedId = ref<string | null>(null)
const workspaces = ref([
  {
    id: 'wm', name: 'WemakeUI', subdomain: 'wemake', role: 'owner',
    members: 24, plan: 'pro', logoColor: '#2563eb', initial: 'W',
  },
  {
    id: 'tc', name: 'TechCorp', subdomain: 'techcorp', role: 'admin',
    members: 142, plan: 'team', logoColor: '#9333ea', initial: 'T',
  },
  {
    id: 'sb', name: 'SideBiz', subdomain: 'sidebiz', role: 'member',
    members: 6, plan: 'free', logoColor: '#10b981', initial: 'S',
  },
  {
    id: 'lb', name: 'Lab thực nghiệm', subdomain: 'lab', role: 'viewer',
    members: 3, plan: 'free', logoColor: '#f59e0b', initial: 'L',
  },
])

const filtered = () =>
  workspaces.value.filter((w) =>
    w.name.toLowerCase().includes(search.value.toLowerCase())
  )

function pick(id: string) {
  selectedId.value = id
}
</script>

<template>
  <AuthLayout :no-aside="true" align="top">
    <header class="auth-head">
      <RouterLink to="/" class="brand">
        <img src="/logo.png" alt="WemakeUI" class="brand-logo" />
        <span class="brand-name">WemakeUI</span>
      </RouterLink>
      <h1>Chọn workspace</h1>
      <p>Bạn có quyền truy cập <strong>{{ workspaces.length }}</strong> workspace.
        Chọn một để tiếp tục.</p>
    </header>

    <div class="search-wrap">
      <BaseInput v-model="search" placeholder="Tìm theo tên…" size="md" />
    </div>

    <div class="ws-grid">
      <button
        v-for="w in filtered()"
        :key="w.id"
        class="ws-card"
        :class="{ 'ws-card--active': selectedId === w.id }"
        type="button"
        @click="pick(w.id)"
      >
        <div class="ws-logo" :style="{ background: w.logoColor }">{{ w.initial }}</div>
        <div class="ws-body">
          <div class="ws-line">
            <strong>{{ w.name }}</strong>
            <BaseTag :label="w.role" size="sm" :variant="w.role === 'owner' ? 'primary' : w.role === 'admin' ? 'info' : 'neutral'" />
          </div>
          <div class="ws-sub">
            <span>{{ w.subdomain }}.wemake.app</span>
            <span class="dot">•</span>
            <span>{{ w.members }} thành viên</span>
            <span class="dot">•</span>
            <BaseTag :label="w.plan" size="sm" :variant="w.plan === 'pro' ? 'primary' : w.plan === 'team' ? 'success' : 'neutral'" />
          </div>
        </div>
        <div class="ws-avatars">
          <BaseAvatarGroup :max="3" size="xs">
            <BaseAvatar v-for="i in Math.min(w.members, 3)" :key="i" :name="`Người ${i}`" size="xs" />
          </BaseAvatarGroup>
        </div>
      </button>
    </div>

    <div class="ws-actions">
      <RouterLink to="/auth/onboarding" class="link-sm">+ Tạo workspace mới</RouterLink>
      <RouterLink to="/dashboard/overview" v-if="selectedId">
        <BaseButton>Tiếp tục →</BaseButton>
      </RouterLink>
    </div>
  </AuthLayout>
</template>

<style scoped>
.auth-head { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.brand { display: flex; align-items: center; gap: var(--wx-space-2); text-decoration: none; color: inherit; }
.brand-logo {
  width: 32px; height: 32px;
  object-fit: contain;
  display: inline-block;
}
.brand-name { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-semibold); }
.auth-head h1 { margin: 0; font-size: var(--wx-fs-28); font-weight: var(--wx-fw-semibold); letter-spacing: var(--wx-tracking-tight); }
.auth-head p { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-content-muted); }

.search-wrap { width: 100%; }

.ws-grid {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}
.ws-card {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: var(--wx-space-3);
  align-items: center;
  padding: var(--wx-space-3);
  background: var(--wx-surface-base);
  border: 1.5px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: all var(--wx-d-fast) var(--wx-ease-standard);
}
.ws-card:hover { border-color: var(--wx-border-focus); transform: translateY(-1px); box-shadow: var(--wx-shadow-md); }
.ws-card--active { border-color: var(--wx-brand-primary); background: rgba(37, 99, 235, 0.06); }
.ws-card:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; }

.ws-logo {
  width: 48px; height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--wx-radius-lg);
  color: white;
  font-weight: var(--wx-fw-bold);
  font-size: var(--wx-fs-20);
}
.ws-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.ws-line { display: flex; align-items: center; gap: var(--wx-space-2); }
.ws-line strong { font-size: var(--wx-fs-15); }
.ws-sub {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  display: flex;
  align-items: center;
  gap: var(--wx-space-1);
  flex-wrap: wrap;
}
.dot { opacity: 0.5; }

.ws-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--wx-space-2);
  padding-top: var(--wx-space-3);
  border-top: 1px solid var(--wx-border-subtle);
}
.link-sm { font-size: var(--wx-fs-13); color: var(--wx-content-link); text-decoration: none; }
.link-sm:hover { text-decoration: underline; }
</style>
