import type { App } from 'vue'
import { vCan } from './v-can'
import { vFlag } from './v-flag'
import { vReveal } from './v-reveal'

export { vCan, vFlag, vReveal }

/**
 * registerDirectives(app) — đăng ký 1 phát mọi directive WemakeUI.
 * Caller có thể đăng ký từng cái thủ công nếu muốn tree-shake hơn.
 */
export function registerDirectives(app: App) {
  app.directive('can', vCan)
  app.directive('flag', vFlag)
  app.directive('reveal', vReveal)
  return app
}
