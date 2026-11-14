export type Category = 'question' | 'diary' | 'chat'
export type Provider = 'google' | 'github' | 'kakao'

export interface User {
  id: string
  nickname: string
  provider: Provider
}

export interface Post {
  id: string
  authorId: string
  authorName: string
  category: Category
  title: string
  body: string
  tags: string[]
  createdAt: number
  updatedAt: number
  likedBy: string[]
  bookmarkedBy: string[]
  commentCount: number
  /** 질문 글에서 작성자가 채택한 답변 id. 채택 전이면 null */
  acceptedCommentId: string | null
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  body: string
  createdAt: number
  updatedAt: number
}

/** 글 작성·수정 폼이 API로 넘기는 값 */
export interface PostInput {
  category: Category
  title: string
  body: string
  tags: string[]
}
