export type AccountStatus = 'Live' | 'Die' | 'Checkpoint'

export interface AccountRow {
  id: number
  chose: boolean
  uid: string
  password: string
  twofa: string
  email: string
  passEmail: string
  emailRecovery: string
  cookie: string
  token: string
  fullName: string
  friends: number
  follower: number
  statusAds: string
  status: AccountStatus
  categoryId: number | null
  note: string
  ua: string
  uaAndroid: string
  uaIos: string
  birthday: string
  phone: string
  proxy: string
  clientId: string
  refreshToken: string
  oauth2: string
  action: string
  checkpointType: string
}

export interface CategoryItem {
  id: number
  name: string
  count?: number
}
