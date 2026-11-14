import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

const systemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
}

/**
 * 처음 방문하면 OS 설정을 따르고, 버튼으로 바꾸면 그 선택을 기억한다.
 * 저장 키(mureum:theme)는 index.html의 초기 스크립트와 맞춰야 한다.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: systemTheme(),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    { name: 'mureum:theme' },
  ),
)

// 스토어 값이 바뀔 때마다 <html data-theme>에 반영한다 (React 밖의 DOM 동기화)
applyTheme(useThemeStore.getState().theme)
useThemeStore.subscribe((s) => applyTheme(s.theme))
