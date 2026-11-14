import type { Post } from '@/types'
import type { PostFilters, SortKey } from './usePostFilters'

const sorters: Record<SortKey, (a: Post, b: Post) => number> = {
  latest: (a, b) => b.createdAt - a.createdAt,
  likes: (a, b) => b.likedBy.length - a.likedBy.length || b.createdAt - a.createdAt,
  comments: (a, b) => b.commentCount - a.commentCount || b.createdAt - a.createdAt,
}

/**
 * 화면에 보여줄 목록은 state로 따로 저장하지 않고,
 * 원본 글 목록 + 필터 조건으로 매 렌더링마다 계산한다(파생 상태).
 */
export const filterPosts = (posts: Post[], f: PostFilters, userId: string | null) => {
  const q = f.q.trim().toLowerCase()

  return posts
    .filter((p) => {
      if (f.cat !== 'all' && p.category !== f.cat) return false
      if (f.saved && (!userId || !p.bookmarkedBy.includes(userId))) return false
      if (f.tag && !p.tags.includes(f.tag)) return false
      if (f.status !== 'all') {
        if (p.category !== 'question') return false
        const solved = p.acceptedCommentId !== null
        if ((f.status === 'solved') !== solved) return false
      }
      if (q) {
        const haystack = [p.title, p.body, p.authorName, ...p.tags].join('\n').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
    .sort(sorters[f.sort])
}

export const countByCategory = (posts: Post[]) => {
  const counts = { all: posts.length, question: 0, diary: 0, chat: 0 }
  for (const p of posts) counts[p.category] += 1
  return counts
}
