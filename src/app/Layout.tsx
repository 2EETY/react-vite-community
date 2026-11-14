import { useEffect, useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { resetDb } from '@/api/db'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Toaster } from '@/components/ui/Toaster'
import { useAuthStore } from '@/stores/authStore'
import { usePostStore } from '@/stores/postStore'
import { Header } from './Header'

export const Layout = () => {
  const fetchPosts = usePostStore((s) => s.fetchPosts)
  const [confirmReset, setConfirmReset] = useState(false)

  // 앱이 처음 열릴 때 글 목록을 한 번 불러온다
  useEffect(() => {
    void fetchPosts()
  }, [fetchPosts])

  const handleReset = () => {
    resetDb()
    useAuthStore.getState().signOut()
    window.location.assign('/')
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-on-ink"
      >
        본문으로 건너뛰기
      </a>
      <Header />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-sm text-pencil sm:px-6">
          <p>데이터는 이 브라우저에만 저장돼요.</p>
          <button type="button" onClick={() => setConfirmReset(true)} className="underline-offset-4 hover:text-ink hover:underline">
            데모 데이터 처음으로 되돌리기
          </button>
        </div>
      </footer>
      <Toaster />
      <ScrollRestoration />
      <ConfirmDialog
        open={confirmReset}
        title="데모 데이터를 처음으로 되돌릴까요?"
        description="직접 쓴 글과 댓글, 가입한 계정이 모두 지워지고 예시 글만 남아요."
        confirmLabel="되돌리기"
        tone="danger"
        onCancel={() => setConfirmReset(false)}
        onConfirm={handleReset}
      />
    </div>
  )
}
