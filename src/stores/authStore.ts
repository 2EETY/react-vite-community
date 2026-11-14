import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  signIn: (user: User) => void
  signOut: () => void
}

/** persist 미들웨어: 새로고침해도 로그인이 유지되도록 localStorage에 자동 저장 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    { name: 'mureum:auth', storage: createJSONStorage(() => localStorage) },
  ),
)

/** 스토어 액션 안에서 로그인 사용자가 꼭 필요할 때 쓴다 */
export const requireUser = () => {
  const user = useAuthStore.getState().user
  if (!user) throw new Error('로그인한 뒤에 할 수 있어요.')
  return user
}
