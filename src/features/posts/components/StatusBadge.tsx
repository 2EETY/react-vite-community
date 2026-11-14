import { CATEGORY_LABEL } from '@/lib/utils'
import type { Post } from '@/types'

interface StatusBadgeProps {
  post: Pick<Post, 'category' | 'acceptedCommentId'>
}

/** 질문은 해결 여부를, 나머지는 글 종류를 보여준다 */
export const StatusBadge = ({ post }: StatusBadgeProps) => {
  if (post.category !== 'question') {
    return <span className="text-xs font-semibold text-pencil">{CATEGORY_LABEL[post.category]}</span>
  }
  return post.acceptedCommentId ? (
    <span className="marker px-0.5 text-xs font-bold text-ink">해결된 질문</span>
  ) : (
    <span className="rounded-sm border border-line px-1.5 py-px text-xs font-semibold text-ink-soft">
      답변을 기다리는 질문
    </span>
  )
}
