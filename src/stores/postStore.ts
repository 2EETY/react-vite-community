import { create } from 'zustand'
import { postsApi } from '@/api/posts'
import { errorMessage } from '@/lib/utils'
import type { Post, PostInput } from '@/types'
import { requireUser } from './authStore'
import { toast } from './toastStore'

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'
type MemberField = 'likedBy' | 'bookmarkedBy'

interface PostState {
  /** id → Post 형태로 정규화해서 저장. 한 글이 바뀌어도 그 항목만 교체된다 */
  posts: Record<string, Post>
  status: LoadStatus
  error: string | null
  /** 응답을 기다리는 중인 공감/북마크 요청. 같은 버튼 연타를 막는다 */
  pending: Record<string, true>

  fetchPosts: () => Promise<void>
  createPost: (input: PostInput) => Promise<Post>
  updatePost: (id: string, input: PostInput) => Promise<Post>
  deletePost: (id: string) => Promise<void>
  toggleLike: (id: string) => Promise<void>
  toggleBookmark: (id: string) => Promise<void>
  /** 댓글 스토어처럼 다른 곳에서 받은 최신 글로 교체할 때 사용 */
  upsertPost: (post: Post) => void
}

export const usePostStore = create<PostState>()((set, get) => {
  const upsertPost = (post: Post) => set((s) => ({ posts: { ...s.posts, [post.id]: post } }))

  /**
   * 낙관적 업데이트: 서버 응답을 기다리지 않고 화면부터 바꾸고,
   * 실패하면 원래 값으로 되돌린다. 버튼 반응이 즉각적으로 느껴진다.
   */
  const optimisticToggle = async (id: string, field: MemberField) => {
    const user = requireUser()
    const key = `${field}:${id}`
    const prev = get().posts[id]
    if (!prev || get().pending[key]) return

    const on = !prev[field].includes(user.id)
    const nextList = on ? [...prev[field], user.id] : prev[field].filter((uid) => uid !== user.id)
    set((s) => ({
      posts: { ...s.posts, [id]: { ...prev, [field]: nextList } },
      pending: { ...s.pending, [key]: true },
    }))

    try {
      const saved =
        field === 'likedBy'
          ? await postsApi.setLike(id, user.id, on)
          : await postsApi.setBookmark(id, user.id, on)
      upsertPost(saved)
    } catch (e) {
      const current = get().posts[id]
      if (current) upsertPost({ ...current, [field]: prev[field] })
      toast(errorMessage(e), 'error')
    } finally {
      set((s) => {
        const pending = { ...s.pending }
        delete pending[key]
        return { pending }
      })
    }
  }

  return {
    posts: {},
    status: 'idle',
    error: null,
    pending: {},

    fetchPosts: async () => {
      set({ status: 'loading', error: null })
      try {
        const list = await postsApi.list()
        set({ posts: Object.fromEntries(list.map((p) => [p.id, p])), status: 'ready' })
      } catch (e) {
        set({ status: 'error', error: errorMessage(e) })
      }
    },

    createPost: async (input) => {
      const post = await postsApi.create(input, requireUser())
      upsertPost(post)
      return post
    },

    updatePost: async (id, input) => {
      const post = await postsApi.update(id, input, requireUser())
      upsertPost(post)
      return post
    },

    deletePost: async (id) => {
      await postsApi.remove(id, requireUser())
      set((s) => {
        const posts = { ...s.posts }
        delete posts[id]
        return { posts }
      })
    },

    toggleLike: (id) => optimisticToggle(id, 'likedBy'),
    toggleBookmark: (id) => optimisticToggle(id, 'bookmarkedBy'),
    upsertPost,
  }
})
