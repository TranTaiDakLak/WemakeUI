/**
 * Mock Authentication Helper — Frontend only
 * KHÔNG gọi API thật. Chỉ dùng để demo UI flow.
 *
 * Mock rules:
 *  - Email chứa "fail" → mock failure
 *  - Mọi email khác hợp lệ → mock success sau 1s delay
 */

export interface LoginPayload {
  softwareCode: string
  email: string
  password: string
}

export interface LoginResult {
  success: boolean
  user?: {
    email: string
    displayName: string
    expiredDate: string
    version: string
  }
}

export function mockLogin(payload: LoginPayload): Promise<LoginResult> {
  const delay = 800 + Math.random() * 700 // 800–1500ms

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock failure: email chứa "fail"
      if (payload.email.toLowerCase().includes('fail')) {
        reject(new Error('Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.'))
        return
      }

      // Mock success
      resolve({
        success: true,
        user: {
          email: payload.email,
          displayName: 'Wemake User',
          expiredDate: '30/12/2026',
          version: '25.06.01',
        },
      })
    }, delay)
  })
}
