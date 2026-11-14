import type { Database } from './db'
import { ApiError, clone, delay, readDb, saveDb, uid } from './db'
import type { Post, PostInput, User } from '@/types'

export const findPost = (db: Database, id: string) => {
  const post = db.posts.find((p) => p.id === id)
  if (!post) throw new ApiError('글을 찾을 수 없어요. 이미 삭제되었을 수 있어요.')
  return post
}

const assertAuthor = (post: Post, user: User) => {
  if (post.authorId !== user.id) throw new ApiError('내가 쓴 글만 수정하거나 삭제할 수 있어요.')
}

const setMembership = (list: string[], userId: string, on: boolean) =>
  on ? Array.from(new Set([...list, userId])) : list.filter((id) => id !== userId)

export const postsApi = {
  async list(): Promise<Post[]> {
    await delay()
    return clone(readDb().posts)
  },

  async create(input: PostInput, user: User): Promise<Post> {
    await delay()
    const db = readDb()
    const now = Date.now()
    const post: Post = {
      ...input,
      id: uid(),
      authorId: user.id,
      authorName: user.nickname,
      createdAt: now,
      updatedAt: now,
      likedBy: [],
      bookmarkedBy: [],
      commentCount: 0,
      acceptedCommentId: null,
    }
    db.posts.unshift(post)
    saveDb(db)
    return clone(post)
  },

  async update(id: string, input: PostInput, user: User): Promise<Post> {
    await delay()
    const db = readDb()
    const post = findPost(db, id)
    assertAuthor(post, user)
    Object.assign(post, input, { updatedAt: Date.now() })
    saveDb(db)
    return clone(post)
  },

  async remove(id: string, user: User): Promise<void> {
    await delay()
    const db = readDb()
    assertAuthor(findPost(db, id), user)
    db.posts = db.posts.filter((p) => p.id !== id)
    db.comments = db.comments.filter((c) => c.postId !== id)
    saveDb(db)
  },

  /** 토글이 아니라 '원하는 상태'를 보내서, 요청이 겹쳐도 결과가 꼬이지 않게 한다 */
  async setLike(id: string, userId: string, on: boolean): Promise<Post> {
    await delay()
    const db = readDb()
    const post = findPost(db, id)
    post.likedBy = setMembership(post.likedBy, userId, on)
    saveDb(db)
    return clone(post)
  },

  async setBookmark(id: string, userId: string, on: boolean): Promise<Post> {
    await delay()
    const db = readDb()
    const post = findPost(db, id)
    post.bookmarkedBy = setMembership(post.bookmarkedBy, userId, on)
    saveDb(db)
    return clone(post)
  },
}
