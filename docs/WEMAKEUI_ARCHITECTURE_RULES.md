# WEMAKEUI — Architecture Rules
> **Locked contracts.** Các rule này không thể bị override trừ khi có governance review.
> Last updated: 2026-05-06

---

## R00 — Meta Rule

**Trước khi implement bất kỳ thứ gì mới:**

```
1. Check: Có archetype nào cover use-case này chưa?
2. Check: Có component nào reusable chưa?
3. Check: Có config-driven approach nào không?
4. Check: Implementation này có làm tăng technical debt không?
5. Check: Implementation này có phá vỡ rule nào dưới đây không?
```

Chỉ sau 5 check này mới được implement.

---

## R01 — Design Token Rule

**RULE:** Mọi giá trị visual phải là CSS variable từ `tokens.css`.

```css
/* ✅ CORRECT */
color: var(--wx-text-primary);
background: var(--wx-surface-default);
border-radius: var(--wx-radius-md);
padding: var(--wx-space-4);
font-size: var(--wx-fs-13);
font-weight: var(--wx-fw-semibold);
box-shadow: var(--wx-shadow-md);
transition: all var(--wx-d-fast) var(--wx-ease-out);

/* ❌ FORBIDDEN */
color: #1a1a2e;
background: white;
border-radius: 8px;
padding: 16px;
font-size: 13px;
font-weight: 600;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
transition: all 0.2s ease;
```

**Exceptions:** color-mix() with CSS variables is allowed. Raw hex inside color-mix() is forbidden.

**Enforcement:** typecheck won't catch this — must be caught in code review.

---

## R02 — CRUD Rule

**RULE:** Mọi table/list có CRUD operations phải dùng `CrudPage` archetype + `CrudPageConfig<T>` schema.

```typescript
// ✅ CORRECT — define config, consume archetype
export const myEntityConfig: CrudPageConfig<MyEntity> = {
  entity: 'myentity',
  columns: [...],
  addForm: { ... },
  editForm: { ... },
  detail: { ... },
  delete: { ... },
}

// In view:
<CrudPage :config="myEntityConfig" />

// ❌ FORBIDDEN — hand-rolled table
<table>
  <tr v-for="item in items">
    <td>{{ item.name }}</td>
    ...
  </tr>
</table>
```

**When to extend CrudPage:** If CrudPageConfig<T> doesn't cover a use-case, extend the schema — don't bypass it.

---

## R03 — Form Rule

**RULE:** Mọi add/edit form trong overlay (modal hoặc drawer) phải dùng `FormModal` hoặc `FormDrawer`.

```vue
<!-- ✅ CORRECT -->
<FormModal v-model="open" title="Thêm thành viên" @submit="handleSubmit">
  <BaseInput v-model="form.name" />
</FormModal>

<!-- ❌ FORBIDDEN — raw BaseModal with manual form -->
<BaseModal v-model="open">
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" />
  </form>
</BaseModal>
```

**Exception:** ConfirmDialog is the correct pattern for delete/destructive actions.

---

## R04 — State Rule

**RULE:** Business state không được sống trong component-local `ref()`. Phải dùng Pinia store.

```typescript
// ✅ CORRECT — state in store
const saasStore = useSaasStore()
const members = computed(() => saasStore.members)

// ❌ FORBIDDEN — data fetched/stored in component
const members = ref<Member[]>([])
onMounted(() => { members.value = [...MOCK_DATA] })
```

**Exception:** UI-only state (dialog open/close, form dirty flag, hover state) can stay local.

**Current debt:** SaaS pages use local state — must be migrated to stores.

---

## R05 — API Rule

**RULE:** Mọi data access phải đi qua `useApi()` composable — không gọi fetch/axios trực tiếp trong components hoặc stores.

```typescript
// ✅ CORRECT
const api = useApi()
const members = await api.get<Member[]>('/saas/members')

// ❌ FORBIDDEN
const res = await fetch('/api/members')
const members = await res.json()

// ❌ ALSO FORBIDDEN
import axios from 'axios'
const { data } = await axios.get('/api/members')
```

**Status:** `useApi()` không tồn tại. Đây là TODO critical. Hiện tại dùng mock data trong configs — acceptable trong build phase, phải migrate khi có real API.

---

## R06 — Motion Rule

**RULE:** Mọi animation/transition phải dùng token từ `motion.css` hoặc `useScrollReveal`/`useStagger`.

```css
/* ✅ CORRECT — use token */
transition: var(--wx-d-fast) var(--wx-ease-out);
animation: var(--wx-anim-fade-in);

/* ❌ FORBIDDEN — hardcoded timing */
transition: 0.2s ease;
animation: fadeIn 0.3s ease-out;
```

```vue
<!-- ✅ CORRECT — use composable for scroll reveals -->
<script setup>
const { target } = useScrollReveal({ threshold: 0.15 })
</script>
<template>
  <div ref="target" class="reveal">...</div>
</template>

<!-- ❌ FORBIDDEN — per-component IntersectionObserver -->
```

---

## R07 — Layout Rule

**RULE:** Mọi full-page view phải dùng một trong các layout shells từ `views/_layouts/`.

```vue
<!-- ✅ CORRECT -->
<template>
  <SaasLayout current="members" page-title="Thành viên">
    ...
  </SaasLayout>
</template>

<!-- ❌ FORBIDDEN — inline layout construction -->
<template>
  <div class="my-custom-layout">
    <aside>...</aside>
    <main>...</main>
  </div>
</template>
```

**Available layouts:** AppLayout, AuthLayout, DashboardLayout, ErrorLayout, LandingLayout, SaasLayout, WeConnectLayout.

---

## R08 — Config Rule

**RULE:** Mock data và entity configurations phải sống trong `configs/[domain]/[entity].config.ts`.

```
✅ CORRECT file structure:
configs/
  saas/
    members.config.ts    ← Member entity + MOCK data + CrudPageConfig
    products.config.ts
  weconnect/
    contacts.config.ts

❌ FORBIDDEN:
views/saas/MembersView.vue  ← chứa const MOCK_MEMBERS = [...]
```

---

## R09 — Import Rule

**RULE:** Import components từ barrel exports, không import trực tiếp từ file.

```typescript
// ✅ CORRECT
import { BaseButton, BaseInput, BaseModal } from '@/components/common'
import { AppShell, AppSidebar } from '@/components/layout'
import { LineChart, PieChart } from '@/components/charts'

// ❌ FORBIDDEN — direct file import
import BaseButton from '@/components/common/BaseButton.vue'
import LineChart from '@/components/charts/LineChart.vue'
```

**Exception:** Archetypes và layout-specific components (CrudPage, DashboardKPICard, SaasLayout) may be imported directly.

---

## R10 — TypeScript Rule

**RULE:** Strict typing cho tất cả props, emits, store state, composable return, config objects.

```typescript
// ✅ CORRECT
defineProps<{
  status: 'active' | 'blocked' | 'pending'
  count?: number
}>()

const store = defineStore('saas', () => {
  const members = ref<Member[]>([])
  return { members }
})

// ❌ FORBIDDEN
defineProps(['status', 'count'])
const store = defineStore('saas', { state: () => ({ members: [] }) })
```

---

## R11 — No Duplication Rule

**RULE:** Khi một pattern xuất hiện lần thứ 2, phải extract thành archetype hoặc composable.

```
Pattern appears once  → implement inline, mark TODO for extraction
Pattern appears twice → STOP, extract to archetype before implementing second instance
Pattern appears 3+    → architectural failure, must refactor
```

**Currently at risk:**
- Settings card pattern (4 cards in SettingsView) → needs `FormSection` archetype
- KPI card row pattern → `DashboardKPICard` covers this ✅
- Stat summary table → needs `StatTable` archetype

---

## R12 — Route Guard Rule

**RULE:** Mọi route trong `/saas/*`, `/weconnect/*`, `/dashboard/*` phải có auth guard.

```typescript
// ✅ CORRECT
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.path.startsWith('/saas') && !auth.isLoggedIn) {
    return '/auth/login'
  }
})

// ❌ FORBIDDEN — unguarded private routes
{ path: '/saas/members', component: MembersView }  // no guard
```

**Status:** Guards not implemented. Auth store exists. This is HIGH priority debt.

---

## R13 — Archetype-First Rule

**RULE:** Khi build một loại page mới, phải build archetype trước, sau đó implement page dùng archetype.

```
Wrong order: build MembersView → copy-paste for ProductsView
Right order: build CrudPage archetype → MembersView uses it → ProductsView uses it
```

**Archetype checklist trước khi build page mới:**
1. Xác định loại page (CRUD? Dashboard? Settings? Marketing?)
2. Check xem archetype đã có chưa
3. Nếu chưa có → build archetype trước
4. Implement page dùng archetype
5. Đăng ký trong `layoutRegistry.ts`

---

## R14 — Library Export Rule

**RULE:** Mọi component mới trong `components/common/` phải được export từ `components/common/index.ts`. Mọi composable trong `composables/` phải export từ `composables/index.ts`.

Library entry (`lib.ts`) auto-picks up via `export * from './components/common'`.

**Violation check:** Run `npm run build:lib` — missing exports sẽ không vào bundle.
