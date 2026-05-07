export type LoginPlatform = 'facebook' | 'instagram' | 'bm'
export type CaptchaProvider = '2captcha' | 'anticaptcha' | 'capsolver' | 'imagetyperz' | 'deathbycaptcha' | '9kw'
export type IpProvider = 'none' | 'fpt' | 'xproxy' | 'hma' | 'proxy' | 'proxy_fixed' | 'tinsoft' | 'shoplike' | 'netproxy' | 'netproxy_gb' | 'proxy_popular' | 'proxyfarm' | 'minproxy'

export const LOGIN_METHODS = ['cookie', 'password', 'token', 'oauth2'] as const
export const CAPTCHA_PROVIDERS: CaptchaProvider[] = ['2captcha', 'anticaptcha', 'capsolver', 'imagetyperz', 'deathbycaptcha', '9kw']
export const IP_PROVIDERS: IpProvider[] = ['none', 'fpt', 'xproxy', 'hma', 'proxy', 'proxy_fixed', 'tinsoft', 'shoplike', 'netproxy', 'netproxy_gb', 'proxy_popular', 'proxyfarm', 'minproxy']

export const CHECK_INFO_ITEMS = [
  { key: 'uid',            label: 'UID',                    premium: false },
  { key: 'name',           label: 'Họ tên',                 premium: false },
  { key: 'friends',        label: 'Bạn bè',                 premium: false },
  { key: 'follower',       label: 'Theo dõi',               premium: false },
  { key: 'birthday',       label: 'Sinh nhật',              premium: false },
  { key: 'phone',          label: 'Số điện thoại',          premium: true  },
  { key: 'email',          label: 'Email liên kết',         premium: false },
  { key: 'status',         label: 'Trạng thái',             premium: false },
  { key: 'checkpoint',     label: 'Checkpoint',             premium: false },
  { key: 'bm',             label: 'Business Manager',       premium: true  },
  { key: 'ads_account',    label: 'Tài khoản quảng cáo',   premium: true  },
  { key: 'payment_method', label: 'Phương thức thanh toán', premium: true  },
  { key: 'page',           label: 'Trang',                  premium: false },
  { key: 'group',          label: 'Nhóm',                   premium: true  },
  { key: 'hashtag',        label: 'Hashtag',                premium: true  },
  { key: 'avatar',         label: 'Ảnh đại diện',           premium: false },
  { key: 'cover',          label: 'Ảnh bìa',                premium: false },
  { key: 'ua',             label: 'Useragent',              premium: false },
  { key: 'proxy',          label: 'Proxy',                  premium: false },
  { key: 'ip',             label: 'IP',                     premium: false },
  { key: 'location',       label: 'Vị trí',                 premium: false },
  { key: 'token',          label: 'Token',                  premium: false },
  { key: 'cookie',         label: 'Cookie',                 premium: false },
] as const

export const CHECK_ADS_ITEMS = [
  { key: 'ads_account', label: 'Tài khoản quảng cáo' },
  { key: 'ads_status',  label: 'Trạng thái quảng cáo' },
  { key: 'ads_limit',   label: 'Hạn mức chi tiêu' },
  { key: 'ads_payment', label: 'Phương thức thanh toán' },
  { key: 'ads_bm',      label: 'Business Manager liên kết' },
] as const

export const BM_OPERATIONS = [
  { value: 'createBM',      label: 'Tạo BM' },
  { value: 'getLinkBM',     label: 'Lấy link nhận BM' },
  { value: 'receiveLink',   label: 'Nhận link BM' },
  { value: 'sharePartner',  label: 'Share Partner' },
  { value: 'checkBM',       label: 'Kiểm tra BM' },
  { value: 'kickLimit',     label: 'Kick người dùng hạn chế' },
] as const

export const TUT_TYPES = [
  { value: 'bm5_email', label: 'BM5 via Email' },
  { value: 'bm5_fb',    label: 'BM5 via Facebook' },
  { value: 'personal',  label: 'Cá nhân (Personal)' },
] as const

export const PAYMENT_TIME_OPTIONS = [
  { value: '7', label: '7 ngày' },
  { value: '14', label: '14 ngày' },
  { value: '30', label: '30 ngày' },
] as const

export interface ConfigGeneral {
  threadRequest: number
  delayRequest: number
  threadCheckInfo: number
  loginPlatform: LoginPlatform
  loginMethod: string
  saveRunColumn: boolean
  backupDB: boolean
  captchaProvider: CaptchaProvider
  captchaKeys: Partial<Record<CaptchaProvider, string>>
  checkIpBeforeRun: boolean
  delayChangeIp: number
  ipProvider: IpProvider
}

export interface XproxyConfig {
  serviceUrl: string
  type: string
  list: string
  threadPerIp: number
  runMode: string
}

export interface IpConfig {
  fptKeys: string
  xproxy: XproxyConfig
  proxyList: string
  proxyType: string
  tinsoftKeys: string
  tinsoftThreadPerIp: number
  shoplikeKeys: string
  shoplikeThreadPerIp: number
  netproxyKeys: string
  netproxyThreadPerIp: number
  netproxyGbKey: string
  proxyPopularToken: string
  proxyPopularKeys: string
  proxyPopularThreadPerIp: number
  proxyfarmKeys: string
  proxyfarmThreadPerIp: number
  minproxyKeys: string
  minproxyThreadPerIp: number
}

export interface CheckInfoConfig {
  accountKeys: string[]
  adsKeys: string[]
}

export interface BmConfig {
  operation: string
  quantity: number
  receiverUid: string
  shareBySpecificUid: boolean
  bmType: string
}

export interface PageConfig {
  likePage: boolean
  sharePage: boolean
  commentPage: boolean
  pageUrl: string
}

export interface ShareTkqcConfig {
  quantityPerBM: number
  receiverUid: string
  shareBySpecificUid: boolean
  bmType: string
  tkqcList: string
  mailType: string
}

export interface CampaignConfig {
  campaignName: string
  budget: number
  targeting: string
  addCard: boolean
}

export interface CloneFarmingConfig {
  addFriendUids: string
  acceptFriendUids: string
  scanAdLibraryPageIds: string
  action: string
}

export interface UpdateInfoConfig {
  updateName: boolean
  updateAvatar: boolean
  updateCover: boolean
  updateBio: boolean
  updateBirthday: boolean
  updateLocation: boolean
}

export interface CheckpointConfig {
  cpType: string
  method: string
  delay: number
}

export interface AppealConfig {
  appeal: boolean
  verifyIdentity: boolean
}

export interface TutPremiumConfig {
  tutType: string
  bm5Config: string
  options: string
}

export interface ConfigInteraction {
  checkInfo: CheckInfoConfig
  bm: BmConfig
  page: PageConfig
  shareTKQC: ShareTkqcConfig
  campaign: CampaignConfig
  cloneFarming: CloneFarmingConfig
  updateInfo: UpdateInfoConfig
  checkpoint: CheckpointConfig
  accountResist: AppealConfig
  tutPremium: TutPremiumConfig
}
