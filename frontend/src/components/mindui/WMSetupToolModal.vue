<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, BaseInput, BaseSelectMenu, BaseTextarea, BaseOptionRow } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'
import { useSettingsStore } from '../../stores/mindui/settings'
import { IP_PROVIDERS, CAPTCHA_PROVIDERS } from '../../types/settings'
import type { LoginPlatform } from '../../types/settings'
import MindDialog from './MindDialog.vue'
import MindField from './MindField.vue'
import MindSection from './MindSection.vue'

const show = defineModel<boolean>({ required: true })
const settingsStore = useSettingsStore()

const g = ref({ ...settingsStore.general })
const ip = ref({ ...settingsStore.ipConfig, xproxy: { ...settingsStore.ipConfig.xproxy } })

const ipProviderOptions = IP_PROVIDERS.map(p => ({ value: p, label: p === 'none' ? 'Không dùng' : p }))
const captchaProviderOptions = CAPTCHA_PROVIDERS.map(p => ({ value: p, label: p }))
const loginPlatformOptions: { value: LoginPlatform; label: string; description: string }[] = [
  { value: 'internal',  label: 'Nguồn nội bộ',    description: 'Dữ liệu lưu trong hệ thống' },
  { value: 'external',  label: 'Nguồn ngoài',     description: 'Đồng bộ từ dịch vụ bên thứ ba' },
  { value: 'aggregate', label: 'Nguồn tổng hợp',  description: 'Gộp nhiều nguồn thành một' },
]
const loginMethodOptions = [
  { value: 'cookie',   label: 'Phiên làm việc' },
  { value: 'password', label: 'Khoá truy cập' },
  { value: 'token',    label: 'Mã truy cập' },
  { value: 'oauth2',   label: 'OAuth2' },
]
const proxyTypeOptions = [
  { value: 'http',   label: 'HTTP' },
  { value: 'socks5', label: 'SOCKS5' },
]

function save() {
  settingsStore.updateGeneral({ ...g.value })
  settingsStore.updateIpConfig({ ...ip.value })
  show.value = false
}
</script>

<template>
  <MindDialog
    v-model="show"
    title="Cài đặt chung"
    subtitle="Luồng xử lý, kết nối nguồn dữ liệu, captcha và đổi IP"
    :icon="SHELL_ICONS.settings"
    size="xl"
  >
    <div class="tool-layout">
      <!-- CỘT TRÁI -->
      <div class="tool-left">
        <MindSection title="Chung" boxed>
          <MindField label="Số luồng request">
            <BaseInput v-model="g.threadRequest" type="number" size="sm" style="width: 110px; flex: 0 0 auto" />
          </MindField>
          <MindField label="Delay (ms)">
            <BaseInput v-model="g.delayRequest" type="number" size="sm" style="width: 110px; flex: 0 0 auto" />
          </MindField>
        </MindSection>

        <MindSection title="Kiểm tra dữ liệu" boxed>
          <MindField label="Luồng ẩn">
            <BaseInput v-model="g.threadCheckInfo" type="number" size="sm" style="width: 110px; flex: 0 0 auto" />
          </MindField>
        </MindSection>

        <MindSection title="Kết nối nguồn dữ liệu" boxed>
          <div class="tool-radios" role="radiogroup" aria-label="Nguồn dữ liệu">
            <BaseOptionRow
              v-for="opt in loginPlatformOptions"
              :key="opt.value"
              indicator="radio"
              :model-value="g.loginPlatform === opt.value"
              :label="opt.label"
              :description="opt.description"
              @update:model-value="g.loginPlatform = opt.value"
            />
          </div>
          <MindField label="Phương thức">
            <BaseSelectMenu v-model="g.loginMethod" :options="loginMethodOptions" size="sm" />
          </MindField>
        </MindSection>

        <MindSection title="Khác" boxed>
          <BaseOptionRow v-model="g.saveRunColumn" label="Lưu cột khi chạy" description="Giữ lại cấu hình cột sau mỗi lần chạy" />
          <BaseOptionRow v-model="g.backupDB" label="Sao lưu dữ liệu tự động" description="Tạo bản sao dự phòng định kỳ" />
        </MindSection>

      </div>

      <!-- CỘT PHẢI -->
      <div class="tool-right">
        <MindSection title="Đổi IP" boxed>
          <BaseOptionRow v-model="g.checkIpBeforeRun" label="Kiểm tra IP trước khi chạy" description="Bỏ qua nếu địa chỉ IP chưa thay đổi" />
          <MindField label="Delay đổi IP (ms)">
            <BaseInput v-model="g.delayChangeIp" type="number" size="sm" style="width: 110px; flex: 0 0 auto" />
          </MindField>
          <MindField label="Nhà cung cấp">
            <BaseSelectMenu v-model="g.ipProvider" :options="ipProviderOptions" size="sm" />
          </MindField>

          <!-- FPT -->
          <template v-if="g.ipProvider === 'fpt'">
            <MindField label="Danh sách key FPT" stacked>
              <BaseTextarea v-model="ip.fptKeys" :rows="4" :autosize="false" placeholder="Mỗi key một dòng..." style="font-family: var(--wx-font-mono)" />
            </MindField>
          </template>

          <!-- xProxy -->
          <template v-else-if="g.ipProvider === 'xproxy'">
            <MindField label="Service URL">
              <BaseInput v-model="ip.xproxy.serviceUrl" size="sm" placeholder="http://..." />
            </MindField>
            <MindField label="Loại">
              <BaseSelectMenu v-model="ip.xproxy.type" :options="proxyTypeOptions" size="sm" />
            </MindField>
            <MindField label="Danh sách proxy" stacked>
              <BaseTextarea v-model="ip.xproxy.list" :rows="3" :autosize="false" style="font-family: var(--wx-font-mono)" />
            </MindField>
          </template>

          <!-- Proxy / proxy_fixed -->
          <template v-else-if="g.ipProvider === 'proxy' || g.ipProvider === 'proxy_fixed'">
            <MindField label="Danh sách proxy (host:port)" stacked>
              <BaseTextarea v-model="ip.proxyList" :rows="4" :autosize="false" style="font-family: var(--wx-font-mono)" />
            </MindField>
            <MindField label="Loại">
              <BaseSelectMenu v-model="ip.proxyType" :options="proxyTypeOptions" size="sm" />
            </MindField>
          </template>

          <!-- tinsoft -->
          <template v-else-if="g.ipProvider === 'tinsoft'">
            <MindField label="Keys Tinsoft" stacked>
              <BaseTextarea v-model="ip.tinsoftKeys" :rows="3" :autosize="false" style="font-family: var(--wx-font-mono)" />
            </MindField>
            <MindField label="Luồng/IP">
              <BaseInput v-model="ip.tinsoftThreadPerIp" type="number" size="sm" style="width: 110px; flex: 0 0 auto" />
            </MindField>
          </template>

          <!-- shoplike -->
          <template v-else-if="g.ipProvider === 'shoplike'">
            <MindField label="Keys Shoplike" stacked>
              <BaseTextarea v-model="ip.shoplikeKeys" :rows="3" :autosize="false" style="font-family: var(--wx-font-mono)" />
            </MindField>
            <MindField label="Luồng/IP">
              <BaseInput v-model="ip.shoplikeThreadPerIp" type="number" size="sm" style="width: 110px; flex: 0 0 auto" />
            </MindField>
          </template>

          <!-- netproxy -->
          <template v-else-if="g.ipProvider === 'netproxy' || g.ipProvider === 'netproxy_gb'">
            <MindField label="Keys Netproxy" stacked>
              <BaseTextarea v-model="ip.netproxyKeys" :rows="3" :autosize="false" style="font-family: var(--wx-font-mono)" />
            </MindField>
          </template>

          <!-- minproxy -->
          <template v-else-if="g.ipProvider === 'minproxy'">
            <MindField label="Keys Minproxy" stacked>
              <BaseTextarea v-model="ip.minproxyKeys" :rows="3" :autosize="false" style="font-family: var(--wx-font-mono)" />
            </MindField>
          </template>

          <!-- proxyfarm -->
          <template v-else-if="g.ipProvider === 'proxyfarm'">
            <MindField label="Keys Proxyfarm" stacked>
              <BaseTextarea v-model="ip.proxyfarmKeys" :rows="3" :autosize="false" style="font-family: var(--wx-font-mono)" />
            </MindField>
          </template>

          <!-- proxy_popular -->
          <template v-else-if="g.ipProvider === 'proxy_popular'">
            <MindField label="Mã truy cập">
              <BaseInput v-model="ip.proxyPopularToken" size="sm" />
            </MindField>
            <MindField label="Keys" stacked>
              <BaseTextarea v-model="ip.proxyPopularKeys" :rows="3" :autosize="false" style="font-family: var(--wx-font-mono)" />
            </MindField>
          </template>

          <p v-else-if="g.ipProvider === 'none'" class="tool-note">
            Chọn một nhà cung cấp để cấu hình danh sách key / proxy tương ứng.
          </p>
        </MindSection>

        <MindSection title="Captcha" boxed>
          <MindField label="Nhà cung cấp">
            <BaseSelectMenu v-model="g.captchaProvider" :options="captchaProviderOptions" size="sm" />
          </MindField>
          <MindField label="API Key">
            <BaseInput
              :model-value="g.captchaKeys[g.captchaProvider] ?? ''"
              placeholder="Nhập API key..."
              size="sm"
              @update:model-value="v => (g.captchaKeys[g.captchaProvider] = String(v))"
            />
          </MindField>
        </MindSection>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="ghost" size="sm" class="tool-assign">Gán cài đặt chung</BaseButton>
      <BaseButton variant="ghost" size="sm" @click="show = false">Đóng</BaseButton>
      <BaseButton variant="primary" size="sm" @click="save">Lưu</BaseButton>
    </template>
  </MindDialog>
</template>

<style scoped>
.tool-layout {
  display: grid;
  grid-template-columns: minmax(0, 45%) minmax(0, 1fr);
  gap: var(--wx-space-4);
  align-items: start;
}
.tool-left, .tool-right { display: flex; flex-direction: column; gap: var(--wx-space-3); min-width: 0; }
.tool-radios { display: flex; flex-direction: column; gap: 2px; }
.tool-note { margin: 0; font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
/* nút phụ nằm sát trái chân hộp thoại, cụm Đóng/Lưu bên phải */
.tool-assign { margin-right: auto; }

@media (max-width: 860px) {
  .tool-layout { grid-template-columns: minmax(0, 1fr); }
}
</style>
