import { useSearchParams } from 'react-router-dom'
import type { Category } from '@/types'

export type SortKey = 'latest' | 'likes' | 'comments'
export type StatusKey = 'all' | 'open' | 'solved'
export type CategoryKey = Category | 'all'

export interface PostFilters {
  q: string
  cat: CategoryKey
  status: StatusKey
  tag: string | null
  sort: SortKey
  saved: boolean
}

type FilterParam = 'q' | 'cat' | 'status' | 'tag' | 'sort' | 'view'

const pick = <T extends string>(value: string | null, allowed: readonly T[], fallback: T): T =>
  allowed.find((a) => a === value) ?? fallback

/**
 * 검색·필터 상태를 전역 스토어가 아닌 URL 쿼리스트링에 둔다.
 * 새로고침하거나 링크를 공유해도 같은 목록이 보이고, 뒤로 가기도 자연스럽게 동작한다.
 */
export const usePostFilters = () => {
  const [params, setParams] = useSearchParams()

  const filters: PostFilters = {
    q: params.get('q') ?? '',
    cat: pick(params.get('cat'), ['all', 'question', 'diary', 'chat'], 'all'),
    status: pick(params.get('status'), ['all', 'open', 'solved'], 'all'),
    tag: params.get('tag'),
    sort: pick(params.get('sort'), ['latest', 'likes', 'comments'], 'latest'),
    saved: params.get('view') === 'saved',
  }

  const update = (patch: Partial<Record<FilterParam, string | null>>) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(patch)) {
          if (value === null || value === undefined || value === '') next.delete(key)
          else next.set(key, value)
        }
        return next
      },
      { replace: true },
    )
  }

  const reset = () => setParams({}, { replace: true })

  return { filters, update, reset }
}
