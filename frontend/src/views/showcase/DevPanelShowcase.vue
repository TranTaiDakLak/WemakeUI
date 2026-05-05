<script setup lang="ts">
/* Phase 8 · DevPanel showcase — explains and demonstrates the debug panel */
</script>

<template>
  <div class="dp-showcase">
    <h1 class="page-title">DevPanel</h1>
    <p class="page-desc">Panel debug dành cho developer — chỉ hiển thị khi <code>import.meta.env.DEV = true</code>. Mở bằng <kbd>Shift</kbd> + <kbd>Ctrl</kbd> + <kbd>D</kbd> hoặc click nút FAB góc dưới phải.</p>

    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-icon">🗂️</div>
        <div class="feature-title">State Snapshot</div>
        <p class="feature-desc">Chụp nhanh trạng thái stores (theme, auth, UI flags). Refresh thủ công hoặc tự động mỗi 2 giây.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🌐</div>
        <div class="feature-title">Network Monitor</div>
        <p class="feature-desc">Patch <code>window.fetch</code> để capture mọi request: method, URL, status, thời gian ms. Hiển thị 50 request gần nhất.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <div class="feature-title">Performance</div>
        <p class="feature-desc">Đo FPS realtime qua <code>requestAnimationFrame</code>, sparkline 30 điểm. Heap memory, load time, DOM size.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🚩</div>
        <div class="feature-title">Feature Flags</div>
        <p class="feature-desc">Toggle feature flags trong runtime mà không cần restart server. Lưu vào <code>sessionStorage</code>.</p>
      </div>
    </div>

    <div class="usage-section">
      <h2 class="section-title">Cách kích hoạt</h2>
      <div class="shortcut-demo">
        <div class="shortcut-row">
          <div class="shortcut-keys">
            <kbd>Shift</kbd> <span>+</span> <kbd>Ctrl</kbd> <span>+</span> <kbd>D</kbd>
          </div>
          <span class="shortcut-label">Toggle DevPanel</span>
        </div>
        <div class="shortcut-row">
          <div class="shortcut-keys">
            <kbd>ESC</kbd>
          </div>
          <span class="shortcut-label">Đóng panel</span>
        </div>
        <div class="shortcut-row">
          <div class="shortcut-keys">
            <span class="fab-preview">⚙</span>
          </div>
          <span class="shortcut-label">FAB button góc dưới phải màn hình</span>
        </div>
      </div>
    </div>

    <div class="usage-section">
      <h2 class="section-title">Tích hợp vào App.vue</h2>
      <pre class="code-block"><code>&lt;script setup lang="ts"&gt;
import DevPanel from './components/debug/DevPanel.vue'
&lt;/script&gt;

&lt;template&gt;
  &lt;div id="app"&gt;
    &lt;router-view /&gt;
    &lt;DevPanel /&gt;  &lt;!-- tự guard import.meta.env.DEV --&gt;
  &lt;/div&gt;
&lt;/template&gt;</code></pre>
    </div>

    <div class="usage-section">
      <h2 class="section-title">Network Monitor — ví dụ output</h2>
      <div class="network-demo">
        <div class="net-row header">
          <span>Method</span><span>URL</span><span>Status</span><span>Time</span>
        </div>
        <div class="net-row">
          <span class="method get">GET</span>
          <span class="url">/api/users?page=1</span>
          <span class="status ok">200</span>
          <span class="time">42ms</span>
        </div>
        <div class="net-row">
          <span class="method post">POST</span>
          <span class="url">/api/auth/refresh</span>
          <span class="status ok">200</span>
          <span class="time">118ms</span>
        </div>
        <div class="net-row">
          <span class="method get">GET</span>
          <span class="url">/api/config</span>
          <span class="status err">404</span>
          <span class="time">15ms</span>
        </div>
      </div>
    </div>

    <div class="note-box">
      <span class="note-icon">💡</span>
      <span>DevPanel được <code>Teleport</code> ra ngoài <code>#app</code> và <strong>không render</strong> trong production build (<code>import.meta.env.PROD</code>). Không ảnh hưởng bundle size production.</span>
    </div>
  </div>
</template>

<style scoped>
.dp-showcase { max-width: 860px; display: flex; flex-direction: column; gap: var(--wx-space-6); }
.page-title { font-size: var(--wx-fs-28); font-weight: var(--wx-fw-bold); margin: 0; }
.page-desc { font-size: var(--wx-fs-15); color: var(--wx-content-secondary); margin: 0; line-height: 1.6; }
.page-desc code { font-family: var(--wx-font-mono); font-size: 0.9em; background: var(--wx-bg-sunken); padding: 1px 5px; border-radius: 4px; }

.feature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--wx-space-4); }
.feature-card { background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); padding: var(--wx-space-4); display: flex; flex-direction: column; gap: var(--wx-space-2); }
.feature-icon { font-size: 28px; }
.feature-title { font-weight: var(--wx-fw-semibold); font-size: var(--wx-fs-15); }
.feature-desc { font-size: var(--wx-fs-13); color: var(--wx-content-secondary); margin: 0; line-height: 1.5; }
.feature-desc code { font-family: var(--wx-font-mono); font-size: 0.85em; background: var(--wx-bg-sunken); padding: 1px 4px; border-radius: 3px; }

.usage-section { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.section-title { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); margin: 0; }

.shortcut-demo { display: flex; flex-direction: column; gap: var(--wx-space-3); background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); padding: var(--wx-space-4); }
.shortcut-row { display: flex; align-items: center; gap: var(--wx-space-4); }
.shortcut-keys { display: flex; align-items: center; gap: var(--wx-space-1); min-width: 200px; }
.shortcut-label { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); }
kbd { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); background: var(--wx-bg-sunken); border: 1px solid var(--wx-border-default); border-radius: 4px; padding: 3px 8px; color: var(--wx-content-primary); }
.fab-preview { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: var(--wx-brand-600); color: #fff; border-radius: 50%; font-size: 16px; }

.code-block { background: #0d1117; color: #c9d1d9; font-family: var(--wx-font-mono); font-size: var(--wx-fs-13); padding: var(--wx-space-4); border-radius: var(--wx-radius-lg); overflow-x: auto; line-height: 1.6; margin: 0; }

.network-demo { background: #0d1117; color: #c9d1d9; font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); border-radius: var(--wx-radius-lg); overflow: hidden; }
.net-row { display: grid; grid-template-columns: 70px 1fr 70px 70px; gap: var(--wx-space-3); padding: var(--wx-space-2) var(--wx-space-4); border-bottom: 1px solid rgba(255,255,255,0.06); }
.net-row.header { color: #6e7681; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-semibold); background: rgba(255,255,255,0.03); }
.method { font-weight: var(--wx-fw-semibold); }
.method.get { color: #3fb950; }
.method.post { color: #58a6ff; }
.url { color: #e6edf3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.status.ok { color: #3fb950; }
.status.err { color: #f85149; }
.time { color: #6e7681; text-align: right; }

.note-box { display: flex; align-items: flex-start; gap: var(--wx-space-3); background: color-mix(in srgb, var(--wx-brand-600) 8%, transparent); border: 1px solid color-mix(in srgb, var(--wx-brand-600) 25%, transparent); border-radius: var(--wx-radius-lg); padding: var(--wx-space-4); font-size: var(--wx-fs-13); line-height: 1.6; }
.note-box code { font-family: var(--wx-font-mono); font-size: 0.9em; }
.note-icon { font-size: 18px; flex-shrink: 0; }
</style>
