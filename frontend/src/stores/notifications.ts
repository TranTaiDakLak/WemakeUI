import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type NotifSeverity = 'info' | 'warning' | 'error' | 'success'

export interface AppNotification {
  id: number
  title: string
  body: string
  severity: NotifSeverity
  time: string
  read: boolean
  action?: { label: string; to?: string }
}

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<AppNotification[]>([
    {
      id: 1, title: 'Chiến dịch hoàn thành',
      body: 'Campaign "ZaloBlast_May" đã gửi xong 12,000 tin.',
      severity: 'success', time: '11:30', read: false,
      action: { label: 'Xem báo cáo', to: '/weconnect/campaigns' },
    },
    {
      id: 2, title: 'Cảnh báo session',
      body: '3 phiên kết nối mất và chưa reconnect sau 10 phút.',
      severity: 'warning', time: '11:15', read: false,
      action: { label: 'Xem phiên', to: '/weconnect/sessions' },
    },
    {
      id: 3, title: 'Lỗi webhook',
      body: 'CDN endpoint /media/upload trả về 503.',
      severity: 'error', time: '10:41', read: false,
    },
    {
      id: 4, title: 'Tài khoản mới kết nối',
      body: 'acc_wa_099 đã kết nối thành công.',
      severity: 'info', time: '10:20', read: true,
    },
    {
      id: 5, title: 'Backup hoàn tất',
      body: 'Full backup 2.3GB hoàn thành lúc 03:00.',
      severity: 'success', time: '03:00', read: true,
    },
  ])

  const unreadCount = computed(() => items.value.filter(n => !n.read).length)

  function markRead(id: number) {
    const n = items.value.find(i => i.id === id)
    if (n) n.read = true
  }

  function markAllRead() {
    items.value.forEach(n => { n.read = true })
  }

  function push(notif: Omit<AppNotification, 'id' | 'read'>) {
    items.value.unshift({ ...notif, id: Date.now(), read: false })
  }

  function dismiss(id: number) {
    items.value = items.value.filter(n => n.id !== id)
  }

  return { items, unreadCount, markRead, markAllRead, push, dismiss }
})
