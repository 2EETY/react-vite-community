import { createBrowserRouter } from 'react-router-dom'
import { RequireAuth } from '@/features/auth/RequireAuth'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PostDetailPage from '@/pages/PostDetailPage'
import PostEditorPage from '@/pages/PostEditorPage'
import { Layout } from './Layout'

/** createBrowserRouter(데이터 라우터)를 써야 작성 중 이탈 방지(useBlocker)가 동작한다 */
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'posts/new',
        element: (
          <RequireAuth>
            <PostEditorPage />
          </RequireAuth>
        ),
      },
      { path: 'posts/:id', element: <PostDetailPage /> },
      {
        path: 'posts/:id/edit',
        element: (
          <RequireAuth>
            <PostEditorPage />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
