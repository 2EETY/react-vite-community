import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ArrowLeftIcon } from '@/components/ui/Icon'
import { RichText } from '@/components/ui/RichText'
import { buttonClass } from '@/components/ui/styles'
import { CommentSection } from '@/features/comments/CommentSection'
import { ReactionBar } from '@/features/posts/components/ReactionBar'
import { StatusBadge } from '@/features/posts/components/StatusBadge'
import { errorMessage, timeAgo } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { usePostStore } from '@/stores/postStore'
import { toast } from '@/stores/toastStore'
import { NotFoundMessage } from './NotFoundPage'

const PostDetailPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const post = usePostStore((s) => s.posts[id])
  const status = usePostStore((s) => s.status)
  const deletePost = usePostStore((s) => s.deletePost)
  const userId = useAuthStore((s) => s.user?.id ?? null)

  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!post) {
    if (status === 'ready' || status === 'error') {
      return <NotFoundMessage title="글을 찾을 수 없어요" description="삭제되었거나 주소가 잘못되었어요." />
    }
    return <p className="py-16 text-center text-pencil" role="status">글을 불러오는 중이에요.</p>
  }

  const isMine = userId === post.authorId
  const edited = post.updatedAt > post.createdAt

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deletePost(post.id)
      toast('글을 삭제했어요.')
      navigate('/', { replace: true })
    } catch (e) {
      toast(errorMessage(e), 'error')
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/" className="ml-7 inline-flex items-center gap-1.5 text-sm text-pencil hover:text-ink sm:ml-16">
        <ArrowLeftIcon size={15} />
        목록으로
      </Link>

      {/* 댓글 영역과 같은 위치에 여백선을 그어 글과 답변이 한 장의 노트로 이어지게 한다 */}
      <article className="margin-rule -mx-4 mt-4 pr-4 pl-11 [--margin-x:1.75rem] sm:mx-0 sm:pr-0 sm:pl-16 sm:[--margin-x:2.5rem]">
        <header className="border-b border-line pb-5">
          <StatusBadge post={post} />
          <h1 className="mt-2 text-[26px] leading-tight font-extrabold tracking-tight text-balance sm:text-3xl">{post.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-pencil">
            <span className="font-semibold text-ink">{post.authorName}</span>
            <time dateTime={new Date(post.createdAt).toISOString()}>{timeAgo(post.createdAt)}</time>
            {edited && <span>수정됨</span>}
            {isMine && (
              <span className="ml-auto flex gap-1">
                <Link to={`/posts/${post.id}/edit`} className={buttonClass('ghost', 'sm')}>
                  수정
                </Link>
                <button type="button" onClick={() => setConfirming(true)} className={buttonClass('ghost', 'sm')}>
                  삭제
                </button>
              </span>
            )}
          </div>
        </header>

        <RichText text={post.body} className="py-7 text-[16.5px] leading-[1.8] text-ink" />

        {post.tags.length > 0 && (
          <ul className="mb-6 -ml-1 flex flex-wrap gap-x-1" aria-label="태그">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  to={`/?tag=${encodeURIComponent(tag)}`}
                  aria-label={`태그 ${tag}가 달린 글 보기`}
                  className="inline-block px-1 py-2 text-[15px] text-pencil underline-offset-4 hover:text-ink hover:underline"
                >
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <ReactionBar post={post} />
      </article>

      <div className="-mx-4 sm:mx-0">
        <CommentSection post={post} />
      </div>

      <ConfirmDialog
        open={confirming}
        title="글을 삭제할까요?"
        description={`달린 ${post.category === 'question' ? '답변' : '댓글'} ${post.commentCount}개도 함께 지워지고, 되돌릴 수 없어요.`}
        confirmLabel="삭제"
        tone="danger"
        loading={deleting}
        onCancel={() => setConfirming(false)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}

export default PostDetailPage
