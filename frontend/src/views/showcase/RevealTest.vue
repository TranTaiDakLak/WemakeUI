<script setup lang="ts">
/**
 * Test page for v-reveal directive
 * Visit: /showcase/reveal-test
 */
</script>

<template>
  <div style="padding: 40px; max-width: 800px; margin: 0 auto;">
    <h1>Scroll Reveal Test</h1>
    <p>Cuộn xuống để thấy các box hiện ra dần.</p>

    <!-- Spacer to push content below fold -->
    <div style="height: 100vh; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc; border-radius: 12px; margin: 40px 0;">
      <p style="font-size: 24px; color: #999;">↓ Cuộn xuống ↓</p>
    </div>

    <!-- Test boxes with v-reveal -->
    <div v-reveal style="padding: 40px; background: var(--wx-brand-50); border-radius: 12px; margin-bottom: 24px;">
      <h2>Box 1 — v-reveal</h2>
      <p>Nếu bạn thấy box này bay lên từ dưới + fade in → directive hoạt động.</p>
    </div>

    <div v-reveal="200" style="padding: 40px; background: var(--wx-info-bg); border-radius: 12px; margin-bottom: 24px;">
      <h2>Box 2 — v-reveal="200" (delay 200ms)</h2>
      <p>Box này delay 200ms sau box 1.</p>
    </div>

    <div v-reveal="400" style="padding: 40px; background: var(--wx-success-bg); border-radius: 12px; margin-bottom: 24px;">
      <h2>Box 3 — v-reveal="400" (delay 400ms)</h2>
      <p>Box này delay 400ms.</p>
    </div>

    <div style="height: 50vh;"></div>

    <div v-reveal style="padding: 40px; background: var(--wx-warning-bg); border-radius: 12px; margin-bottom: 24px;">
      <h2>Box 4 — thêm spacer ở trên</h2>
      <p>Cuộn thêm nữa mới thấy box này.</p>
    </div>

    <div v-reveal="100" style="padding: 40px; background: var(--wx-danger-bg); border-radius: 12px; margin-bottom: 24px;">
      <h2>Box 5 — stagger 100ms</h2>
      <p>Hiện sau box 4 một chút.</p>
    </div>
  </div>
</template>
