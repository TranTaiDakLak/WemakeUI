<script setup lang="ts">
import { ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseCard, BaseInput, BaseTag } from '../../components/common'

const KEYS = ref([
  { id: 1, name: 'Production API', key: 'wm_live_k8x2p...n4q7', created: '2026-01-15', lastUsed: '2 phút trước', active: true, scopes: ['read', 'write'] },
  { id: 2, name: 'Staging key', key: 'wm_test_m3r9s...v2b5', created: '2026-02-20', lastUsed: '1 ngày trước', active: true, scopes: ['read'] },
  { id: 3, name: 'CI / CD pipeline', key: 'wm_live_z1y8w...c6d3', created: '2026-03-10', lastUsed: '3 giờ trước', active: true, scopes: ['read', 'write', 'admin'] },
  { id: 4, name: 'Old integration (deprecated)', key: 'wm_live_a7f2t...p9e1', created: '2025-11-05', lastUsed: '45 ngày trước', active: false, scopes: ['read'] },
])

const newName = ref('')
const showCreate = ref(false)

function revokeKey(id: number) { KEYS.value = KEYS.value.map(k => k.id === id ? { ...k, active: false } : k) }
</script>

<template>
  <AppPageLayout section="app" current="API key" page-title="Quản lý API key" page-description="Tạo và quản lý khoá API để tích hợp ứng dụng">
    <template #actions>
      <BaseButton size="sm" variant="primary" @click="showCreate = !showCreate">+ Tạo khoá mới</BaseButton>
    </template>

    <!-- create form -->
    <Transition name="slide-fade">
      <BaseCard v-if="showCreate" class="create-card">
        <template #header><span class="card-label">Tạo API key mới</span></template>
        <template #body>
          <div class="create-form">
            <BaseInput v-model="newName" placeholder="Tên khoá (ví dụ: Production API)" style="max-width: 360px;" />
            <div class="scope-row">
              <span class="scope-label">Quyền truy cập:</span>
              <div class="scopes">
                <label v-for="s in ['read', 'write', 'admin']" :key="s" class="scope-check">
                  <input type="checkbox" :value="s" /> {{ s }}
                </label>
              </div>
            </div>
            <div class="form-actions">
              <BaseButton variant="primary" :disabled="!newName.trim()">Tạo khoá</BaseButton>
              <BaseButton variant="ghost" @click="showCreate = false">Huỷ</BaseButton>
            </div>
          </div>
        </template>
      </BaseCard>
    </Transition>

    <!-- key list -->
    <div class="key-list">
      <div v-for="k in KEYS" :key="k.id" class="key-item" :class="{ inactive: !k.active }">
        <div class="key-info">
          <div class="key-row1">
            <span class="key-name">{{ k.name }}</span>
            <BaseBadge :text="k.active ? 'hoạt động' : 'đã thu hồi'" :variant="k.active ? 'success' : 'neutral'" />
          </div>
          <code class="key-value">{{ k.key }}</code>
          <div class="key-meta">
            <span>Tạo: {{ k.created }}</span>
            <span>Dùng lần cuối: {{ k.lastUsed }}</span>
            <div class="scope-badges">
              <BaseTag v-for="s in k.scopes" :key="s" :text="s" size="sm" variant="neutral" />
            </div>
          </div>
        </div>
        <div class="key-actions">
          <BaseButton size="sm" variant="ghost">Sao chép</BaseButton>
          <BaseButton v-if="k.active" size="sm" variant="danger" @click="revokeKey(k.id)">Thu hồi</BaseButton>
        </div>
      </div>
    </div>

    <BaseCard class="docs-card">
      <template #header><span class="card-label">Cách sử dụng</span></template>
      <template #body>
        <p class="docs-text">Thêm API key vào header mọi request:</p>
        <pre class="code-block">Authorization: Bearer &lt;your-api-key&gt;</pre>
        <p class="docs-text">Hoặc dùng query parameter:</p>
        <pre class="code-block">GET /api/v1/resource?api_key=&lt;your-api-key&gt;</pre>
      </template>
    </BaseCard>
  </AppPageLayout>
</template>

<style scoped>
.create-card { margin-bottom: 0; }
.card-label { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); }
.create-form { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.scope-row { display: flex; align-items: center; gap: var(--wx-space-4); }
.scope-label { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); color: var(--wx-content-secondary); }
.scopes { display: flex; gap: var(--wx-space-4); }
.scope-check { display: flex; align-items: center; gap: var(--wx-space-2); font-size: var(--wx-fs-13); cursor: pointer; }
.form-actions { display: flex; gap: var(--wx-space-3); }

.key-list { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.key-item { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--wx-space-4); padding: var(--wx-space-4) var(--wx-space-5); background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); }
.key-item.inactive { opacity: 0.6; }
.key-info { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.key-row1 { display: flex; align-items: center; gap: var(--wx-space-3); }
.key-name { font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); }
.key-value { font-family: var(--wx-font-mono); font-size: var(--wx-fs-13); color: var(--wx-content-link); background: var(--wx-bg-sunken); padding: 2px 8px; border-radius: var(--wx-radius-sm); }
.key-meta { display: flex; align-items: center; gap: var(--wx-space-4); font-size: var(--wx-fs-12); color: var(--wx-content-muted); flex-wrap: wrap; }
.scope-badges { display: flex; gap: var(--wx-space-1); }
.key-actions { display: flex; gap: var(--wx-space-2); flex-shrink: 0; }

.docs-card { }
.docs-text { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); margin: 0 0 var(--wx-space-2); }
.code-block { font-family: var(--wx-font-mono); font-size: var(--wx-fs-13); background: var(--wx-bg-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); padding: var(--wx-space-3) var(--wx-space-4); margin: 0 0 var(--wx-space-3); overflow-x: auto; }

.slide-fade-enter-active, .slide-fade-leave-active { transition: all var(--wx-d-normal) var(--wx-ease-decelerate); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-8px); opacity: 0; }
</style>
