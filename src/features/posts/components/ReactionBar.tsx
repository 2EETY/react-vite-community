import { useAuthGuard } from '@/features/auth/useAuthGuard'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { usePostStore } from '@/stores/postStore'
import { toast } from '@/stores/toastStore'
import type { Post } from '@/types'

interface ReactionBarProps {
  post: Post
}

const pillClass = (active: boolean) =>
  cn(
    'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[15px] transition-colors disabled:opacity-60',
    active ? 'border-ink text-ink' : 'border-line bg-surface text-ink-soft hover:border-ink hover:text-ink',
  )

export const ReactionBar = ({ post }: ReactionBarProps) => {
  const userId = useAuthStore((s) => s.user?.id ?? null)
  const toggleLike = usePostStore((s) => s.toggleLike)
  const toggleBookmark = usePostStore((s) => s.toggleBookmark)
  const likePending = usePostStore((s) => !!s.pending[`likedBy:${post.id}`])
  const savePending = usePostStore((s) => !!s.pending[`bookmarkedBy:${post.id}`])
  const guard = useAuthGuard()

  const liked = userId !== null && post.likedBy.includes(userId)
  const saved = userId !== null && post.bookmarkedBy.includes(userId)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast('글 주소를 복사했어요.')
    } catch {
      toast('주소를 복사하지 못했어요. 주소창에서 직접 복사해 주세요.', 'error')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-pressed={liked}
        disabled={likePending}
        onClick={() => guard(() => void toggleLike(post.id), '로그인하면 공감할 수 있어요.')}
        className={pillClass(liked)}
      >
        {/* key를 바꿔 공감할 때마다 형광펜 애니메이션을 다시 재생한다 */}
        <span key={String(liked)} className={cn('px-0.5 font-semibold', liked && 'marker marker-draw')}>
          공감
        </span>
        <span className="tabular-nums">{post.likedBy.length}</span>
      </button>

      <button
        type="button"
        aria-pressed={saved}
        disabled={savePending}
        onClick={() =>
          guard(() => {
            void toggleBookmark(post.id)
            toast(saved ? '북마크에서 뺐어요.' : '북마크에 담았어요. 목록의 내 북마크에서 볼 수 있어요.')
          }, '로그인하면 북마크할 수 있어요.')
        }
        className={pillClass(saved)}
      >
        <BookmarkIcon filled={saved} />
        {saved ? '북마크함' : '북마크'}
      </button>

      <button type="button" onClick={copyLink} className={pillClass(false)}>
        주소 복사
      </button>
    </div>
  )
}

const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg aria-hidden width="14" height="16" viewBox="0 0 14 16" className="shrink-0">
    <path
      d="M1.5 1.5h11v13L7 11l-5.5 3.5z"
      fill={filled ? 'var(--color-highlight)' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)
