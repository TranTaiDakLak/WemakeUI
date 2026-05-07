import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AccountRow, AccountStatus } from '../../types/account'

const MOCK: AccountRow[] = [
  { id: 1, chose: false, uid: '100078234501', password: 'Abc@12345',  twofa: 'XY7K2B', email: 'batcong.vn@gmail.com',   passEmail: 'Gmail@2024', emailRecovery: '', cookie: 'c_user=100078234501;xs=abc123', token: 'EAABwzLixnjYBAO...', fullName: 'Bạt Công',         friends: 4120, follower: 380,  statusAds: 'Hoạt động', status: 'Live',       categoryId: 1, note: '',                    ua: '', uaAndroid: '', uaIos: '', birthday: '15/03/1992', phone: '0901234567', proxy: '103.27.45.1:8080', clientId: '', refreshToken: '', oauth2: '', action: 'Đang chạy',  checkpointType: ''       },
  { id: 2, chose: true,  uid: '100034512678', password: 'Pass@5678',  twofa: '',        email: 'user2@hotmail.com',       passEmail: '',           emailRecovery: '', cookie: '',                                token: 'EABBwzLixnjY...', fullName: 'Trần Văn Bình',    friends: 1250, follower: 90,   statusAds: 'Vô hiệu',  status: 'Die',        categoryId: 1, note: 'tài khoản cũ',        ua: '', uaAndroid: '', uaIos: '', birthday: '22/07/1988', phone: '',           proxy: '',                 clientId: '', refreshToken: '', oauth2: '', action: '',            checkpointType: ''       },
  { id: 3, chose: false, uid: '100056789012', password: 'Xyz@9012',   twofa: 'ABCDEF', email: 'user3@gmail.com',         passEmail: 'GPass@123',  emailRecovery: '', cookie: 'c_user=100056789012;xs=def456', token: '',                fullName: 'Lê Thị Cẩm',      friends: 2800, follower: 450,  statusAds: 'Hoạt động', status: 'Checkpoint', categoryId: 2, note: 'cần gỡ checkpoint',   ua: '', uaAndroid: '', uaIos: '', birthday: '05/11/1995', phone: '0912345678', proxy: '27.72.13.1:3128',  clientId: '', refreshToken: '', oauth2: '', action: '',            checkpointType: 'PHOTO_ID' },
  { id: 4, chose: true,  uid: '100012345678', password: 'MyPass@34',  twofa: '123456', email: 'user4@yahoo.com',         passEmail: '',           emailRecovery: '', cookie: 'c_user=100012345678;xs=ghi789', token: 'EACCwzLixnjY...', fullName: 'Phạm Đức Dũng',   friends: 3500, follower: 720,  statusAds: 'Hoạt động', status: 'Live',       categoryId: 1, note: '',                    ua: '', uaAndroid: '', uaIos: '', birthday: '30/04/1990', phone: '0933445566', proxy: '',                 clientId: '', refreshToken: '', oauth2: '', action: 'Kiểm tra',    checkpointType: ''       },
  { id: 5, chose: false, uid: '100023456789', password: 'Pass@5555',  twofa: '',        email: 'user5@gmail.com',         passEmail: 'Gmail@555',  emailRecovery: '', cookie: '',                                token: '',                fullName: 'Nguyễn Hoàng Em', friends: 800,  follower: 50,   statusAds: 'Không có',  status: 'Die',        categoryId: 3, note: 'die không recover',   ua: '', uaAndroid: '', uaIos: '', birthday: '',           phone: '',           proxy: '',                 clientId: '', refreshToken: '', oauth2: '', action: '',            checkpointType: ''       },
  { id: 6, chose: false, uid: '100067890123', password: 'Secure@66',  twofa: 'G2AMFJ', email: 'user6@outlook.com',       passEmail: '',           emailRecovery: '', cookie: 'c_user=100067890123;xs=jkl012', token: 'EADDwzLixnjY...', fullName: 'Vũ Thị Phượng',   friends: 5200, follower: 1100, statusAds: 'Hoạt động', status: 'Live',       categoryId: 2, note: '',                    ua: '', uaAndroid: '', uaIos: '', birthday: '14/02/1993', phone: '0944556677', proxy: '103.48.12.1:8080', clientId: '', refreshToken: '', oauth2: '', action: 'Đang chạy',  checkpointType: ''       },
  { id: 7, chose: true,  uid: '100078901234', password: 'Abc@77777',  twofa: 'TUVWXY', email: 'user7@gmail.com',         passEmail: 'Gmail@777',  emailRecovery: '', cookie: 'c_user=100078901234;xs=mno345', token: '',                fullName: 'Đinh Quang Giang', friends: 2100, follower: 340,  statusAds: 'Hạn chế',  status: 'Checkpoint', categoryId: 1, note: 'checkpoint 282',      ua: '', uaAndroid: '', uaIos: '', birthday: '09/09/1991', phone: '',           proxy: '',                 clientId: '', refreshToken: '', oauth2: '', action: '',            checkpointType: '282'    },
  { id: 8, chose: false, uid: '100089012345', password: 'Pass@8888',  twofa: '',        email: 'user8@gmail.com',         passEmail: '',           emailRecovery: '', cookie: 'c_user=100089012345;xs=pqr678', token: 'EAEEwzLixnjY...', fullName: 'Trương Thị Hoa',  friends: 1800, follower: 260,  statusAds: 'Hoạt động', status: 'Live',       categoryId: 2, note: '',                    ua: '', uaAndroid: '', uaIos: '', birthday: '20/12/1994', phone: '0955667788', proxy: '',                 clientId: '', refreshToken: '', oauth2: '', action: '',            checkpointType: ''       },
]

export const useAccountsStore = defineStore('wc-accounts', () => {
  const accounts = ref<AccountRow[]>([])
  const highlightedIds = ref<Set<number>>(new Set())
  const searchField = ref('uid')
  const searchQuery = ref('')
  const currentCategoryIds = ref<number[]>([0])
  const sortField = ref('')
  const sortDir = ref<'asc' | 'desc'>('asc')

  const filteredAccounts = computed(() => {
    let list = accounts.value

    if (!currentCategoryIds.value.includes(0)) {
      list = list.filter(a => a.categoryId !== null && currentCategoryIds.value.includes(a.categoryId))
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const field = searchField.value as keyof AccountRow
      list = list.filter(a => String(a[field] ?? '').toLowerCase().includes(q))
    }

    if (sortField.value) {
      const f = sortField.value as keyof AccountRow
      list = [...list].sort((a, b) => {
        const av = a[f], bv = b[f]
        if (av === bv) return 0
        const cmp = av! < bv! ? -1 : 1
        return sortDir.value === 'asc' ? cmp : -cmp
      })
    }

    return list
  })

  const displayRows = computed(() =>
    filteredAccounts.value.map(a => ({
      ...a,
      cookie: a.cookie ? '✓' : '-',
      token:  a.token  ? '✓' : '-',
    }))
  )

  const stats = computed(() => {
    const all = accounts.value
    return {
      live:        all.filter(a => a.status === 'Live').length,
      die:         all.filter(a => a.status === 'Die').length,
      checkpoint:  all.filter(a => a.status === 'Checkpoint').length,
      total:       all.length,
      highlighted: highlightedIds.value.size,
      selected:    all.filter(a => a.chose).length,
    }
  })

  const uniqueStatuses = computed((): AccountStatus[] =>
    [...new Set(accounts.value.map(a => a.status))]
  )
  const uniqueNotes = computed(() =>
    [...new Set(accounts.value.map(a => a.note).filter(Boolean))]
  )
  const uniqueActions = computed(() =>
    [...new Set(accounts.value.map(a => a.action).filter(Boolean))]
  )
  const uniqueCheckpoints = computed(() =>
    [...new Set(accounts.value.map(a => a.checkpointType).filter(Boolean))]
  )

  const allChosen = computed(() =>
    accounts.value.length > 0 && accounts.value.every(a => a.chose)
  )

  function loadMockData() {
    accounts.value = MOCK.map(a => ({ ...a }))
  }

  function selectAll() {
    filteredAccounts.value.forEach(a => { a.chose = true })
  }

  function unselectAll() {
    accounts.value.forEach(a => { a.chose = false })
  }

  function selectHighlighted() {
    accounts.value.forEach((a, idx) => {
      if (highlightedIds.value.has(idx)) a.chose = true
    })
  }

  function selectByStatus(status: AccountStatus) {
    accounts.value.filter(a => a.status === status).forEach(a => { a.chose = true })
  }

  function selectByNote(note: string) {
    accounts.value.filter(a => a.note === note).forEach(a => { a.chose = true })
  }

  function toggleAll(checked: boolean) {
    accounts.value.forEach(a => { a.chose = checked })
  }

  function toggleRow(index: number) {
    const a = filteredAccounts.value[index]
    if (a) a.chose = !a.chose
  }

  function dblclickRow(index: number) {
    const a = filteredAccounts.value[index]
    if (a) a.chose = !a.chose
  }

  function setHighlighted(ids: Set<number>) {
    highlightedIds.value = ids
  }

  function deleteSelected() {
    accounts.value = accounts.value.filter(a => !a.chose)
  }

  function moveToCategory(ids: number[], catId: number) {
    const targets = ids.length > 0 ? ids : accounts.value.filter(a => a.chose).map(a => a.id)
    accounts.value.filter(a => targets.includes(a.id)).forEach(a => { a.categoryId = catId })
  }

  function updateField(ids: number[], field: keyof AccountRow, value: string) {
    accounts.value
      .filter(a => ids.includes(a.id))
      .forEach(a => { (a as Record<string, unknown>)[field] = value })
  }

  function setSort(field: string, dir: 'asc' | 'desc') {
    sortField.value = field
    sortDir.value = dir
  }

  loadMockData()

  return {
    accounts, highlightedIds, searchField, searchQuery, currentCategoryIds,
    filteredAccounts, displayRows, stats, allChosen,
    uniqueStatuses, uniqueNotes, uniqueActions, uniqueCheckpoints,
    loadMockData, selectAll, unselectAll, selectHighlighted, selectByStatus, selectByNote,
    toggleAll, toggleRow, dblclickRow, setHighlighted, deleteSelected, moveToCategory, updateField, setSort,
  }
})
