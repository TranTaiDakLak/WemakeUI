<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseButton } from '../../components/common'

const name     = ref('')
const email    = ref('')
const phone    = ref('')
const country  = ref('')
const message  = ref('')
const showCode = ref(false)
</script>

<template>
  <div class="fp">
    <AppTopbar title="WemakeUI" subtitle="forms — floating labels" />
    <main class="fp__main">

      <div class="fp__hdr">
        <h1 class="fp__title">Floating Labels</h1>
        <p class="fp__desc">
          Label trôi lên khi input được focus hoặc có nội dung — CSS-only pattern dùng <code>:placeholder-shown</code> + <code>:focus</code>. Animation dùng <code>--wx-d-fast</code> + <code>--wx-ease-standard</code>.
        </p>
      </div>

      <!-- Live demo -->
      <div class="fp__card">
        <p class="fp__card-title">Live demo</p>
        <div class="fl-grid">
          <div class="fl-group">
            <input id="fl-name" v-model="name" class="fl-input" placeholder=" " autocomplete="name" />
            <label for="fl-name" class="fl-label">Họ và tên</label>
          </div>
          <div class="fl-group">
            <input id="fl-email" v-model="email" class="fl-input" type="email" placeholder=" " autocomplete="email" />
            <label for="fl-email" class="fl-label">Email</label>
          </div>
          <div class="fl-group">
            <input id="fl-phone" v-model="phone" class="fl-input" type="tel" placeholder=" " />
            <label for="fl-phone" class="fl-label">Số điện thoại</label>
          </div>
          <div class="fl-group">
            <select id="fl-country" v-model="country" class="fl-input fl-select">
              <option value="" disabled hidden />
              <option value="vn">Việt Nam</option>
              <option value="us">United States</option>
              <option value="sg">Singapore</option>
            </select>
            <label for="fl-country" class="fl-label" :class="{ 'fl-label--up': country }">Quốc gia</label>
          </div>
        </div>
        <div class="fl-group">
          <textarea id="fl-msg" v-model="message" class="fl-input fl-textarea" placeholder=" " rows="3"></textarea>
          <label for="fl-msg" class="fl-label">Lời nhắn</label>
        </div>

        <div class="fp__actions">
          <BaseButton size="sm">Gửi</BaseButton>
        </div>
      </div>

      <!-- How it works -->
      <div class="fp__card fp__card--info">
        <p class="fp__card-title">Cách hoạt động</p>
        <ul class="fp__list">
          <li>Input có <code>placeholder=" "</code> (khoảng trắng) để trick <code>:not(:placeholder-shown)</code></li>
          <li>Label được đặt <code>position: absolute</code> bên trong <code>.fl-group { position: relative }</code></li>
          <li>Khi <code>:focus</code> hoặc <code>:not(:placeholder-shown)</code> → label translate lên + thu nhỏ</li>
          <li>Màu label khi focus = <code>var(--wx-brand-primary)</code></li>
          <li><code>pointer-events: none</code> trên label để click xuyên qua vào input</li>
        </ul>
      </div>

      <!-- Code -->
      <div class="fp__card">
        <div class="fp__code-head">
          <p class="fp__card-title" style="margin:0">Code snippet (HTML + CSS)</p>
          <button class="fp__code-toggle" @click="showCode = !showCode">{{ showCode ? '▲ Ẩn' : '▼ Hiện' }}</button>
        </div>
        <div v-if="showCode" class="fp__code">
<pre>&lt;!-- HTML --&gt;
&lt;div class="fl-group"&gt;
  &lt;input id="fl-email" v-model="email"
    class="fl-input" type="email"
    placeholder=" " /&gt;          &lt;!-- placeholder=" " là bắt buộc --&gt;
  &lt;label for="fl-email" class="fl-label"&gt;Email&lt;/label&gt;
&lt;/div&gt;

/* CSS */
.fl-group {
  position: relative;
}
.fl-input {
  width: 100%;
  padding: 20px 12px 8px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-bg-base);
  color: var(--wx-text-primary);
  font-size: var(--wx-fs-14);
  outline: none;
  transition: border-color var(--wx-d-fast) var(--wx-ease-standard);
}
.fl-input:focus {
  border-color: var(--wx-brand-primary);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--wx-brand-primary) 18%, transparent);
}
.fl-label {
  position: absolute;
  left: 12px; top: 14px;
  font-size: var(--wx-fs-14);
  color: var(--wx-text-muted);
  pointer-events: none;
  transform-origin: left top;
  transition:
    top     var(--wx-d-fast) var(--wx-ease-standard),
    font-size var(--wx-d-fast) var(--wx-ease-standard),
    color   var(--wx-d-fast) var(--wx-ease-standard);
}
/* Float up when focused OR has value */
.fl-input:focus + .fl-label,
.fl-input:not(:placeholder-shown) + .fl-label {
  top: 6px;
  font-size: var(--wx-fs-11);
  color: var(--wx-brand-primary);
}

@media (prefers-reduced-motion: reduce) {
  .fl-label { transition: none; }
}</pre>
        </div>
        <div class="fp__meta">
          <span class="fp__meta-label">Patterns:</span>
          <span v-for="p in ['FloatingLabel','CssOnly','placeholder-shown','FocusGlow']" :key="p" class="fp__chip">{{ p }}</span>
          <span class="fp__meta-label" style="margin-left:8px">Motion:</span>
          <span v-for="t in ['--wx-d-fast','--wx-ease-standard']" :key="t" class="fp__chip">{{ t }}</span>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.fp { min-height: 100vh; background: var(--wx-surface-sunken); }
.fp__main { max-width: 720px; margin: 0 auto; padding: var(--wx-space-5) var(--wx-space-5) var(--wx-space-10); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__hdr { margin-top: var(--wx-space-2); }
.fp__title { margin: 0 0 4px; font-size: var(--wx-fs-22); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.fp__desc  { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); line-height: 1.6; }
.fp__card { background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); padding: var(--wx-space-5); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__card--info { background: color-mix(in srgb, var(--wx-brand-primary) 5%, var(--wx-surface-elevated)); border-color: color-mix(in srgb, var(--wx-brand-primary) 20%, transparent); }
.fp__card-title { margin: 0; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .6px; color: var(--wx-text-muted); }
.fp__list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.fp__list li { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); line-height: 1.5; }
.fp__actions { display: flex; justify-content: flex-end; }

.fp__code-head { display: flex; align-items: center; justify-content: space-between; }
.fp__code-toggle { background: none; border: none; font-family: var(--wx-font-primary); font-size: var(--wx-fs-12); color: var(--wx-brand-primary); cursor: pointer; }
.fp__code-toggle:hover { text-decoration: underline; }
.fp__code { background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); overflow: hidden; }
.fp__code pre { margin: 0; padding: var(--wx-space-4); font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.65; overflow-x: auto; }
.fp__meta { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; padding-top: var(--wx-space-2); border-top: 1px solid var(--wx-border-subtle); }
.fp__meta-label { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.fp__chip { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 10px; background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); font-family: var(--wx-font-mono); }

/* Floating label grid */
.fl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-3); }
@media (max-width: 560px) { .fl-grid { grid-template-columns: 1fr; } }

/* Floating label pattern */
.fl-group { position: relative; }
.fl-input {
  display: block; width: 100%;
  padding: 20px 12px 8px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-bg-base);
  color: var(--wx-text-primary);
  font-size: var(--wx-fs-14);
  font-family: var(--wx-font-primary);
  outline: none;
  box-sizing: border-box;
  transition: border-color var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1)),
              box-shadow   var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1));
}
.fl-input:focus {
  border-color: var(--wx-brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wx-brand-primary) 18%, transparent);
}
.fl-select { appearance: none; cursor: pointer; }
.fl-textarea { resize: vertical; min-height: 80px; }

.fl-label {
  position: absolute;
  left: 12px; top: 14px;
  font-size: var(--wx-fs-14);
  color: var(--wx-text-muted);
  pointer-events: none;
  transition:
    top       var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1)),
    font-size var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1)),
    color     var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1));
}
.fl-input:focus + .fl-label,
.fl-input:not(:placeholder-shown) + .fl-label {
  top: 6px;
  font-size: var(--wx-fs-11);
  color: var(--wx-brand-primary);
}
.fl-label--up {
  top: 6px !important;
  font-size: var(--wx-fs-11) !important;
  color: var(--wx-brand-primary) !important;
}

@media (prefers-reduced-motion: reduce) {
  .fl-label { transition: none; }
  .fl-input { transition: none; }
}
</style>
