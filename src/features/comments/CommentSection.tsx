import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { buttonClass, notebookRow, notebookSheet } from '@/components/ui/styles'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { useCommentStore } from '@/stores/commentStore'
import { toast } from '@/stores/toastStore'
import type { Comment, Post } from '@/types'
import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'

interface CommentSectionProps {
  post: Post
}

const EMPTY: Comment[] = []

export const CommentSection = ({ post }: CommentSectionProps) => {
  const user = useAuthStore((s) => s.user)
  const comments = useCommentStore((s) => s.byPost[post.id] ?? EMPTY)
  const loaded = useCommentStore((s) => post.id in s.byPost)
  const fetchComments = useCommentStore((s) => s.fetchComments)
  const addComment = useCommentStore((s) => s.addComment)
  const location = useLocation()
  const [justAcceptedId, setJustAcceptedId] = useState<string | null>(null)

  // 글이 바뀔 때마다 서버에서 댓글을 불러오는 '외부 시스템과의 동기화'라 effect가 맞다
  useEffect(() => {
    void fetchComments(post.id)
  }, [post.id, fetchComments])

  // 채택된 답변을 맨 위로, 나머지는 작성 순서대로
  const sorted = useMemo(
    () =>
      [...comments].sort((a, b) => {
        if (a.id === post.acceptedCommentId) return -1
        if (b.id === post.acceptedCommentId) return 1
        return a.createdAt - b.createdAt
      }),
    [comments, post.acceptedCommentId],
  )

  const isQuestion = post.category === 'question'
  const noun = isQuestion ? '답변' : '댓글'
  const isPostAuthor = user?.id === post.authorId

  return (
    <section aria-labelledby="comments-heading" className="mt-10">
      <h2 id="comments-heading" className="pl-11 text-lg font-bold sm:pl-16">
        {noun} <span className="text-pencil tabular-nums">{post.commentCount}</span>
      </h2>

      <div className={cn('mt-4', notebookSheet)}>
        {!loaded ? (
          <p className={cn('py-8 text-sm text-pencil', notebookRow)}>{noun}을 불러오는 중이에요.</p>
        ) : sorted.length === 0 ? (
          <p className={cn('py-8 text-[15px] text-ink-soft', notebookRow)}>
            {isQuestion ? '아직 답변이 없어요. 알고 있는 걸 나눠 주세요.' : '첫 댓글을 남겨 보세요.'}
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {sorted.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                isMine={user?.id === c.authorId}
                isAccepted={c.id === post.acceptedCommentId}
                canAccept={isQuestion && isPostAuthor && c.authorId !== post.authorId}
                justAccepted={c.id === justAcceptedId}
                onAccepted={setJustAcceptedId}
              />
            ))}
          </ul>
        )}

        <div className={cn('border-t border-line py-5', notebookRow)}>
          {user ? (
            <CommentForm
              id="new-comment"
              label={`${noun} 쓰기`}
              submitLabel={`${noun} 등록`}
              placeholder={isQuestion ? '알고 있는 내용을 적어 주세요. 코드나 링크를 곁들이면 더 좋아요.' : `${noun}을 남겨 주세요.`}
              onSubmit={async (body) => {
                await addComment(post.id, body)
                toast(`${noun}을 등록했어요.`)
              }}
            />
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[15px] text-ink-soft">로그인하면 {noun}을 남길 수 있어요.</p>
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className={buttonClass('secondary', 'sm')}
              >
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
