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
        <Link to="/" className="-my-1.5 flex shrink-0 items-center gap-2.5 py-1.5 whitespace-nowrap" aria-label="물음표 게시판 홈">
          <span aria-hidden className="marker px-1.5 text-[26px] leading-none font-black">
            ?
          </span>
          <span className="text-lg font-extrabold tracking-tight">물음표</span>
        </Link>

        <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          {user ? (
            <>
              {/* 모바일에서도 누구로 로그인했는지 보이게 닉네임은 남기고, 계정 종류만 넓은 화면에서 */}
              <span className="flex min-w-0 items-baseline gap-2 text-sm">
                <span className="max-w-22 truncate font-semibold text-ink sm:max-w-none">{user.nickname}</span>
                <span className="hidden text-xs text-pencil sm:inline">{PROVIDER_LABEL[user.provider]} 계정</span>
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
          {/* 로그인 화면에서는 눌러도 로그인 화면으로 돌아올 뿐이라 숨긴다 */}
          {!onLoginPage && (
            <button
              type="button"
              onClick={() => guard(() => navigate('/posts/new'), '로그인하면 글을 쓸 수 있어요.', '/posts/new')}
              className={buttonClass('primary', 'sm')}
            >
              글쓰기
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
