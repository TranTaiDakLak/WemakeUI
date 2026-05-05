<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BaseModal, GroupBox } from '../common'
import { useToast } from '../../composables'
import { useSettingsStore } from '../../stores/settings'
import type { ConfigGeneral, IpConfig, CaptchaProviderType, LoginPlatform, IpProviderType } from '../../types/settings'
import { LOGIN_METHODS, CAPTCHA_PROVIDERS, IP_PROVIDERS, defaultGeneral, defaultIpConfig } from '../../types/settings'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [], save: [] }>()

const settingsStore = useSettingsStore()
const { showToast } = useToast()

/* ── Local form state (cloned from store on open, written back on save) ── */
const form = ref<ConfigGeneral>(defaultGeneral())
const ipForm = ref<IpConfig>(defaultIpConfig())

watch(() => props.show, (val) => {
  if (val) {
    form.value = JSON.parse(JSON.stringify(settingsStore.general))
    ipForm.value = JSON.parse(JSON.stringify(settingsStore.ipConfig))
  }
})

/* ── Captcha key for current provider ── */
const captchaKey = computed({
  get: () => form.value.captchaKeys[form.value.captchaProvider],
  set: (v: string) => { form.value.captchaKeys[form.value.captchaProvider] = v },
})

/* ── Line counter for textarea fields ── */
function lc(text: string): number {
  return text.split('\n').filter(l => l.trim()).length
}

/* ── Save / Close ── */
function onSave() {
  settingsStore.updateGeneral(form.value)
  settingsStore.updateIpConfig(ipForm.value)
  emit('save')
}
</script>

<template>
  <BaseModal :show="show" title="Cài đặt chung" size="lg" @close="$emit('close')">
    <div class="setup-layout">
      <!-- ═══ CỘT TRÁI ═══ -->
      <div class="setup-col-left">
        <!-- Section 1: Chung -->
        <GroupBox title="Chung">
          <div class="form-row">
            <span class="form-label">Số luồng Request</span>
            <input type="number" class="form-input form-input--sm" v-model.number="form.threadRequest" min="1" />
          </div>
          <div class="form-row">
            <span class="form-label">Nghỉ giữa request (ms)</span>
            <input type="number" class="form-input form-input--sm" v-model.number="form.delayRequest" min="0" />
          </div>
        </GroupBox>

        <!-- Section 2: Kiểm tra thông tin -->
        <GroupBox title="Kiểm tra thông tin">
          <div class="form-row">
            <span class="form-label">Số luồng kiểm tra ẩn:</span>
            <input type="number" class="form-input form-input--sm" v-model.number="form.threadCheckInfo" min="1" />
          </div>
        </GroupBox>

        <!-- Section 3: Dạng đăng nhập -->
        <GroupBox title="Dạng đăng nhập">
          <div class="form-row">
            <label class="radio-label">
              <input type="radio" v-model="form.loginPlatform" value="facebook" /> Facebook
            </label>
            <label class="radio-label">
              <input type="radio" v-model="form.loginPlatform" value="instagram" /> Instagram
            </label>
            <label class="radio-label">
              <input type="radio" v-model="form.loginPlatform" value="bm" /> BM
            </label>
          </div>
          <div class="form-row">
            <span class="form-label">Dạng đăng nhập:</span>
            <select class="form-input" v-model.number="form.loginMethod">
              <option v-for="m in LOGIN_METHODS" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </div>
        </GroupBox>

        <!-- Section 4: Khác -->
        <GroupBox title="Khác">
          <div class="form-row">
            <label class="chk-label"><input type="checkbox" v-model="form.saveRunColumn" /> Lưu cột [Hoạt động]</label>
          </div>
          <div class="form-row">
            <label class="chk-label"><input type="checkbox" v-model="form.backupDB" /> Backup Database</label>
          </div>
        </GroupBox>

        <!-- Section 5: Captcha -->
        <GroupBox title="Captcha">
          <div class="form-row">
            <span class="form-label">Trang web</span>
            <select class="form-input" v-model="form.captchaProvider">
              <option v-for="cp in CAPTCHA_PROVIDERS" :key="cp.value" :value="cp.value">{{ cp.label }}</option>
            </select>
          </div>
          <div class="form-row">
            <span class="form-label">Api key</span>
            <input type="text" class="form-input" v-model="captchaKey" placeholder="Nhập API key..." />
          </div>
        </GroupBox>
      </div>

      <!-- ═══ CỘT PHẢI: Đổi IP ═══ -->
      <div class="setup-col-right">
        <GroupBox title="Đổi IP" :fill="true">
          <div class="form-row">
            <label class="chk-label"><input type="checkbox" v-model="form.checkIpBeforeRun" /> Kiểm tra IP trước khi chạy</label>
          </div>
          <div class="form-row">
            <span class="form-label">Delay sau đổi IP (giây)</span>
            <input type="number" class="form-input form-input--sm" v-model.number="form.delayChangeIp" min="0" />
          </div>
          <div class="form-row">
            <span class="form-label">Chọn đổi IP</span>
            <select class="form-input" v-model="form.ipProvider">
              <option v-for="ip in IP_PROVIDERS" :key="ip.value" :value="ip.value">{{ ip.label }}</option>
            </select>
          </div>

          <!-- IP provider tab content -->
          <div class="ip-tab-content">
            <!-- none -->
            <template v-if="form.ipProvider === 'none'">
              <div class="ip-tab-empty">Không sử dụng đổi IP</div>
            </template>

            <!-- FPT -->
            <template v-else-if="form.ipProvider === 'fpt'">
              <div class="ip-lbl">Nhập mã FPT ({{ lc(ipForm.fptKeys) }}):</div>
              <textarea class="form-textarea" rows="6" v-model="ipForm.fptKeys" placeholder="Mỗi key một dòng..." />
            </template>

            <!-- XProxy -->
            <template v-else-if="form.ipProvider === 'xproxy'">
              <div class="form-row">
                <span class="form-label">Service URL</span>
                <input type="text" class="form-input" v-model="ipForm.xproxyServiceUrl" placeholder="http://..." />
              </div>
              <div class="form-row">
                <span class="form-label">Loại Proxy</span>
                <label class="radio-label"><input type="radio" v-model="ipForm.xproxyType" value="http" /> HTTP</label>
                <label class="radio-label"><input type="radio" v-model="ipForm.xproxyType" value="socks5" /> SOCKS5</label>
              </div>
              <div class="ip-lbl">Nhập Proxy ({{ lc(ipForm.xproxyList) }}):</div>
              <textarea class="form-textarea" rows="3" v-model="ipForm.xproxyList" placeholder="Mỗi proxy một dòng..." />
              <div class="form-row">
                <span class="form-label">Số luồng / IP</span>
                <input type="number" class="form-input form-input--sm" v-model.number="ipForm.xproxyThreadPerIp" min="1" />
              </div>
              <div class="form-row">
                <span class="form-label">Chế độ chạy</span>
                <select class="form-input" v-model.number="ipForm.xproxyRunMode">
                  <option :value="0">Reset từng proxy</option>
                  <option :value="1">Reset tất cả proxy</option>
                </select>
              </div>
            </template>

            <!-- HMA -->
            <template v-else-if="form.ipProvider === 'hma'">
              <div class="ip-tab-empty">HMA VPN — không cần cấu hình thêm</div>
            </template>

            <!-- Proxy / Proxy cố định -->
            <template v-else-if="form.ipProvider === 'proxy' || form.ipProvider === 'proxy_fixed'">
              <div class="ip-lbl">Danh sách proxy ({{ lc(ipForm.proxyList) }}):</div>
              <textarea class="form-textarea" rows="6" v-model="ipForm.proxyList" placeholder="host:port:user:pass&#10;Mỗi proxy một dòng..." />
              <div class="form-row">
                <span class="form-label">Loại proxy</span>
                <select class="form-input" v-model="ipForm.proxyType">
                  <option value="http">HTTP</option>
                  <option value="socks5">SOCKS5</option>
                </select>
              </div>
            </template>

            <!-- Tinsoft (WWProxy) -->
            <template v-else-if="form.ipProvider === 'tinsoft'">
              <div class="ip-lbl">Danh sách key ({{ lc(ipForm.tinsoftKeys) }}):</div>
              <textarea class="form-textarea" rows="4" v-model="ipForm.tinsoftKeys" placeholder="Nhập key..." />
              <div class="form-row">
                <span class="form-label">Số luồng / IP</span>
                <input type="number" class="form-input form-input--sm" v-model.number="ipForm.tinsoftThreadPerIp" min="1" />
                <button type="button" class="btn-sm" @click="showToast('info', 'Kiểm tra key Tinsoft...')">Kiểm tra</button>
              </div>
              <a class="ip-link" href="https://www.wwproxy.com" target="_blank">https://www.wwproxy.com</a>
            </template>

            <!-- ShopLike -->
            <template v-else-if="form.ipProvider === 'shoplike'">
              <div class="ip-lbl">Danh sách key ({{ lc(ipForm.shoplikeKeys) }}):</div>
              <textarea class="form-textarea" rows="4" v-model="ipForm.shoplikeKeys" placeholder="Nhập key..." />
              <div class="form-row">
                <span class="form-label">Số luồng / IP</span>
                <input type="number" class="form-input form-input--sm" v-model.number="ipForm.shoplikeThreadPerIp" min="1" />
              </div>
              <a class="ip-link" href="https://proxy.shoplike.vn/" target="_blank">https://proxy.shoplike.vn</a>
            </template>

            <!-- NetProxy -->
            <template v-else-if="form.ipProvider === 'netproxy'">
              <div class="ip-lbl">Danh sách key ({{ lc(ipForm.netproxyKeys) }}):</div>
              <textarea class="form-textarea" rows="4" v-model="ipForm.netproxyKeys" placeholder="Nhập key..." />
              <div class="form-row">
                <span class="form-label">Số luồng / IP</span>
                <input type="number" class="form-input form-input--sm" v-model.number="ipForm.netproxyThreadPerIp" min="1" />
              </div>
              <a class="ip-link" href="https://netproxy.io/" target="_blank">https://netproxy.io</a>
            </template>

            <!-- MinProxy -->
            <template v-else-if="form.ipProvider === 'minproxy'">
              <div class="ip-lbl">Danh sách key ({{ lc(ipForm.minproxyKeys) }}):</div>
              <textarea class="form-textarea" rows="4" v-model="ipForm.minproxyKeys" placeholder="Nhập key..." />
              <div class="form-row">
                <span class="form-label">Số luồng / IP</span>
                <input type="number" class="form-input form-input--sm" v-model.number="ipForm.minproxyThreadPerIp" min="1" />
              </div>
            </template>

            <!-- NetProxy dung lượng -->
            <template v-else-if="form.ipProvider === 'netproxy_gb'">
              <div class="form-row">
                <span class="form-label">Key</span>
                <input type="text" class="form-input" v-model="ipForm.netproxyGbKey" placeholder="Nhập key..." />
              </div>
              <a class="ip-link" href="https://netproxy.io/" target="_blank">https://netproxy.io</a>
            </template>

            <!-- Proxy dân cư -->
            <template v-else-if="form.ipProvider === 'proxy_popular'">
              <div class="form-row">
                <span class="form-label">Token</span>
                <input type="text" class="form-input" v-model="ipForm.proxyPopularToken" placeholder="Nhập token..." />
              </div>
              <div class="ip-lbl">Danh sách key ({{ lc(ipForm.proxyPopularKeys) }}):</div>
              <textarea class="form-textarea" rows="3" v-model="ipForm.proxyPopularKeys" placeholder="Nhập key..." />
              <div class="form-row">
                <span class="form-label">Số luồng / IP</span>
                <input type="number" class="form-input form-input--sm" v-model.number="ipForm.proxyPopularThreadPerIp" min="1" />
              </div>
              <a class="ip-link" href="https://app.proxydancu.com/" target="_blank">https://app.proxydancu.com</a>
            </template>

            <!-- ProxyFarm -->
            <template v-else-if="form.ipProvider === 'proxyfarm'">
              <div class="ip-lbl">Danh sách key ({{ lc(ipForm.proxyfarmKeys) }}):</div>
              <textarea class="form-textarea" rows="4" v-model="ipForm.proxyfarmKeys" placeholder="Nhập key..." />
              <div class="form-row">
                <span class="form-label">Số luồng / IP</span>
                <input type="number" class="form-input form-input--sm" v-model.number="ipForm.proxyfarmThreadPerIp" min="1" />
              </div>
              <a class="ip-link" href="https://proxy.farm/" target="_blank">https://proxy.farm</a>
            </template>

            <!-- Fallback -->
            <template v-else>
              <div class="ip-tab-empty">Chọn nhà cung cấp IP phía trên</div>
            </template>
          </div>
        </GroupBox>
      </div>
    </div>

    <!-- Custom footer: 3 buttons -->
    <template #footer>
      <button class="modal-btn modal-btn--secondary" @click="onSave" title="Áp dụng cài đặt cho các tài khoản đang chọn">
        Gán cài đặt chung
      </button>
      <div style="flex:1" />
      <button class="modal-btn modal-btn--save" @click="onSave">Lưu</button>
      <button class="modal-btn modal-btn--close" @click="$emit('close')">Đóng</button>
    </template>
  </BaseModal>
</template>

<style scoped>
.setup-layout { display: flex; gap: 16px; }
.setup-col-left { width: 45%; display: flex; flex-direction: column; gap: 12px; flex-shrink: 0; }
.setup-col-right { flex: 1; display: flex; flex-direction: column; }

/* Form rows inside GroupBox */
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
  color: var(--text-secondary);
  gap: 16px;
}
.form-row:last-child { border-bottom: none; }
.form-label { flex: 1; }

.form-input {
  font-family: var(--font-family);
  font-size: 13px;
  padding: 5px 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s;
}
.form-input:focus { border-color: var(--brand-primary); }
.form-input--sm { width: 80px; text-align: right; }

.form-textarea {
  width: 100%;
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
  resize: vertical;
  outline: none;
}
.form-textarea:focus { border-color: var(--brand-primary); }

/* Radio & checkbox labels */
.radio-label, .chk-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
}

/* IP tab area */
.ip-tab-content {
  margin-top: 8px;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-tertiary);
  min-height: 100px;
}
.ip-tab-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  color: var(--text-tertiary);
  font-size: 13px;
  font-style: italic;
}
.ip-lbl {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 4px;
}
.ip-link {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--brand-primary);
  text-decoration: none;
}
.ip-link:hover { text-decoration: underline; }

/* Footer buttons — WX variant styles */
.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-family: var(--wx-font-primary, 'Inter', sans-serif);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  border-top: 1px solid rgba(255,255,255,0.2);
}
.modal-btn:active { transform: scale(0.98); }

/* Lưu = WxButton primary */
.modal-btn--save {
  background: linear-gradient(to right, #06b6d4, #3b82f6);
  color: #fff;
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.25);
  margin-right: 8px;
}
.modal-btn--save:hover { box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.4); filter: brightness(1.05); }

/* Đóng = WxButton danger */
.modal-btn--close {
  background: linear-gradient(to right, #f43f5e, #dc2626);
  color: #fff;
  box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.25);
}
.modal-btn--close:hover { box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.4); filter: brightness(1.05); }

/* Gán cài đặt = WxButton secondary */
.modal-btn--secondary {
  background: #fff;
  color: #334155;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border-top: 1px solid #e2e8f0;
}
.modal-btn--secondary:hover { background: #f8fafc; border-color: #cbd5e1; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
</style>
