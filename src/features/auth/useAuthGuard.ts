import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/stores/toastStore'

/**
 * 로그인이 필요한 동작을 감싸는 훅.
 * 로그아웃 상태면 안내를 띄우고 로그인 화면으로 보낸 뒤, 로그인하면 원래 페이지로 돌아온다.
 */
export const useAuthGuard = () => {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const location = useLocation()

  /** returnTo를 주면 로그인 후 그 경로로, 없으면 지금 페이지로 돌아온다 */
  return (action: () => void, reason = '로그인하면 할 수 있어요.', returnTo?: string) => {
    if (user) {
      action()
      return
    }
    toast(reason)
    navigate('/login', { state: { from: returnTo ?? location.pathname + location.search } })
  }
}
