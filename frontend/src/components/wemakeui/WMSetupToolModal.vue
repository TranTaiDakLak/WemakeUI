<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseButton, BaseInput, BaseSelectMenu, BaseCheckbox, BaseRadio, BaseTextarea, GroupBox, BaseModal } from '../common'
import { useSettingsStore } from '../../stores/wemakeui/settings'
import { IP_PROVIDERS, CAPTCHA_PROVIDERS } from '../../types/settings'
import type { IpProvider } from '../../types/settings'

const show = defineModel<boolean>({ required: true })
const settingsStore = useSettingsStore()

const g = ref({ ...settingsStore.general })
const ip = ref({ ...settingsStore.ipConfig, xproxy: { ...settingsStore.ipConfig.xproxy } })

const ipProviderOptions = IP_PROVIDERS.map(p => ({ value: p, label: p === 'none' ? 'Không dùng' : p }))
const captchaProviderOptions = CAPTCHA_PROVIDERS.map(p => ({ value: p, label: p }))
const loginPlatformOptions = [
  { value: 'facebook',  label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'bm',        label: 'Business Manager' },
]
const loginMethodOptions = [
  { value: 'cookie',   label: 'Cookie' },
  { value: 'password', label: 'Mật khẩu' },
  { value: 'token',    label: 'Token' },
  { value: 'oauth2',   label: 'OAuth2' },
]

function save() {
  settingsStore.updateGeneral({ ...g.value })
  settingsStore.updateIpConfig({ ...ip.value })
  show.value = false
}
</script>

<template>
  <BaseModal :show="show" title="⚙ Cài đặt chung" size="xl" @close="show = false">
    <div class="tool-layout">
      <!-- LEFT COLUMN -->
      <div class="tool-left">
        <GroupBox title="Chung">
          <div class="form-row">
            <label>Số luồng request</label>
            <BaseInput v-model="g.threadRequest" type="number" size="sm" style="width:80px" />
          </div>
          <div class="form-row">
            <label>Delay (ms)</label>
            <BaseInput v-model="g.delayRequest" type="number" size="sm" style="width:80px" />
          </div>
        </GroupBox>

        <GroupBox title="Kiểm tra thông tin">
          <div class="form-row">
            <label>Luồng ẩn</label>
            <BaseInput v-model="g.threadCheckInfo" type="number" size="sm" style="width:80px" />
          </div>
        </GroupBox>

        <GroupBox title="Dạng đăng nhập">
          <BaseRadio
            v-model="g.loginPlatform"
            name="platform"
            :options="loginPlatformOptions"
            direction="vertical"
          />
          <div class="form-row mt-2">
            <label>Phương thức</label>
            <BaseSelectMenu v-model="g.loginMethod" :options="loginMethodOptions" size="sm" />
          </div>
        </GroupBox>

        <GroupBox title="Khác">
          <BaseCheckbox v-model="g.saveRunColumn" label="Lưu cột khi chạy" />
          <BaseCheckbox v-model="g.backupDB" label="Sao lưu dữ liệu tự động" />
        </GroupBox>

        <GroupBox title="Captcha">
          <div class="form-row">
            <label>Nhà cung cấp</label>
            <BaseSelectMenu v-model="g.captchaProvider" :options="captchaProviderOptions" size="sm" />
          </div>
          <div class="form-row">
            <label>API Key</label>
            <BaseInput
              :model-value="g.captchaKeys[g.captchaProvider] ?? ''"
              placeholder="Nhập API key..."
              size="sm"
              @update:model-value="v => (g.captchaKeys[g.captchaProvider] = String(v))"
            />
          </div>
        </GroupBox>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="tool-right">
        <GroupBox title="Đổi IP">
          <BaseCheckbox v-model="g.checkIpBeforeRun" label="Kiểm tra IP trước khi chạy" />
          <div class="form-row mt-2">
            <label>Delay đổi IP (ms)</label>
            <BaseInput v-model="g.delayChangeIp" type="number" size="sm" style="width:100px" />
          </div>
          <div class="form-row">
            <label>Nhà cung cấp</label>
            <BaseSelectMenu v-model="g.ipProvider" :options="ipProviderOptions" size="sm" />
          </div>

          <!-- FPT -->
          <template v-if="g.ipProvider === 'fpt'">
            <div class="form-col mt-2">
              <label>Danh sách key FPT</label>
              <BaseTextarea v-model="ip.fptKeys" :rows="4" :autosize="false" placeholder="Mỗi key một dòng..." style="font-family:var(--wx-font-mono)" />
            </div>
          </template>

          <!-- xProxy -->
          <template v-else-if="g.ipProvider === 'xproxy'">
            <div class="form-row mt-2">
              <label>Service URL</label>
              <BaseInput v-model="ip.xproxy.serviceUrl" size="sm" placeholder="http://..." />
            </div>
            <div class="form-row">
              <label>Type</label>
              <BaseSelectMenu v-model="ip.xproxy.type" :options="[{value:'http',label:'HTTP'},{value:'socks5',label:'SOCKS5'}]" size="sm" />
            </div>
            <div class="form-col">
              <label>Proxy list</label>
              <BaseTextarea v-model="ip.xproxy.list" :rows="3" :autosize="false" style="font-family:var(--wx-font-mono)" />
            </div>
          </template>

          <!-- Proxy / proxy_fixed -->
          <template v-else-if="g.ipProvider === 'proxy' || g.ipProvider === 'proxy_fixed'">
            <div class="form-col mt-2">
              <label>Danh sách proxy (host:port)</label>
              <BaseTextarea v-model="ip.proxyList" :rows="4" :autosize="false" style="font-family:var(--wx-font-mono)" />
            </div>
            <div class="form-row">
              <label>Type</label>
              <BaseSelectMenu v-model="ip.proxyType" :options="[{value:'http',label:'HTTP'},{value:'socks5',label:'SOCKS5'}]" size="sm" />
            </div>
          </template>

          <!-- tinsoft -->
          <template v-else-if="g.ipProvider === 'tinsoft'">
            <div class="form-col mt-2">
              <label>Keys Tinsoft</label>
              <BaseTextarea v-model="ip.tinsoftKeys" :rows="3" :autosize="false" style="font-family:var(--wx-font-mono)" />
            </div>
            <div class="form-row">
              <label>Luồng/IP</label>
              <BaseInput v-model="ip.tinsoftThreadPerIp" type="number" size="sm" style="width:70px" />
            </div>
          </template>

          <!-- shoplike -->
          <template v-else-if="g.ipProvider === 'shoplike'">
            <div class="form-col mt-2">
              <label>Keys Shoplike</label>
              <BaseTextarea v-model="ip.shoplikeKeys" :rows="3" :autosize="false" style="font-family:var(--wx-font-mono)" />
            </div>
            <div class="form-row">
              <label>Luồng/IP</label>
              <BaseInput v-model="ip.shoplikeThreadPerIp" type="number" size="sm" style="width:70px" />
            </div>
          </template>

          <!-- netproxy -->
          <template v-else-if="g.ipProvider === 'netproxy' || g.ipProvider === 'netproxy_gb'">
            <div class="form-col mt-2">
              <label>Keys Netproxy</label>
              <BaseTextarea v-model="ip.netproxyKeys" :rows="3" :autosize="false" style="font-family:var(--wx-font-mono)" />
            </div>
          </template>

          <!-- minproxy -->
          <template v-else-if="g.ipProvider === 'minproxy'">
            <div class="form-col mt-2">
              <label>Keys Minproxy</label>
              <BaseTextarea v-model="ip.minproxyKeys" :rows="3" :autosize="false" style="font-family:var(--wx-font-mono)" />
            </div>
          </template>

          <!-- proxyfarm -->
          <template v-else-if="g.ipProvider === 'proxyfarm'">
            <div class="form-col mt-2">
              <label>Keys Proxyfarm</label>
              <BaseTextarea v-model="ip.proxyfarmKeys" :rows="3" :autosize="false" style="font-family:var(--wx-font-mono)" />
            </div>
          </template>

          <!-- proxy_popular -->
          <template v-else-if="g.ipProvider === 'proxy_popular'">
            <div class="form-row mt-2">
              <label>Token</label>
              <BaseInput v-model="ip.proxyPopularToken" size="sm" />
            </div>
            <div class="form-col">
              <label>Keys</label>
              <BaseTextarea v-model="ip.proxyPopularKeys" :rows="3" :autosize="false" style="font-family:var(--wx-font-mono)" />
            </div>
          </template>
        </GroupBox>
      </div>
    </div>

    <template #footer>
      <div class="tool-footer">
        <BaseButton variant="ghost" size="sm">Gán cài đặt chung</BaseButton>
        <div class="spacer" />
        <BaseButton variant="ghost" size="sm" @click="show = false">Đóng</BaseButton>
        <BaseButton variant="primary" size="sm" @click="save">Lưu</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.tool-layout {
  display: grid;
  grid-template-columns: 45% 1fr;
  gap: var(--wx-space-4);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
.tool-left, .tool-right { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.form-row { display: flex; align-items: center; gap: var(--wx-space-3); font-size: var(--wx-fs-13); }
.form-row label { min-width: 130px; color: var(--wx-text-secondary); }
.form-col { display: flex; flex-direction: column; gap: 4px; font-size: var(--wx-fs-13); }
.form-col label { color: var(--wx-text-secondary); }
.radio-col { display: flex; flex-direction: column; gap: 6px; }
.mt-2 { margin-top: var(--wx-space-2); }
.tool-footer { display: flex; align-items: center; gap: var(--wx-space-2); width: 100%; }
.spacer { flex: 1; }
</style>
