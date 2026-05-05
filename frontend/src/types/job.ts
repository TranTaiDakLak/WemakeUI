/** Job types matching C# WeFacebook task types */
export type JobType =
  | 'check_info'
  | 'check_live'
  | 'interact_like'
  | 'interact_comment'
  | 'interact_share'
  | 'interact_poke'
  | 'interact_add_friend'
  | 'interact_follow'
  | 'interact_join_group'
  | 'interact_react'
  | 'update_info'
  | 'change_password'
  | 'open_browser'
  | 'custom'

export type JobStatusType = 'queued' | 'running' | 'completed' | 'failed' | 'stopped'

export interface Job {
  id: string
  type: JobType
  status: JobStatusType
  config: string
  total: number
  current: number
  success: number
  failed: number
  message: string
  startedAt: string
  completedAt: string
  createdAt: string
}

export interface JobProgress {
  jobId: string
  current: number
  total: number
  success: number
  failed: number
  message: string
  percent: number
}

export interface JobAccountLog {
  id: number
  jobId: string
  accountId: number
  status: 'success' | 'failed' | 'skipped'
  message: string
  durationMs: number
  createdAt: string
}

export interface JobConfig {
  type: JobType
  accountIds: number[]
  options: Record<string, unknown>
}

/** Job status summary (for UI display) */
export interface JobStatus {
  jobId: string
  type: JobType
  status: JobStatusType
  progress: JobProgress
  startedAt: string
  message: string
}

/** Job execution result */
export interface JobResult {
  jobId: string
  status: JobStatusType
  total: number
  success: number
  failed: number
  skipped: number
  duration: number
  errors: string[]
}
