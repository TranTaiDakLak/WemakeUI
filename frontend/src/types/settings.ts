/* ── Login ── */

/** Login platform */
export type LoginPlatform = 'facebook' | 'instagram' | 'bm'

/** Login method options (maps to WeBM cboLoginWith index) */
export const LOGIN_METHODS = [
  { value: 0, label: 'Tài khoản WWW' },
  { value: 1, label: 'Cookie → Tài khoản WWW' },
  { value: 2, label: 'Cookie → Android' },
  { value: 3, label: 'Android' },
  { value: 4, label: 'Cookie → IOS (KHÔNG HOẠT ĐỘNG)' },
  { value: 5, label: 'Web Mobile (KHÔNG HOẠT ĐỘNG)' },
] as const

/* ── Captcha ── */

export type CaptchaProviderType =
  | '2captcha'
  | 'omocaptcha'
  | 'ezcaptcha'
  | 'capsolver'

export const CAPTCHA_PROVIDERS: readonly { value: CaptchaProviderType; label: string }[] = [
  { value: '2captcha', label: 'https://2captcha.com/' },
  { value: 'omocaptcha', label: 'https://omocaptcha.com/' },
  { value: 'ezcaptcha', label: 'https://www.ez-captcha.com/ (Lỗi)' },
  { value: 'capsolver', label: 'https://www.capsolver.com/' },
]

/* ── IP / Proxy ── */

export type IpProviderType =
  | 'none'
  | 'fpt'
  | 'xproxy'
  | 'hma'
  | 'proxy'
  | 'proxy_fixed'
  | 'tinsoft'
  | 'shoplike'
  | 'netproxy'
  | 'minproxy'
  | 'netproxy_gb'
  | 'proxy_popular'
  | 'proxyfarm'

export const IP_PROVIDERS: readonly { value: IpProviderType; label: string }[] = [
  { value: 'none', label: 'Không đổi IP' },
  { value: 'fpt', label: 'FPT' },
  { value: 'xproxy', label: 'Xproxy, MobiProxy' },
  { value: 'hma', label: 'HMA' },
  { value: 'proxy', label: 'Proxy' },
  { value: 'proxy_fixed', label: 'Proxy cố định' },
  { value: 'tinsoft', label: 'WWProxy (Tinsoft)' },
  { value: 'shoplike', label: 'ShopLike' },
  { value: 'netproxy', label: 'NetProxy' },
  { value: 'minproxy', label: 'MinProxy' },
  { value: 'netproxy_gb', label: 'NetProxy dung lượng' },
  { value: 'proxy_popular', label: 'Proxy dân cư' },
  { value: 'proxyfarm', label: 'ProxyFarm' },
]

export interface ProviderOption {
  value: string
  label: string
}

/* ── Per-provider IP configuration (flat) ── */

export interface IpConfig {
  // FPT
  fptKeys: string
  // XProxy
  xproxyServiceUrl: string
  xproxyType: 'http' | 'socks5'
  xproxyList: string
  xproxyThreadPerIp: number
  xproxyRunMode: number
  // Proxy / Proxy cố định
  proxyList: string
  proxyType: 'http' | 'socks5'
  // Tinsoft (WWProxy)
  tinsoftKeys: string
  tinsoftThreadPerIp: number
  // ShopLike
  shoplikeKeys: string
  shoplikeThreadPerIp: number
  // NetProxy
  netproxyKeys: string
  netproxyThreadPerIp: number
  // MinProxy
  minproxyKeys: string
  minproxyThreadPerIp: number
  // NetProxy dung lượng
  netproxyGbKey: string
  // Proxy dân cư
  proxyPopularToken: string
  proxyPopularKeys: string
  proxyPopularThreadPerIp: number
  // ProxyFarm
  proxyfarmKeys: string
  proxyfarmThreadPerIp: number
}

export function defaultIpConfig(): IpConfig {
  return {
    fptKeys: '',
    xproxyServiceUrl: '',
    xproxyType: 'http',
    xproxyList: '',
    xproxyThreadPerIp: 1,
    xproxyRunMode: 0,
    proxyList: '',
    proxyType: 'http',
    tinsoftKeys: '',
    tinsoftThreadPerIp: 1,
    shoplikeKeys: '',
    shoplikeThreadPerIp: 1,
    netproxyKeys: '',
    netproxyThreadPerIp: 1,
    minproxyKeys: '',
    minproxyThreadPerIp: 1,
    netproxyGbKey: '',
    proxyPopularToken: '',
    proxyPopularKeys: '',
    proxyPopularThreadPerIp: 1,
    proxyfarmKeys: '',
    proxyfarmThreadPerIp: 1,
  }
}

/* ── General configuration (frmSettings — 6 sections) ── */

export interface ConfigGeneral {
  /** Chung: Số luồng Request */
  threadRequest: number
  /** Chung: Nghỉ giữa các request (ms) */
  delayRequest: number
  /** Kiểm tra thông tin: Số luồng check */
  threadCheckInfo: number
  /** Dạng đăng nhập: Nền tảng */
  loginPlatform: LoginPlatform
  /** Dạng đăng nhập: Phương thức (index in LOGIN_METHODS) */
  loginMethod: number
  /** Khác: Lưu cột [Hoạt động] */
  saveRunColumn: boolean
  /** Khác: Backup Database */
  backupDB: boolean
  /** Captcha: Provider hiện tại */
  captchaProvider: CaptchaProviderType
  /** Captcha: API keys per provider */
  captchaKeys: Record<CaptchaProviderType, string>
  /** Đổi IP: Provider hiện tại */
  ipProvider: IpProviderType
  /** Đổi IP: Check IP trước khi chạy */
  checkIpBeforeRun: boolean
  /** Đổi IP: Delay sau đổi IP (giây) */
  delayChangeIp: number
}

export function defaultGeneral(): ConfigGeneral {
  return {
    threadRequest: 10,
    delayRequest: 1000,
    threadCheckInfo: 10,
    loginPlatform: 'facebook',
    loginMethod: 0,
    saveRunColumn: false,
    backupDB: false,
    captchaProvider: '2captcha',
    captchaKeys: { '2captcha': '', omocaptcha: '', ezcaptcha: '', capsolver: '' },
    ipProvider: 'none',
    checkIpBeforeRun: false,
    delayChangeIp: 0,
  }
}

/* ── Interaction configuration (frmSetupInteract — 10 tabs) ── */

export interface InteractionSetting {
  enabled: boolean
  countPerDay: number
  delaySeconds: number
}

/* ── Tab 01: Kiểm tra tài nguyên (frmCheckInfomation) ── */

export interface CheckInfoConfig {
  /** Thông tin tài khoản — 23 checkboxes */
  accountChecks: Record<string, boolean>
  /** Quảng cáo và BM — 5 checkboxes */
  adsChecks: Record<string, boolean>
  /** Lập hóa đơn && thanh toán */
  paymentAll: boolean
  paymentById: boolean
  paymentIds: string[]
  paymentTimePeriod: 'today' | 'yesterday' | 'last7days'
}

export const CHECK_INFO_ACCOUNT_KEYS = [
  'chkFullName', 'chkFriends', 'chkFollower', 'chkGender', 'chkGroup',
  'chkCurrentCity', 'chkHometown', 'chkGroupManager', 'chkLocation',
  'chkCover', 'chkAvatar', 'chkProfessional', 'chkDating', 'chkSecondAccount',
  'chkMarketplace', 'chkCheckPost', 'chkRequestFriends', 'chkDateAccountCreated',
  'chkBirthday', 'chkEmailOther', 'chkToken', 'chkPhone', 'chkPage',
] as const

export const CHECK_INFO_ADS_KEYS = [
  'chkTKQCAccount', 'chkStatusADS', 'chkBM', 'chkTKQCFull', 'chkChatSupport',
] as const

export const PREMIUM_CHECK_KEYS = new Set([
  'chkProfessional', 'chkDating', 'chkSecondAccount', 'chkMarketplace', 'chkCheckPost',
])

export const PAYMENT_TIME_OPTIONS = [
  { value: 'today' as const, label: 'Hôm nay' },
  { value: 'yesterday' as const, label: 'Hôm qua' },
  { value: 'last7days' as const, label: '7 ngày gần nhất' },
]

export function defaultCheckInfoConfig(): CheckInfoConfig {
  const accountChecks: Record<string, boolean> = {}
  for (const k of CHECK_INFO_ACCOUNT_KEYS) accountChecks[k] = false
  accountChecks.chkFullName = true
  accountChecks.chkFriends = true
  accountChecks.chkFollower = true

  const adsChecks: Record<string, boolean> = {}
  for (const k of CHECK_INFO_ADS_KEYS) adsChecks[k] = false
  adsChecks.chkStatusADS = true

  return {
    accountChecks,
    adsChecks,
    paymentAll: true,
    paymentById: false,
    paymentIds: [],
    paymentTimePeriod: 'today',
  }
}

/* ── Tab 02: BM (frmBM — 10 operations via combo) ── */

export type BMOperationType =
  | 'createBM'
  | 'getLinkBM'
  | 'receiveBM'
  | 'createTKQC'
  | 'changeBMShare'
  | 'checkBM'
  | 'outBM'
  | 'resBM'
  | 'createBMTUT'
  | 'createBMVerification'

export const BM_OPERATIONS: readonly { value: BMOperationType; label: string }[] = [
  { value: 'createBM', label: 'Tạo BM' },
  { value: 'getLinkBM', label: 'Lấy link mời' },
  { value: 'receiveBM', label: 'Nhận BM' },
  { value: 'createTKQC', label: 'Tạo tài khoản quảng cáo' },
  { value: 'changeBMShare', label: 'Đổi thông tin & Share đối tác' },
  { value: 'checkBM', label: 'Kiểm tra BM' },
  { value: 'outBM', label: 'Thoát BM' },
  { value: 'resBM', label: 'Kháng BM' },
  { value: 'createBMTUT', label: 'Tạo BM TUT' },
  { value: 'createBMVerification', label: 'Tạo BM xác minh doanh nghiệp' },
]

/** frmCreateBM */
export interface CreateBMConfig {
  nameBMEnabled: boolean; nameBM: string
  getLinkEnabled: boolean; getLinkQuantity: number; getLinkDelay: number; getLinkPerBM: number; getLinkMailType: string
  createTKQCEnabled: boolean; createTKQCNameEnabled: boolean; createTKQCName: string
  createTKQCCountry: string; createTKQCTimeZone: string; createTKQCCurrency: string; createTKQCQuantity: number
  sharePartnerEnabled: boolean; sharePartnerUids: string[]
  getBMLive: boolean; kickLimitOnly: boolean; tutRegBM: number
}

/** frmGetLinkBM */
export interface GetLinkBMConfig {
  config: 'all' | 'byId'; typeBM: string; typeTKQC: string
  statusBMLive: boolean; typeTKQCLive: boolean
  quantity: number; delay: number; linkPerBM: number; failStop: number
  mailBackup: string; mailType: string; kickLimit: boolean; bmIds: string[]
}

/** frmReceiveBM */
export interface ReceiveBMConfig {
  firstName: string; lastName: string; links: string[]
  limitDone: number; limitFail: number; delay: number; checkAfterReceive: boolean
}

/** frmCreateTKQCBM */
export interface CreateTKQCBMConfig {
  config: 'all' | 'byId'; typeBM: string; threadPerBM: number; delay: number; tkqcPerBM: number
  createTKQCEnabled: boolean; nameEnabled: boolean; name: string
  country: string; timeZone: string; currency: string
  renameBMEnabled: boolean; renameBM: string
  sharePartnerEnabled: boolean; sharePartnerUids: string[]
  getLinkEnabled: boolean; linkPerBM: number; is2500: boolean; mailType: string; bmIds: string[]
}

/** frmChangeBMShare */
export interface ChangeBMShareConfig {
  configMode: 'all' | 'byId'; typeBM: string; bmIds: string[]
  sharePartnerEnabled: boolean; sharePartnerUids: string[]
  changeTKQCByIdEnabled: boolean; tkqcIds: string[]
  getLinkEnabled: boolean; linkPerBM: number
  renameBMEnabled: boolean; renameBMName: string
  changeNameTKQCEnabled: boolean; changeNameTKQC: string
  country: string; timeZone: string; currency: string; mailType: string
}

/** frmCheckBM */
export interface CheckBMConfig {
  config: 'all' | 'byId'; typeBM: string; delay: number
  switchModeIG: boolean; kickLimit: boolean; bmIds: string[]
}

/** frmOutBM */
export interface OutBMConfig {
  config: 'all' | 'byId'; typeBM: string; typeTKQC: string
  outBMLive: boolean; outBMDie: boolean; outTKQCLive: boolean; outTKQCDie: boolean
  failStop: number; delay: number; bmIds: string[]
}

/** frmResBM */
export interface ResBMConfig {
  configMode: 'all' | 'byId'; typeBM: string; quantity: number; delay: number
  hasCreated: boolean; hasNotCreated: boolean; bmIds: string[]
}

/** frmCreateBMTUT */
export interface CreateBMTUTConfig {
  nameBMEnabled: boolean; nameBM: string
  getLinkEnabled: boolean; getLinkPerBM: number; getLinkMailType: string
  createTKQCEnabled: boolean; createTKQCNameEnabled: boolean; createTKQCName: string
  createTKQCCountry: string; createTKQCTimeZone: string; createTKQCCurrency: string
  sharePartnerEnabled: boolean; sharePartnerUids: string[]
  quantity: number; delay: number; tutRegBM: number
}

/** frmCreateBMVerification */
export interface CreateBMVerificationConfig {
  config: 'all' | 'byId'; country: string; legalName: string
  address1: string; address2: string; city: string; state: string; zipCode: string
  taxId: string; website: string; phone: string
  businessList: string[]; bmIds: string[]
}

export interface BMInteractionConfig {
  selectedOperation: BMOperationType
  createBM: CreateBMConfig
  getLinkBM: GetLinkBMConfig
  receiveBM: ReceiveBMConfig
  createTKQC: CreateTKQCBMConfig
  changeBMShare: ChangeBMShareConfig
  checkBM: CheckBMConfig
  outBM: OutBMConfig
  resBM: ResBMConfig
  createBMTUT: CreateBMTUTConfig
  createBMVerification: CreateBMVerificationConfig
}

export function defaultBMInteractionConfig(): BMInteractionConfig {
  return {
    selectedOperation: 'createBM',
    createBM: {
      nameBMEnabled: false, nameBM: '', getLinkEnabled: false, getLinkQuantity: 1, getLinkDelay: 1, getLinkPerBM: 1, getLinkMailType: '',
      createTKQCEnabled: false, createTKQCNameEnabled: false, createTKQCName: '', createTKQCCountry: '', createTKQCTimeZone: '', createTKQCCurrency: '', createTKQCQuantity: 1,
      sharePartnerEnabled: false, sharePartnerUids: [], getBMLive: false, kickLimitOnly: false, tutRegBM: 0,
    },
    getLinkBM: {
      config: 'all', typeBM: '', typeTKQC: '', statusBMLive: false, typeTKQCLive: false,
      quantity: 1, delay: 5, linkPerBM: 1, failStop: 3, mailBackup: '', mailType: '', kickLimit: false, bmIds: [],
    },
    receiveBM: { firstName: '', lastName: '', links: [], limitDone: 0, limitFail: 0, delay: 5, checkAfterReceive: false },
    createTKQC: {
      config: 'all', typeBM: '', threadPerBM: 1, delay: 5, tkqcPerBM: 1,
      createTKQCEnabled: false, nameEnabled: false, name: '', country: '', timeZone: '', currency: '',
      renameBMEnabled: false, renameBM: '', sharePartnerEnabled: false, sharePartnerUids: [],
      getLinkEnabled: false, linkPerBM: 1, is2500: false, mailType: '', bmIds: [],
    },
    changeBMShare: {
      configMode: 'all', typeBM: '', bmIds: [], sharePartnerEnabled: false, sharePartnerUids: [],
      changeTKQCByIdEnabled: false, tkqcIds: [], getLinkEnabled: false, linkPerBM: 1,
      renameBMEnabled: false, renameBMName: '', changeNameTKQCEnabled: false, changeNameTKQC: '',
      country: '', timeZone: '', currency: '', mailType: '',
    },
    checkBM: { config: 'all', typeBM: '', delay: 5, switchModeIG: false, kickLimit: false, bmIds: [] },
    outBM: {
      config: 'all', typeBM: '', typeTKQC: '', outBMLive: true, outBMDie: false,
      outTKQCLive: true, outTKQCDie: false, failStop: 3, delay: 5, bmIds: [],
    },
    resBM: { configMode: 'all', typeBM: '', quantity: 1, delay: 5, hasCreated: false, hasNotCreated: false, bmIds: [] },
    createBMTUT: {
      nameBMEnabled: false, nameBM: '', getLinkEnabled: false, getLinkPerBM: 1, getLinkMailType: '',
      createTKQCEnabled: false, createTKQCNameEnabled: false, createTKQCName: '',
      createTKQCCountry: '', createTKQCTimeZone: '', createTKQCCurrency: '',
      sharePartnerEnabled: false, sharePartnerUids: [], quantity: 1, delay: 1, tutRegBM: 0,
    },
    createBMVerification: {
      config: 'all', country: '', legalName: '', address1: '', address2: '', city: '', state: '', zipCode: '',
      taxId: '', website: '', phone: '', businessList: [], bmIds: [],
    },
  }
}

/* ── Tab 06: Tương tác kịch bản (frmSetupionOld — Clone Farming) ── */

export interface CloneFarmingConfig {
  /** Gửi lời mời kết bạn theo UID */
  addFriendEnabled: boolean
  addFriendUids: string[]
  /** Chấp nhận lời mời kết bạn theo UID */
  acceptFriendEnabled: boolean
  acceptFriendUids: string[]
  /** Mở vô hiệu hóa TK */
  unlockDisableEnabled: boolean
  /** Vô hiệu hóa TK */
  disableEnabled: boolean
  /** Vô hiệu hóa TK Vĩnh Viễn */
  disablePermanentEnabled: boolean
  /** Quét ID Page trong thư viện quảng cáo */
  scanPageInAdLibraryEnabled: boolean
  scanPageKeywords: string
  /** Quét thư viện quảng cáo của trang */
  scanAdLibraryEnabled: boolean
  scanAdLibraryPageIds: string[]
  scanAdLibraryPagesPerThread: number
  /** Kick TKCN 250 */
  kick250Enabled: boolean
  kick250CloseCount: number
  kick250DelayFrom: number
  kick250DelayTo: number
  /** Kick BM3 */
  kickBM3Enabled: boolean
  /** Tut In Tiền */
  tutInMoneyEnabled: boolean
  /** Tut In Tiền v2.0 */
  tutInMoneyV2Enabled: boolean
  /** ID bài viết */
  postId: string
  /** Kiểm tra: Pass FB */
  checkPassFBEnabled: boolean
  /** Kiểm tra: Mail liên kết */
  checkMailFBEnabled: boolean
  /** Add btn */
  addBtnEnabled: boolean
}

export function defaultCloneFarmingConfig(): CloneFarmingConfig {
  return {
    addFriendEnabled: false,
    addFriendUids: [],
    acceptFriendEnabled: false,
    acceptFriendUids: [],
    unlockDisableEnabled: false,
    disableEnabled: false,
    disablePermanentEnabled: false,
    scanPageInAdLibraryEnabled: false,
    scanPageKeywords: '',
    scanAdLibraryEnabled: false,
    scanAdLibraryPageIds: [],
    scanAdLibraryPagesPerThread: 1,
    kick250Enabled: false,
    kick250CloseCount: 1,
    kick250DelayFrom: 1,
    kick250DelayTo: 5,
    kickBM3Enabled: false,
    tutInMoneyEnabled: false,
    tutInMoneyV2Enabled: false,
    postId: '',
    checkPassFBEnabled: false,
    checkMailFBEnabled: false,
    addBtnEnabled: false,
  }
}

/* ── Tab 10: Cá nhân / TUT Premium (frmTUTPremium — 7 types) ── */

export type TUTType =
  | 'regAdAccountBM'   // 01: Tạo VH TKQC trong BM
  | 'divideAdAccount'  // 02: Tách vô hạn
  | 'nolimit250'       // 03: Nolimit 250
  | 'lgbt'             // 04: Lưỡng tính
  | 'bm5'              // 05: Kích BM3-BM5
  | 'activeBM10'       // 06: Kích BM10
  | 'activeBM2500'     // 07: Kích BM2500

export const TUT_TYPES: readonly { value: TUTType; label: string }[] = [
  { value: 'regAdAccountBM', label: 'Tạo VH TKQC trong BM' },
  { value: 'divideAdAccount', label: 'Tách vô hạn' },
  { value: 'nolimit250', label: 'Nolimit 250' },
  { value: 'lgbt', label: 'Lưỡng tính' },
  { value: 'bm5', label: 'Kích BM3-BM5' },
  { value: 'activeBM10', label: 'Kích BM10' },
  { value: 'activeBM2500', label: 'Kích BM2500' },
]

/** TUT 01: Tạo VH TKQC trong BM */
export interface TUTRegAdAccountBMConfig {
  unlimitedAccount1: boolean
  unlimitedAccount3: boolean
  name: string
  nameGroup: string
  quantity: number
  account1Config: number  // index in combo: TUT 1, TUT whatapp die, TUT BM chưa tạo app, TUT 4
  bmListIds: string[]
}

/** TUT 02: Tách vô hạn */
export interface TUTDivideConfig {
  typeAccount1: boolean
  typeAccount2: boolean
  typeAccount3: boolean
  typeMode: number
  name: string
  quantity: number
  delay: number
  bmListIds: string[]
  persist: boolean
  reOpenRepeat: boolean
  outBM: boolean
}

/** TUT 03: Nolimit 250 */
export interface TUTNolimit250Config {
  noLimit: boolean; bm50: boolean; bm250: boolean
  changeName: boolean; name: string; timeZone: string; country: string; currency: string
  changeTKQC: boolean
  /** Share TKQC section */
  shareTKQC: boolean; shareTKQCNLM: boolean; shareTKQC50: boolean; shareTKQC250: boolean
  shareFullTKQC: boolean; shareTKQCbyList: boolean; shareTKQCList: string[]
  shareAccountMax9: boolean; maxAccounts: number
  onlyShareTKQCLive: boolean
  /** Share BM section */
  shareBM: boolean; shareTKQCToBMNLM: boolean; shareTKQCToBM50: boolean; shareTKQCToBM250: boolean
  shareTKQConBM: number; bmReceiveIds: string[]; bmReceiveFolder: string; tkqcReceiveFolder: string
  /** Cấu hình thoát */
  out: boolean; outAllTKQC: boolean; deleteAdmin: boolean; deleteAdminHide: boolean
  deleteOutAllBM: boolean; outByListUID: boolean; outByListUIDs: string[]
  /** Other */
  ripAfterShare: boolean; unfriendAfterShare: boolean
  pauseFrom: number; pauseTo: number; regCount: number
}

/** TUT 04: Lưỡng tính */
export interface TUTLgbtConfig {
  enabled: boolean
}

/** TUT 05: Kích BM3-BM5 */
export interface TUTBM5Config {
  config: 'all' | 'byId'
  typeBM: 'all' | 'bm350' | 'bm50' | 'bm50_350' | 'bm250' | 'bmNolimit'
  loops: number
  delay: number
  stopOnFail: number
  method: 'bm5new' | 'apinew'
  bmIds: string[]
  checkBM: boolean
  notDelete: boolean
  deleteData: boolean
}

/** TUT 06: Kích BM10 */
export interface TUTBM10Config {
  config: number
  listRun: string
  call: boolean
  kick10: boolean
}

/** TUT 07: Kích BM2500 */
export interface TUTBM2500Config {
  config: number
  listAdAccount: string
  listIDBM: string
  call: boolean
  kick10: boolean
}

export interface TUTPremiumConfig {
  selectedType: TUTType
  regAdAccountBM: TUTRegAdAccountBMConfig
  divide: TUTDivideConfig
  nolimit250: TUTNolimit250Config
  lgbt: TUTLgbtConfig
  bm5: TUTBM5Config
  activeBM10: TUTBM10Config
  activeBM2500: TUTBM2500Config
}

export function defaultTUTPremiumConfig(): TUTPremiumConfig {
  return {
    selectedType: 'regAdAccountBM',
    regAdAccountBM: {
      unlimitedAccount1: false, unlimitedAccount3: false,
      name: '', nameGroup: '', quantity: 1, account1Config: 0, bmListIds: [],
    },
    divide: {
      typeAccount1: false, typeAccount2: false, typeAccount3: false,
      typeMode: 0, name: '', quantity: 1, delay: 5, bmListIds: [],
      persist: false, reOpenRepeat: false, outBM: false,
    },
    nolimit250: {
      noLimit: false, bm50: false, bm250: false,
      changeName: false, name: '', timeZone: '', country: '', currency: '',
      changeTKQC: false,
      shareTKQC: false, shareTKQCNLM: false, shareTKQC50: false, shareTKQC250: false,
      shareFullTKQC: false, shareTKQCbyList: false, shareTKQCList: [],
      shareAccountMax9: false, maxAccounts: 9, onlyShareTKQCLive: false,
      shareBM: false, shareTKQCToBMNLM: false, shareTKQCToBM50: false, shareTKQCToBM250: false,
      shareTKQConBM: 1, bmReceiveIds: [], bmReceiveFolder: '', tkqcReceiveFolder: '',
      out: false, outAllTKQC: false, deleteAdmin: false, deleteAdminHide: false,
      deleteOutAllBM: false, outByListUID: false, outByListUIDs: [],
      ripAfterShare: false, unfriendAfterShare: false,
      pauseFrom: 1, pauseTo: 5, regCount: 1,
    },
    lgbt: { enabled: false },
    bm5: {
      config: 'all', typeBM: 'all', loops: 1, delay: 5, stopOnFail: 3,
      method: 'bm5new', bmIds: [], checkBM: false, notDelete: false, deleteData: false,
    },
    activeBM10: { config: 0, listRun: '', call: false, kick10: false },
    activeBM2500: { config: 0, listAdAccount: '', listIDBM: '', call: false, kick10: false },
  }
}

/* ── Tabs 03-09: Remaining tab configs ── */

/** Tab 03: Page */
export interface PageInteractionConfig {
  likePage: boolean
  sharePage: boolean
  commentPage: boolean
}

/** Tab 04: Share TKQC */
export interface ShareTKQCConfig {
  quantityPerBM: number
  receiverUid: string
  shareBySpecificUid: boolean
  bmType: string
  tkqcList: string[]
  mailType: string
}

/** Tab 05: Lên camp && Add thẻ */
export interface CampaignConfig {
  campaignName: string
  budget: number
  targeting: string
  addCard: boolean
}

/** Tab 07: Cập nhật thông tin */
export interface UpdateInfoConfig {
  updateName: boolean
  updateAvatar: boolean
  updateCover: boolean
  updateBio: boolean
  updateBirthday: boolean
  updateLocation: boolean
}

/** Tab 08: Gỡ checkpoint */
export interface CheckpointConfig {
  cpType: string
  method: string
  delay: number
}

/** Tab 09: Kháng tài khoản */
export interface AccountResistConfig {
  appeal: boolean
  verifyIdentity: boolean
}

/* ── Master interaction config (all 10 tabs) ── */

export interface ConfigInteraction {
  /** Tab 01 */
  checkInfo: CheckInfoConfig
  /** Tab 02 */
  bm: BMInteractionConfig
  /** Tab 03 */
  page: PageInteractionConfig
  /** Tab 04 */
  shareTKQC: ShareTKQCConfig
  /** Tab 05 */
  campaign: CampaignConfig
  /** Tab 06 */
  cloneFarming: CloneFarmingConfig
  /** Tab 07 */
  updateInfo: UpdateInfoConfig
  /** Tab 08 */
  checkpoint: CheckpointConfig
  /** Tab 09 */
  accountResist: AccountResistConfig
  /** Tab 10 */
  tutPremium: TUTPremiumConfig
}

/* ── View/Display configuration (frmSetupView) ── */

export interface ViewConfig {
  columns: ColumnVisibility[]
}

export interface ColumnVisibility {
  key: string
  label: string
  visible: boolean
  group: ColumnGroup
}

export type ColumnGroup = 'account' | 'info' | 'ads' | 'action'
