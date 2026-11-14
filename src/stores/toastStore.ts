import { create } from 'zustand'

export type ToastTone = 'info' | 'error'

export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

interface ToastState {
  toasts: Toast[]
  show: (message: string, tone?: ToastTone) => void
  dismiss: (id: number) => void
}

let nextId = 1

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message, tone = 'info') => {
    const id = nextId++
    // 최대 3개까지만 쌓아 화면을 덮지 않게 한다
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, tone }] }))
    setTimeout(() => get().dismiss(id), tone === 'error' ? 5000 : 3000)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** 컴포넌트 밖(스토어 액션 등)에서도 호출할 수 있는 단축 함수 */
export const toast = (message: string, tone?: ToastTone) =>
  useToastStore.getState().show(message, tone)
