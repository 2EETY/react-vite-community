import { CheckIcon } from '@/components/ui/Icon'
import { CATEGORY_LABEL } from '@/lib/utils'
import type { Post } from '@/types'

interface StatusBadgeProps {
  post: Pick<Post, 'category' | 'acceptedCommentId'>
}

/**
 * 질문은 해결 여부를, 나머지는 글 종류를 보여준다.
 * 형광펜은 '고른 값·현재 위치'에만 쓰기로 했으니, 상태는 잉크 테두리와 체크 표시로 나타낸다.
 */
export const StatusBadge = ({ post }: StatusBadgeProps) => {
  if (post.category !== 'question') {
    return <span className="text-xs font-semibold text-pencil">{CATEGORY_LABEL[post.category]}</span>
  }
  return post.acceptedCommentId ? (
    <span className="inline-flex items-center gap-1 rounded-sm border border-ink px-1.5 py-px text-xs font-bold text-ink">
      <CheckIcon size={12} strokeWidth={2.5} />
      해결된 질문
    </span>
  ) : (
    <span className="inline-flex items-center rounded-sm border border-line px-1.5 py-px text-xs font-semibold text-ink-soft">
      답변을 기다리는 질문
    </span>
  )
}
