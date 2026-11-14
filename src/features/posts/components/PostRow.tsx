import { Link } from 'react-router-dom'
import { HighlightText } from '@/components/ui/HighlightText'
import { cn, timeAgo } from '@/lib/utils'
import type { Post } from '@/types'
import { StatusBadge } from './StatusBadge'

interface PostRowProps {
  post: Post
  query: string
  activeTag: string | null
  userId: string | null
  onTagClick: (tag: string) => void
}

export const PostRow = ({ post, query, activeTag, userId, onTagClick }: PostRowProps) => {
  const liked = userId !== null && post.likedBy.includes(userId)
  const saved = userId !== null && post.bookmarkedBy.includes(userId)
  const flat = post.body.replace(/\s+/g, ' ')
  const excerpt = flat.length > 140 ? `${flat.slice(0, 140).trimEnd()}…` : flat

  return (
    <article className="relative px-4 py-5 transition-colors hover:bg-paper sm:px-6">
      <div className="flex items-center gap-2">
        <StatusBadge post={post} />
        {saved && <span className="text-xs text-pencil">북마크함</span>}
      </div>

      <h2 className="mt-2 text-[17px] leading-snug font-bold text-ink">
        {/* 제목 링크를 행 전체로 늘려서 어디를 눌러도 글로 들어가게 한다 */}
        <Link to={`/posts/${post.id}`} className="after:absolute after:inset-0">
          <HighlightText text={post.title} query={query} />
        </Link>
      </h2>
      <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-ink-soft">
        <HighlightText text={excerpt} query={query} />
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-pencil">
        {post.tags.length > 0 && (
          <ul className="relative z-10 flex flex-wrap gap-1.5" aria-label="태그">
            {post.tags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => onTagClick(tag)}
                  aria-pressed={activeTag === tag}
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
                    activeTag === tag ? 'bg-ink text-on-ink' : 'bg-line-soft text-ink-soft hover:bg-line',
                  )}
                >
                  #{tag}
                </button>
              </li>
            ))}
          </ul>
        )}
        <span className="text-ink-soft">{post.authorName}</span>
        <time dateTime={new Date(post.createdAt).toISOString()}>{timeAgo(post.createdAt)}</time>
        <span className={cn(liked && 'font-semibold text-ink')}>공감 {post.likedBy.length}</span>
        <span>
          {post.category === 'question' ? '답변' : '댓글'} {post.commentCount}
        </span>
      </div>
    </article>
  )
}
