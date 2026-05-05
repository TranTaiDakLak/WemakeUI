/** Account — core entity (68 fields, matches WeBM C# schema + SQLite accounts table) */
export interface Account {
  id: number
  uid: string
  password: string
  twofa: string
  email: string
  passEmail: string
  emailRecovery: string
  inputAccount: string
  cookie: string
  token: string
  status: AccountStatus
  status282: string
  statusAds: string
  bm: string
  tkqc: string
  chatSupport: string
  fullName: string
  friends: number
  follower: number
  post: number
  gender: string
  birthday: string
  location: string
  hometown: string
  currentCity: string
  requestFriends: number
  dateCreated: string
  groupJoined: string
  groupManager: string
  page: string
  pageManager: string
  avatar: string
  cover: string
  professional: string
  dating: string
  secondAccount: string
  marketplace: string
  emailOther: string
  phone: string
  proxy: string
  ua: string
  profileChrome: string
  backupRequest: string
  note: string
  noteRun: string
  noteSystem: string
  dateImport: string
  categoryId: number | null
  clientId: string
  refreshToken: string
  oauth2: string
  lastRun: string
  run: string
  cookieAndroid: string
  cookieIos: string
  cookieInsta: string
  cookieOther: string
  tokenAndroid: string
  tokenIos: string
  tokenInsta: string
  tokenEaag: string
  tokenOther: string
  token001: string
  uaAndroid: string
  uaIos: string
  isDeleted: boolean
  deletedAt: string
  createdAt: string
  updatedAt: string
}

export type AccountStatus = 'Live' | 'Die' | 'Checkpoint' | 'None' | ''

/** DataGrid row — Account + UI-only fields for selection */
export interface AccountRow extends Account {
  chose: boolean
}

/** Create an AccountRow with default empty values */
export function createEmptyAccountRow(overrides: Partial<AccountRow> & { id: number; uid: string }): AccountRow {
  return {
    password: '',
    twofa: '',
    email: '',
    passEmail: '',
    emailRecovery: '',
    inputAccount: '',
    cookie: '',
    token: '',
    status: '',
    status282: '',
    statusAds: '',
    bm: '',
    tkqc: '',
    chatSupport: '',
    fullName: '',
    friends: 0,
    follower: 0,
    post: 0,
    gender: '',
    birthday: '',
    location: '',
    hometown: '',
    currentCity: '',
    requestFriends: 0,
    dateCreated: '',
    groupJoined: '',
    groupManager: '',
    page: '',
    pageManager: '',
    avatar: '',
    cover: '',
    professional: '',
    dating: '',
    secondAccount: '',
    marketplace: '',
    emailOther: '',
    phone: '',
    proxy: '',
    ua: '',
    profileChrome: '',
    backupRequest: '',
    note: '',
    noteRun: '',
    noteSystem: '',
    dateImport: '',
    categoryId: null,
    clientId: '',
    refreshToken: '',
    oauth2: '',
    lastRun: '',
    run: '',
    cookieAndroid: '',
    cookieIos: '',
    cookieInsta: '',
    cookieOther: '',
    tokenAndroid: '',
    tokenIos: '',
    tokenInsta: '',
    tokenEaag: '',
    tokenOther: '',
    token001: '',
    uaAndroid: '',
    uaIos: '',
    isDeleted: false,
    deletedAt: '',
    createdAt: '',
    updatedAt: '',
    chose: false,
    ...overrides,
  }
}

/** Stats computed from account list */
export interface AccountStats {
  total: number
  live: number
  die: number
  checkpoint: number
  selected: number
  highlighted: number
}

/** Result of bulk import operation */
export interface ImportResult {
  total: number
  success: number
  duplicates: number
  errors: string[]
}

/** Trash item (soft-deleted account) */
export interface TrashItem {
  id: number
  uid: string
  name: string
  deletedAt: string
  reason: string
}
