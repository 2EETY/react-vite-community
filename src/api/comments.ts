import { ApiError, clone, delay, readDb, saveDb, uid } from './db'
import { findPost } from './posts'
import type { Comment, Post, User } from '@/types'

interface CommentMutation {
  comment: Comment
  post: Post
}

const findOwnComment = (comments: Comment[], id: string, user: User) => {
  const comment = comments.find((c) => c.id === id)
  if (!comment) throw new ApiError('댓글을 찾을 수 없어요. 이미 삭제되었을 수 있어요.')
  if (comment.authorId !== user.id) throw new ApiError('내가 쓴 댓글만 수정하거나 삭제할 수 있어요.')
  return comment
}

export const commentsApi = {
  async list(postId: string): Promise<Comment[]> {
    await delay()
    return clone(readDb().comments.filter((c) => c.postId === postId))
  },

  async create(postId: string, body: string, user: User): Promise<CommentMutation> {
    await delay()
    const db = readDb()
    const post = findPost(db, postId)
    const now = Date.now()
    const comment: Comment = {
      id: uid(),
      postId,
      authorId: user.id,
      authorName: user.nickname,
      body,
      createdAt: now,
      updatedAt: now,
    }
    db.comments.push(comment)
    post.commentCount += 1
    saveDb(db)
    return clone({ comment, post })
  },

  async update(id: string, body: string, user: User): Promise<Comment> {
    await delay()
    const db = readDb()
    const comment = findOwnComment(db.comments, id, user)
    comment.body = body
    comment.updatedAt = Date.now()
    saveDb(db)
    return clone(comment)
  },

  async remove(id: string, user: User): Promise<Post> {
    await delay()
    const db = readDb()
    const comment = findOwnComment(db.comments, id, user)
    const post = findPost(db, comment.postId)
    db.comments = db.comments.filter((c) => c.id !== id)
    post.commentCount = Math.max(0, post.commentCount - 1)
    if (post.acceptedCommentId === id) post.acceptedCommentId = null
    saveDb(db)
    return clone(post)
  },

  /** 같은 답변을 다시 누르면 채택 취소 */
  async toggleAccept(postId: string, commentId: string, user: User): Promise<Post> {
    await delay()
    const db = readDb()
    const post = findPost(db, postId)
    if (post.authorId !== user.id) throw new ApiError('질문을 올린 사람만 답변을 채택할 수 있어요.')
    if (post.category !== 'question') throw new ApiError('질문 글에서만 답변을 채택할 수 있어요.')
    post.acceptedCommentId = post.acceptedCommentId === commentId ? null : commentId
    saveDb(db)
    return clone(post)
  },
}
