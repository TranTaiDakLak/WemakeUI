/**
 * ═══════════════════════════════════════════════════════════════
 *  WX UI SYSTEM — I18n Composable
 *  Simple label override system for component default texts.
 *
 *  Usage:
 *    import { setLocale, t } from '@/composables/useI18n'
 *    setLocale('en')
 *    t('pagination.showing')  // "Showing"
 * ═══════════════════════════════════════════════════════════════
 */
import { reactive } from 'vue'

export type Locale = 'vi' | 'en'

const messages: Record<Locale, Record<string, string>> = {
  vi: {
    // Pagination
    'pagination.showing': 'Hiển thị',
    'pagination.of': 'trên',
    'pagination.perPage': 'Mỗi trang',

    // Empty state
    'empty.message': 'Không có dữ liệu',
    'empty.description': 'Không tìm thấy kết quả nào.',

    // Loading
    'loading.message': 'Đang tải...',
    'loading.data': 'Đang tải dữ liệu...',

    // File upload
    'fileUpload.dragDrop': 'Kéo thả file hoặc',
    'fileUpload.clickToSelect': 'nhấn để chọn',
    'fileUpload.maxSize': 'Tối đa',
    'fileUpload.accepted': 'Chấp nhận',

    // Dialog
    'dialog.confirm': 'Xác nhận',
    'dialog.cancel': 'Huỷ',
    'dialog.close': 'Đóng',
    'dialog.ok': 'Đồng ý',
    'dialog.yes': 'Có',
    'dialog.no': 'Không',

    // Table
    'table.noData': 'Không có dữ liệu',
    'table.loading': 'Đang tải dữ liệu...',

    // Search
    'search.placeholder': 'Tìm kiếm...',

    // Toast
    'toast.info': 'Thông tin',
    'toast.success': 'Thành công',
    'toast.warning': 'Cảnh báo',
    'toast.error': 'Lỗi',

    // Form
    'form.required': 'Trường này bắt buộc',
    'form.invalid': 'Giá trị không hợp lệ',
  },

  en: {
    'pagination.showing': 'Showing',
    'pagination.of': 'of',
    'pagination.perPage': 'Per page',
    'empty.message': 'No data',
    'empty.description': 'No results found.',
    'loading.message': 'Loading...',
    'loading.data': 'Loading data...',
    'fileUpload.dragDrop': 'Drag & drop files or',
    'fileUpload.clickToSelect': 'click to browse',
    'fileUpload.maxSize': 'Max size',
    'fileUpload.accepted': 'Accepted',
    'dialog.confirm': 'Confirm',
    'dialog.cancel': 'Cancel',
    'dialog.close': 'Close',
    'dialog.ok': 'OK',
    'dialog.yes': 'Yes',
    'dialog.no': 'No',
    'table.noData': 'No data',
    'table.loading': 'Loading data...',
    'search.placeholder': 'Search...',
    'toast.info': 'Info',
    'toast.success': 'Success',
    'toast.warning': 'Warning',
    'toast.error': 'Error',
    'form.required': 'This field is required',
    'form.invalid': 'Invalid value',
  },
}

const state = reactive({
  locale: 'vi' as Locale,
  overrides: {} as Record<string, string>,
})

export function setLocale(locale: Locale) {
  state.locale = locale
}

export function getLocale(): Locale {
  return state.locale
}

export function t(key: string, fallback?: string): string {
  if (state.overrides[key]) return state.overrides[key]
  return messages[state.locale]?.[key] ?? fallback ?? key
}

export function setOverride(key: string, value: string) {
  state.overrides[key] = value
}

export function useI18n() {
  return { t, setLocale, getLocale, setOverride }
}
