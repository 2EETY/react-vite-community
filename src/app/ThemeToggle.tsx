import { useThemeStore } from '@/stores/themeStore'

export const ThemeToggle = () => {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? '라이트 모드로 바꾸기' : '다크 모드로 바꾸기'}
      title={isDark ? '라이트 모드로 바꾸기' : '다크 모드로 바꾸기'}
      className="grid size-8 place-items-center rounded-md text-pencil transition-colors hover:bg-line-soft hover:text-ink"
    >
      {/* 지금 모드가 아니라 '누르면 바뀔 모드'의 아이콘을 보여준다 */}
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

const SunIcon = () => (
  <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const MoonIcon = () => (
  <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
  </svg>
)
