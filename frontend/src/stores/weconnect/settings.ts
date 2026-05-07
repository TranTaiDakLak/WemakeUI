import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ColumnConfig } from '../../types'
import type { ConfigGeneral, IpConfig, ConfigInteraction, CaptchaProvider } from '../../types/settings'
import { CHECK_INFO_ITEMS, CHECK_ADS_ITEMS } from '../../types/settings'

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'uid',        label: 'UID',        visible: true,  group: 'account', width: '130px', class: 'mono col-uid', sortable: true },
  { key: 'password',   label: 'MẬT KHẨU',  visible: true,  group: 'account' },
  { key: 'twofa',      label: '2FA',        visible: true,  group: 'account' },
  { key: 'email',      label: 'EMAIL',      visible: true,  group: 'account' },
  { key: 'cookie',     label: 'COOKIE',     visible: true,  group: 'account', width: '60px',  align: 'center' },
  { key: 'token',      label: 'TOKEN',      visible: true,  group: 'account', width: '60px',  align: 'center' },
  { key: 'fullName',   label: 'HỌ TÊN',    visible: true,  group: 'info',    sortable: true },
  { key: 'friends',    label: 'BẠN BÈ',    visible: true,  group: 'info',    align: 'right', sortable: true },
  { key: 'follower',   label: 'THEO DÕI',  visible: true,  group: 'info',    align: 'right', sortable: true },
  { key: 'statusAds',  label: 'QUẢNG CÁO', visible: true,  group: 'ads' },
  { key: 'status',     label: 'TRẠNG THÁI',visible: true,  group: 'account', sortable: true },
  { key: 'category',   label: 'THƯ MỤC',   visible: true,  group: 'account' },
  { key: 'note',       label: 'GHI CHÚ',   visible: true,  group: 'account' },
  { key: 'action',     label: 'HOẠT ĐỘNG', visible: true,  group: 'action' },
]

const defaultGeneral: ConfigGeneral = {
  threadRequest: 5,
  delayRequest: 500,
  threadCheckInfo: 3,
  loginPlatform: 'facebook',
  loginMethod: 'cookie',
  saveRunColumn: true,
  backupDB: false,
  captchaProvider: '2captcha',
  captchaKeys: {},
  checkIpBeforeRun: false,
  delayChangeIp: 3000,
  ipProvider: 'none',
}

const defaultIp: IpConfig = {
  fptKeys: '',
  xproxy: { serviceUrl: '', type: 'http', list: '', threadPerIp: 1, runMode: 'auto' },
  proxyList: '',
  proxyType: 'http',
  tinsoftKeys: '',
  tinsoftThreadPerIp: 1,
  shoplikeKeys: '',
  shoplikeThreadPerIp: 1,
  netproxyKeys: '',
  netproxyThreadPerIp: 1,
  netproxyGbKey: '',
  proxyPopularToken: '',
  proxyPopularKeys: '',
  proxyPopularThreadPerIp: 1,
  proxyfarmKeys: '',
  proxyfarmThreadPerIp: 1,
  minproxyKeys: '',
  minproxyThreadPerIp: 1,
}

const defaultInteraction: ConfigInteraction = {
  checkInfo: {
    accountKeys: CHECK_INFO_ITEMS.map(i => i.key),
    adsKeys: CHECK_ADS_ITEMS.map(i => i.key),
  },
  bm: { operation: 'createBM', quantity: 1, receiverUid: '', shareBySpecificUid: false, bmType: 'personal' },
  page: { likePage: false, sharePage: false, commentPage: false, pageUrl: '' },
  shareTKQC: { quantityPerBM: 1, receiverUid: '', shareBySpecificUid: false, bmType: 'personal', tkqcList: '', mailType: 'gmail' },
  campaign: { campaignName: '', budget: 100000, targeting: '', addCard: false },
  cloneFarming: { addFriendUids: '', acceptFriendUids: '', scanAdLibraryPageIds: '', action: 'like' },
  updateInfo: { updateName: false, updateAvatar: false, updateCover: false, updateBio: false, updateBirthday: false, updateLocation: false },
  checkpoint: { cpType: 'photo_id', method: 'manual', delay: 3000 },
  accountResist: { appeal: false, verifyIdentity: false },
  tutPremium: { tutType: 'bm5_email', bm5Config: '', options: '' },
}

export const useSettingsStore = defineStore('wc-settings', () => {
  const dgvColumns = ref<ColumnConfig[]>(DEFAULT_COLUMNS.map(c => ({ ...c })))
  const general = ref<ConfigGeneral>({ ...defaultGeneral })
  const ipConfig = ref<IpConfig>({ ...defaultIp })
  const interaction = ref<ConfigInteraction>(JSON.parse(JSON.stringify(defaultInteraction)))

  function updateGeneral(patch: Partial<ConfigGeneral>) {
    Object.assign(general.value, patch)
  }

  function updateIpConfig(patch: Partial<IpConfig>) {
    Object.assign(ipConfig.value, patch)
  }

  function updateInteraction(patch: Partial<ConfigInteraction>) {
    Object.assign(interaction.value, patch)
  }

  function updateDgvColumns(cols: ColumnConfig[]) {
    dgvColumns.value = cols
  }

  return { dgvColumns, general, ipConfig, interaction, updateGeneral, updateIpConfig, updateInteraction, updateDgvColumns }
})
