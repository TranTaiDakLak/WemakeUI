import type { App } from 'vue'
import { vCan } from './v-can'
import { vFlag } from './v-flag'

export { vCan, vFlag }

/**
 * registerDirectives(app) — đăng ký 1 phát mọi directive WemakeUI.
 * Caller có thể đăng ký từng cái thủ công nếu muốn tree-shake hơn.
 */
export function registerDirectives(app: App) {
  app.directive('can', vCan)
  app.directive('flag', vFlag)
  return app
}
