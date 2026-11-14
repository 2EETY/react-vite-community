import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface RequireAuthProps {
  children: ReactNode
}

/** 로그인해야 들어갈 수 있는 페이지(글쓰기, 수정)를 감싼다 */
export const RequireAuth = ({ children }: RequireAuthProps) => {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
