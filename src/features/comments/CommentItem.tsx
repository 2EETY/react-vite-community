import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { RichText } from '@/components/ui/RichText'
import { notebookRow } from '@/components/ui/styles'
import { cn, errorMessage, timeAgo } from '@/lib/utils'
import { useCommentStore } from '@/stores/commentStore'
import { toast } from '@/stores/toastStore'
import type { Comment } from '@/types'
import { CommentForm } from './CommentForm'

interface CommentItemProps {
  comment: Comment
  isMine: boolean
  isAccepted: boolean
  /** 질문 작성자가 남의 답변을 볼 때만 true */
  canAccept: boolean
  /** 이번 화면에서 방금 채택한 답변이면 형광펜 애니메이션을 재생 */
  justAccepted: boolean
  onAccepted: (commentId: string) => void
}

export const CommentItem = ({ comment, isMine, isAccepted, canAccept, justAccepted, onAccepted }: CommentItemProps) => {
  const editComment = useCommentStore((s) => s.editComment)
  const deleteComment = useCommentStore((s) => s.deleteComment)
  const toggleAccept = useCommentStore((s) => s.toggleAccept)

  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [busy, setBusy] = useState<'delete' | 'accept' | null>(null)

  const run = async (kind: 'delete' | 'accept', task: () => Promise<void>, done: string) => {
    setBusy(kind)
    try {
      await task()
      toast(done)
    } catch (e) {
      toast(errorMessage(e), 'error')
    } finally {
      setBusy(null)
      setConfirmingDelete(false)
    }
  }

  const edited = comment.updatedAt > comment.createdAt

  return (
    <li
      className={cn('py-5', notebookRow, isAccepted && 'bg-accept-wash')}
    >
      {isAccepted && (
        <p className="mb-2 text-sm font-bold text-ink">
          <span className={cn('marker px-0.5', justAccepted && 'marker-draw')}>질문한 사람이 채택한 답변</span>
        </p>
      )}

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
        <span className="font-semibold text-ink">{comment.authorName}</span>
        <time className="text-pencil" dateTime={new Date(comment.createdAt).toISOString()}>
          {timeAgo(comment.createdAt)}
        </time>
        {edited && <span className="text-pencil">수정됨</span>}
      </div>

      {editing ? (
        <div className="mt-3">
          <CommentForm
            id={`edit-${comment.id}`}
            label="댓글 수정"
            submitLabel="수정 저장"
            defaultValue={comment.body}
            autoFocus
            onCancel={() => setEditing(false)}
            onSubmit={async (body) => {
              await editComment(comment.postId, comment.id, body)
              setEditing(false)
              toast('댓글을 수정했어요.')
            }}
          />
        </div>
      ) : (
        <RichText text={comment.body} className="mt-2 text-[15px] leading-relaxed text-ink" />
      )}

      {!editing && (isMine || canAccept) && (
        <div className="mt-3 flex flex-wrap gap-1">
          {canAccept && (
            <Button
              variant={isAccepted ? 'ghost' : 'secondary'}
              size="sm"
              loading={busy === 'accept'}
              onClick={() =>
                run(
                  'accept',
                  async () => {
                    await toggleAccept(comment.postId, comment.id)
                    if (!isAccepted) onAccepted(comment.id)
                  },
                  isAccepted ? '채택을 취소했어요.' : '답변을 채택했어요. 질문이 해결됨으로 바뀌었어요.',
                )
              }
            >
              {isAccepted ? '채택 취소' : '이 답변 채택'}
            </Button>
          )}
          {isMine && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                수정
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(true)}>
                삭제
              </Button>
            </>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="댓글을 삭제할까요?"
        description={isAccepted ? '채택된 답변이라 삭제하면 질문이 다시 미해결로 바뀌어요.' : '삭제한 댓글은 되돌릴 수 없어요.'}
        confirmLabel="삭제"
        tone="danger"
        loading={busy === 'delete'}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => run('delete', () => deleteComment(comment.postId, comment.id), '댓글을 삭제했어요.')}
      />
    </li>
  )
}
