<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '../composables'

const { showToast } = useToast()

const mockDevices = [
  { id: 1, chose: false, deviceId: 'emulator-5554', name: 'Samsung Galaxy S21', android: '12', model: 'SM-G991B', brand: 'Samsung', resolution: '1080x2400', ip: '192.168.1.101', status: 'Online' },
  { id: 2, chose: false, deviceId: 'emulator-5556', name: 'Xiaomi Redmi Note 11', android: '11', model: 'M2101K7BG', brand: 'Xiaomi', resolution: '1080x2400', ip: '192.168.1.102', status: 'Online' },
  { id: 3, chose: false, deviceId: '192.168.1.50:5555', name: 'OPPO A95', android: '11', model: 'CPH2365', brand: 'OPPO', resolution: '1080x2400', ip: '192.168.1.50', status: 'Online' },
  { id: 4, chose: false, deviceId: 'R58N51XXXXX', name: 'Samsung Galaxy A52', android: '13', model: 'SM-A525F', brand: 'Samsung', resolution: '1080x2400', ip: '—', status: 'Offline' },
  { id: 5, chose: false, deviceId: 'emulator-5558', name: 'LDPlayer 9', android: '9', model: 'LDPlayer', brand: 'LDPlayer', resolution: '900x1600', ip: '192.168.1.103', status: 'Online' },
  { id: 6, chose: false, deviceId: 'emulator-5560', name: 'NoxPlayer', android: '9', model: 'NoxPlayer', brand: 'Nox', resolution: '900x1600', ip: '—', status: 'Offline' },
]

function handleAction(action: string) {
  showToast('info', `${action} — chức năng đang phát triển`)
}
</script>

<template>
  <div class="device-page">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-group">
        <button class="toolbar-btn toolbar-btn--primary" @click="handleAction('Tải danh sách')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
          Tải danh sách
        </button>
        <button class="toolbar-btn toolbar-btn--default" @click="handleAction('Quét thiết bị')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Quét
        </button>
      </div>
      <div class="toolbar-group">
        <button class="toolbar-btn toolbar-btn--run" @click="handleAction('Chạy')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Chạy
        </button>
        <button class="toolbar-btn toolbar-btn--stop" @click="handleAction('Dừng')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
          Dừng
        </button>
      </div>
      <div class="toolbar-spacer"></div>
      <div class="toolbar-group">
        <button class="toolbar-btn toolbar-btn--default" @click="handleAction('Cài APK')">Cài APK</button>
        <button class="toolbar-btn toolbar-btn--default" @click="handleAction('Khởi động lại')">Khởi động lại</button>
      </div>
    </div>

    <!-- Main content -->
    <div class="device-main">
      <!-- DataGrid -->
      <div class="datagrid-wrapper">
        <div class="datagrid-scroll">
          <table class="datagrid">
            <thead>
              <tr>
                <th class="col-chk"><input type="checkbox" /></th>
                <th class="col-stt">STT</th>
                <th class="col-id">Device ID</th>
                <th class="col-name">Tên thiết bị</th>
                <th class="col-android">Android</th>
                <th class="col-model">Model</th>
                <th class="col-brand">Hãng</th>
                <th class="col-res">Độ phân giải</th>
                <th class="col-ip">IP</th>
                <th class="col-status">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dev, idx) in mockDevices" :key="dev.id" :class="{ 'row-offline': dev.status === 'Offline' }">
                <td class="col-chk"><input type="checkbox" v-model="dev.chose" /></td>
                <td class="col-stt">{{ idx + 1 }}</td>
                <td class="col-id">{{ dev.deviceId }}</td>
                <td class="col-name">{{ dev.name }}</td>
                <td class="col-android">{{ dev.android }}</td>
                <td class="col-model">{{ dev.model }}</td>
                <td class="col-brand">{{ dev.brand }}</td>
                <td class="col-res">{{ dev.resolution }}</td>
                <td class="col-ip">{{ dev.ip }}</td>
                <td class="col-status">
                  <span class="status-dot" :class="{ 'dot-online': dev.status === 'Online', 'dot-offline': dev.status === 'Offline' }"></span>
                  {{ dev.status }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right panel -->
      <div class="device-panel">
        <div class="panel-section">
          <div class="panel-title">Cài đặt thiết bị</div>
          <div class="panel-row"><span>Pin:</span><input type="number" class="panel-input" value="85" min="0" max="100" /> %</div>
          <div class="panel-row"><span>Độ sáng:</span><input type="number" class="panel-input" value="70" min="0" max="100" /> %</div>
          <div class="panel-row"><span>Ngôn ngữ:</span><select class="panel-select"><option>vi-VN</option><option>en-US</option></select></div>
          <div class="panel-row"><span>Âm lượng:</span><input type="number" class="panel-input" value="50" min="0" max="100" /> %</div>
        </div>
        <div class="panel-section">
          <div class="panel-title">Chức năng</div>
          <button class="panel-btn" @click="handleAction('GPS')">Đặt GPS</button>
          <button class="panel-btn" @click="handleAction('WiFi')">Kết nối WiFi</button>
          <button class="panel-btn" @click="handleAction('Proxy')">Cài đặt Proxy</button>
          <button class="panel-btn" @click="handleAction('Screenshot')">Chụp màn hình</button>
        </div>
      </div>
    </div>

    <!-- StatusBar -->
    <div class="status-bar">
      <span>Tổng: {{ mockDevices.length }}</span>
      <span class="status-online">Online: {{ mockDevices.filter(d => d.status === 'Online').length }}</span>
      <span class="status-offline">Offline: {{ mockDevices.filter(d => d.status === 'Offline').length }}</span>
      <span>Đã chọn: {{ mockDevices.filter(d => d.chose).length }}</span>
    </div>
  </div>
</template>

<style scoped>
.device-page { display: flex; flex-direction: column; height: 100%; margin: calc(var(--space-lg) * -1); }
.toolbar { height: 52px; display: flex; align-items: center; padding: 0 var(--space-md); background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); gap: var(--space-sm); flex-shrink: 0; }
.toolbar-group { display: flex; align-items: center; gap: 6px; }
.toolbar-spacer { flex: 1; }
.toolbar-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; border: none; border-radius: 12px; font-family: var(--wx-font-primary, 'Inter', sans-serif); font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; overflow: hidden; border-top: 1px solid rgba(255,255,255,0.2); }
.toolbar-btn:hover { filter: brightness(1.05); }
.toolbar-btn:active { transform: scale(0.98); }
.toolbar-btn--primary { background: linear-gradient(to right, #06b6d4, #3b82f6); color: #fff; box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.25); }
.toolbar-btn--default { background: #fff; color: #334155; font-weight: 600; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border-top: none; }
.toolbar-btn--default:hover { background: #f8fafc; border-color: #cbd5e1; }
.toolbar-btn--run { background: linear-gradient(to right, #10b981, #059669); color: #fff; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.25); }
.toolbar-btn--stop { background: linear-gradient(to right, #f43f5e, #dc2626); color: #fff; box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.25); }

.device-main { flex: 1; display: flex; overflow: hidden; }
.datagrid-wrapper { flex: 1; overflow: hidden; background: var(--bg-primary); }
.datagrid-scroll { height: 100%; overflow: auto; }
.datagrid { width: 100%; border-collapse: collapse; font-size: 12px; }
.datagrid thead { position: sticky; top: 0; z-index: 5; }
.datagrid th { padding: 8px 10px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.3px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); white-space: nowrap; }
.datagrid td { padding: 7px 10px; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); white-space: nowrap; }
.datagrid tbody tr:hover td { background: var(--hover-bg); }
.col-chk { width: 36px; text-align: center; }
.col-stt { width: 40px; text-align: center; color: var(--text-tertiary); }
.col-id { min-width: 140px; font-family: 'Consolas', monospace; font-size: 11px; }
.col-name { min-width: 150px; color: var(--text-primary); font-weight: 500; }
.col-android { width: 70px; text-align: center; }
.col-model { width: 110px; }
.col-brand { width: 80px; }
.col-res { width: 100px; font-family: 'Consolas', monospace; font-size: 11px; }
.col-ip { width: 120px; font-family: 'Consolas', monospace; font-size: 11px; }
.col-status { width: 85px; }
.status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; vertical-align: middle; }
.dot-online { background: var(--success-color); }
.dot-offline { background: var(--text-tertiary); }
.row-offline td { opacity: 0.5; }
.datagrid input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; }

/* Right panel */
.device-panel { width: 240px; flex-shrink: 0; border-left: 1px solid var(--border-color); background: var(--bg-secondary); overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 16px; }
.panel-section { display: flex; flex-direction: column; gap: 8px; }
.panel-title { font-size: 12px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.4px; padding-bottom: 6px; border-bottom: 1px solid var(--border-color); }
.panel-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-secondary); }
.panel-row span:first-child { min-width: 65px; }
.panel-input { width: 50px; padding: 3px 6px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-tertiary); color: var(--text-primary); font-family: var(--font-family); font-size: 12px; text-align: center; }
.panel-select { flex: 1; padding: 3px 6px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-tertiary); color: var(--text-primary); font-family: var(--font-family); font-size: 12px; }
.panel-btn { padding: 6px 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-tertiary); color: var(--text-secondary); font-family: var(--font-family); font-size: 12px; cursor: pointer; transition: background 0.12s; text-align: left; }
.panel-btn:hover { background: var(--hover-bg); color: var(--text-primary); }

.status-bar { height: 28px; display: flex; align-items: center; gap: 16px; padding: 0 var(--space-md); background: var(--bg-tertiary); border-top: 1px solid var(--border-color); font-size: 11px; color: var(--text-tertiary); flex-shrink: 0; }
.status-online { color: var(--success-color); }
.status-offline { color: var(--text-tertiary); }
</style>
