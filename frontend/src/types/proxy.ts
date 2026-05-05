export type ProxyType = 'http' | 'socks5'
export type ProxyProvider = 'static' | 'shoplike' | 'tinsoft' | 'netproxy' | 'xproxy' | 'minproxy' | 'fpt' | 'hma'
export type ProxyStatus = 'active' | 'dead' | 'unknown'

export interface Proxy {
  id: number
  host: string
  port: number
  username: string
  password: string
  type: ProxyType
  provider: ProxyProvider | string
  status: ProxyStatus
  lastCheck: string
  responseTime: number
  createdAt: string
}

/** Format: host:port:username:password */
export type ProxyString = string

export interface ProxyTestResult {
  proxy: string
  success: boolean
  ip: string
  responseTime: number
  error: string
}

/** Provider-specific config for dynamic IP rotation */
export interface ProviderConfig {
  provider: ProxyProvider
  apiKey: string
  apiUrl: string
  options: Record<string, unknown>
}
