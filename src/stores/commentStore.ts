import { create } from 'zustand'
import { commentsApi } from '@/api/comments'
import type { Comment } from '@/types'
import { requireUser } from './authStore'
import { usePostStore } from './postStore'

interface CommentState {
  /** 글 id별 댓글 목록. 한 번 불러온 글은 다시 들어와도 바로 보인다 */
  byPost: Record<string, Comment[]>
  loading: Record<string, boolean>

  fetchComments: (postId: string) => Promise<void>
  addComment: (postId: string, body: string) => Promise<void>
  editComment: (postId: string, commentId: string, body: string) => Promise<void>
  deleteComment: (postId: string, commentId: string) => Promise<void>
  toggleAccept: (postId: string, commentId: string) => Promise<void>
}

export const useCommentStore = create<CommentState>()((set) => {
  const setList = (postId: string, update: (list: Comment[]) => Comment[]) =>
    set((s) => ({ byPost: { ...s.byPost, [postId]: update(s.byPost[postId] ?? []) } }))

  // 댓글 수, 채택 여부처럼 글에 붙은 값은 게시글 스토어에 반영한다
  const syncPost = usePostStore.getState().upsertPost

  return {
    byPost: {},
    loading: {},

    fetchComments: async (postId) => {
      set((s) => ({ loading: { ...s.loading, [postId]: true } }))
      try {
        const list = await commentsApi.list(postId)
        setList(postId, () => list)
      } finally {
        set((s) => ({ loading: { ...s.loading, [postId]: false } }))
      }
    },

    addComment: async (postId, body) => {
      const { comment, post } = await commentsApi.create(postId, body, requireUser())
      setList(postId, (list) => [...list, comment])
      syncPost(post)
    },

    editComment: async (postId, commentId, body) => {
      const updated = await commentsApi.update(commentId, body, requireUser())
      setList(postId, (list) => list.map((c) => (c.id === commentId ? updated : c)))
    },

    deleteComment: async (postId, commentId) => {
      const post = await commentsApi.remove(commentId, requireUser())
      setList(postId, (list) => list.filter((c) => c.id !== commentId))
      syncPost(post)
    },

    toggleAccept: async (postId, commentId) => {
      syncPost(await commentsApi.toggleAccept(postId, commentId, requireUser()))
    },
  }
})
