import type { Category, Provider } from '@/types'

/** 조건부 className 결합. clsx/tailwind-merge 도입 전까지 쓰는 최소 버전 */
export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export const CATEGORY_LABEL: Record<Category, string> = {
  question: '질문',
  diary: '일기',
  chat: '잡담',
}

export const PROVIDER_LABEL: Record<Provider, string> = {
  google: 'Google',
  github: 'GitHub',
  kakao: '카카오',
}

const rtf = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' })

export const timeAgo = (ts: number) => {
  const sec = (ts - Date.now()) / 1000
  const abs = Math.abs(sec)
  if (abs < 60) return '방금 전'
  if (abs < 3600) return rtf.format(Math.round(sec / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round(sec / 3600), 'hour')
  if (abs < 86400 * 7) return rtf.format(Math.round(sec / 86400), 'day')
  return new Date(ts).toLocaleDateString('ko-KR')
}

export const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : '알 수 없는 문제가 생겼어요. 잠시 뒤 다시 시도해 주세요.'
