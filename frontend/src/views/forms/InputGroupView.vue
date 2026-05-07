<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseButton } from '../../components/common'

const search   = ref('')
const url      = ref('')
const phone    = ref('')
const price    = ref('')
const password = ref('')
const showPwd  = ref(false)
const showCode = ref(false)
</script>

<template>
  <div class="fp">
    <AppTopbar title="WemakeUI" subtitle="forms — input groups" />
    <main class="fp__main">

      <div class="fp__hdr">
        <h1 class="fp__title">Input Groups</h1>
        <p class="fp__desc">Kết hợp input với icon, text prefix/suffix, button addon. Pattern này dùng markup thuần + CSS — không cần component riêng.</p>
      </div>

      <!-- Icon prefix -->
      <div class="fp__card">
        <p class="fp__card-title">Icon prefix</p>
        <div class="ig-wrap">
          <span class="ig-addon ig-addon--left">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input v-model="search" class="ig-input" placeholder="Tìm kiếm..." />
        </div>
        <p class="fp__hint">Icon prefix phổ biến cho search, user, phone.</p>
      </div>

      <!-- Text prefix (URL) -->
      <div class="fp__card">
        <p class="fp__card-title">Text prefix — URL</p>
        <div class="ig-wrap">
          <span class="ig-addon ig-addon--left ig-addon--text">https://</span>
          <input v-model="url" class="ig-input" placeholder="example.com" />
        </div>
      </div>

      <!-- Text prefix phone -->
      <div class="fp__card">
        <p class="fp__card-title">Text prefix — Số điện thoại</p>
        <div class="ig-wrap">
          <span class="ig-addon ig-addon--left ig-addon--text">+84</span>
          <input v-model="phone" class="ig-input" type="tel" placeholder="900 000 000" />
        </div>
      </div>

      <!-- Suffix button -->
      <div class="fp__card">
        <p class="fp__card-title">Suffix button — Search</p>
        <div class="ig-wrap">
          <input v-model="search" class="ig-input ig-input--btn-right" placeholder="Nhập từ khóa..." />
          <button class="ig-btn ig-btn--right">Tìm</button>
        </div>
      </div>

      <!-- Password show/hide -->
      <div class="fp__card">
        <p class="fp__card-title">Icon suffix — Show / Hide password</p>
        <div class="ig-wrap">
          <input v-model="password" :type="showPwd ? 'text' : 'password'" class="ig-input ig-input--icon-right" placeholder="Mật khẩu..." />
          <button class="ig-icon-btn" :aria-label="showPwd ? 'Ẩn' : 'Hiện'" @click="showPwd = !showPwd">
            <svg v-if="!showPwd" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
      </div>

      <!-- Prefix + Suffix (price) -->
      <div class="fp__card">
        <p class="fp__card-title">Prefix + Suffix — Giá tiền</p>
        <div class="ig-wrap">
          <span class="ig-addon ig-addon--left ig-addon--text">₫</span>
          <input v-model="price" class="ig-input" type="number" placeholder="0" />
          <span class="ig-addon ig-addon--right ig-addon--text">VND</span>
        </div>
      </div>

      <!-- Code -->
      <div class="fp__card">
        <div class="fp__code-head">
          <p class="fp__card-title" style="margin:0">Code — CSS pattern</p>
          <button class="fp__code-toggle" @click="showCode = !showCode">{{ showCode ? '▲ Ẩn' : '▼ Hiện' }}</button>
        </div>
        <div v-if="showCode" class="fp__code">
<pre>&lt;!-- Template --&gt;
&lt;div class="ig-wrap"&gt;
  &lt;span class="ig-addon ig-addon--left"&gt;https://&lt;/span&gt;
  &lt;input class="ig-input" placeholder="example.com" /&gt;
&lt;/div&gt;

/* CSS */
.ig-wrap { display: flex; align-items: stretch; }
.ig-addon {
  display: flex; align-items: center;
  padding: 0 12px;
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-default);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-muted);
  white-space: nowrap;
}
.ig-addon--left  { border-right: none; border-radius: var(--wx-radius-md) 0 0 var(--wx-radius-md); }
.ig-addon--right { border-left: none;  border-radius: 0 var(--wx-radius-md) var(--wx-radius-md) 0; }
.ig-input {
  flex: 1; min-width: 0;
  padding: 8px 12px;
  border: 1px solid var(--wx-border-default);
  border-radius: 0;
  background: var(--wx-bg-base);
  font-size: var(--wx-fs-14);
  outline: none;
}
.ig-input:focus { border-color: var(--wx-brand-primary); z-index: 1; }</pre>
        </div>
        <div class="fp__meta">
          <span class="fp__meta-label">Patterns:</span>
          <span v-for="p in ['InputAddon','IconPrefix','ButtonSuffix','PrefixSuffix']" :key="p" class="fp__chip">{{ p }}</span>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.fp { min-height: 100vh; background: var(--wx-surface-sunken); }
.fp__main { max-width: 900px; margin: 0 auto; padding: var(--wx-space-5) var(--wx-space-5) var(--wx-space-10); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__hdr { margin-top: var(--wx-space-2); }
.fp__title { margin: 0 0 4px; font-size: var(--wx-fs-22); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.fp__desc { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }
.fp__card { background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); padding: var(--wx-space-5); display: flex; flex-direction: column; gap: var(--wx-space-3); }
.fp__card-title { margin: 0; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .6px; color: var(--wx-text-muted); }
.fp__hint { margin: 0; font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.fp__code-head { display: flex; align-items: center; justify-content: space-between; }
.fp__code-toggle { background: none; border: none; font-family: var(--wx-font-primary); font-size: var(--wx-fs-12); color: var(--wx-brand-primary); cursor: pointer; }
.fp__code-toggle:hover { text-decoration: underline; }
.fp__code { background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); overflow: hidden; }
.fp__code pre { margin: 0; padding: var(--wx-space-4); font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.65; overflow-x: auto; }
.fp__meta { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; padding-top: var(--wx-space-2); border-top: 1px solid var(--wx-border-subtle); }
.fp__meta-label { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.fp__chip { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 10px; background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); font-family: var(--wx-font-mono); }

/* Input group */
.ig-wrap { display: flex; align-items: stretch; }
.ig-addon {
  display: flex; align-items: center;
  padding: 0 12px;
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-default);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}
.ig-addon--left  { border-right: none; border-radius: var(--wx-radius-md) 0 0 var(--wx-radius-md); }
.ig-addon--right { border-left: none;  border-radius: 0 var(--wx-radius-md) var(--wx-radius-md) 0; }
.ig-addon--text  { font-size: var(--wx-fs-13); }
.ig-input {
  flex: 1; min-width: 0;
  padding: 8px 12px;
  border: 1px solid var(--wx-border-default);
  border-radius: 0;
  background: var(--wx-bg-base);
  color: var(--wx-text-primary);
  font-size: var(--wx-fs-14);
  font-family: var(--wx-font-primary);
  outline: none;
  transition: border-color var(--wx-d-fast, 150ms), box-shadow var(--wx-d-fast, 150ms);
}
.ig-input:focus {
  border-color: var(--wx-brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wx-brand-primary) 18%, transparent);
  z-index: 1;
}
/* Suffix button */
.ig-input--btn-right { border-radius: var(--wx-radius-md) 0 0 var(--wx-radius-md); }
.ig-btn {
  padding: 0 16px;
  background: var(--wx-brand-primary);
  color: #fff;
  border: 1px solid var(--wx-brand-primary);
  border-radius: 0 var(--wx-radius-md) var(--wx-radius-md) 0;
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-semibold);
  cursor: pointer;
  white-space: nowrap;
  transition: filter var(--wx-d-fast, 150ms);
}
.ig-btn:hover { filter: brightness(1.08); }
/* Icon suffix button */
.ig-input--icon-right { border-right: none; border-radius: var(--wx-radius-md) 0 0 var(--wx-radius-md); }
.ig-icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 42px;
  background: var(--wx-bg-base);
  border: 1px solid var(--wx-border-default);
  border-left: none;
  border-radius: 0 var(--wx-radius-md) var(--wx-radius-md) 0;
  color: var(--wx-text-muted);
  cursor: pointer;
  transition: color var(--wx-d-fast, 150ms), background var(--wx-d-fast, 150ms);
}
.ig-icon-btn:hover { color: var(--wx-text-primary); background: var(--wx-surface-sunken); }
</style>
