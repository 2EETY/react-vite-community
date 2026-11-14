import { Link, useLocation, useNavigate } from 'react-router-dom'
import { buttonClass } from '@/components/ui/styles'
import { useAuthGuard } from '@/features/auth/useAuthGuard'
import { PROVIDER_LABEL } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/stores/toastStore'
import { ThemeToggle } from './ThemeToggle'

export const Header = () => {
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const guard = useAuthGuard()
  const navigate = useNavigate()
  const location = useLocation()
  const onLoginPage = location.pathname === '/login'

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="물음표 게시판 홈">
          <span aria-hidden className="grid size-8 place-items-center rounded-md bg-highlight text-xl font-black text-on-highlight">
            ?
          </span>
          <span className="text-lg font-extrabold tracking-tight">물음표</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden items-baseline gap-2 text-sm sm:flex">
                <span className="font-semibold text-ink">{user.nickname}</span>
                <span className="text-xs text-pencil">{PROVIDER_LABEL[user.provider]} 계정</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  signOut()
                  toast('로그아웃했어요.')
                }}
                className={buttonClass('ghost', 'sm')}
              >
                로그아웃
              </button>
            </>
          ) : (
            !onLoginPage && (
              <Link to="/login" state={{ from: location.pathname + location.search }} className={buttonClass('ghost', 'sm')}>
                로그인
              </Link>
            )
          )}
          <button
            type="button"
            onClick={() => guard(() => navigate('/posts/new'), '로그인하면 글을 쓸 수 있어요.', '/posts/new')}
            className={buttonClass('primary', 'sm')}
          >
            글쓰기
          </button>
        </div>
      </div>
    </header>
  )
}
