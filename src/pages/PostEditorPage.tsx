import { useParams } from 'react-router-dom'
import { PostForm } from '@/features/posts/components/PostForm'
import type { PostFormValues } from '@/features/posts/schema'
import { useAuthStore } from '@/stores/authStore'
import { usePostStore } from '@/stores/postStore'
import { toast } from '@/stores/toastStore'
import { NotFoundMessage } from './NotFoundPage'

const EMPTY_POST: PostFormValues = { category: 'question', title: '', body: '', tags: [] }

/** /posts/new 와 /posts/:id/edit 를 같이 처리한다 */
const PostEditorPage = () => {
  const { id } = useParams()
  const isEdit = id !== undefined
  const post = usePostStore((s) => (id ? s.posts[id] : undefined))
  const status = usePostStore((s) => s.status)
  const createPost = usePostStore((s) => s.createPost)
  const updatePost = usePostStore((s) => s.updatePost)
  const userId = useAuthStore((s) => s.user?.id)

  if (isEdit && !post) {
    if (status !== 'ready') return <p className="py-16 text-center text-pencil" role="status">글을 불러오는 중이에요.</p>
    return <NotFoundMessage title="고칠 글을 찾을 수 없어요" description="삭제되었거나 주소가 잘못되었어요." />
  }
  if (post && post.authorId !== userId) {
    return <NotFoundMessage title="내가 쓴 글만 고칠 수 있어요" description="다른 사람의 글은 읽기만 할 수 있어요." />
  }

  const defaultValues: PostFormValues = post
    ? { category: post.category, title: post.title, body: post.body, tags: post.tags }
    : EMPTY_POST

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-7 text-2xl font-extrabold tracking-tight">{isEdit ? '글 수정' : '새 글 쓰기'}</h1>
      <PostForm
        // 다른 글을 수정하러 이동하면 폼을 새로 만든다
        key={post?.id ?? 'new'}
        defaultValues={defaultValues}
        submitLabel={isEdit ? '수정 저장' : '게시하기'}
        onSubmit={async (values) => {
          if (post) {
            await updatePost(post.id, values)
            toast('글을 수정했어요.')
            return `/posts/${post.id}`
          }
          const created = await createPost(values)
          toast('글을 게시했어요.')
          return `/posts/${created.id}`
        }}
      />
    </div>
  )
}

export default PostEditorPage
