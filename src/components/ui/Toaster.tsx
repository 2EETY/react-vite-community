import { cn } from '@/lib/utils'
import { useToastStore } from '@/stores/toastStore'

export const Toaster = () => {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.tone === 'error' ? 'alert' : 'status'}
          className={cn(
            'pointer-events-auto flex w-full max-w-sm animate-toast-in items-center gap-3 rounded-md bg-ink py-3 pr-2 pl-4 text-sm text-on-ink shadow-lg',
            t.tone === 'error' && 'border-l-4 border-margin',
          )}
        >
          <p className="flex-1">{t.message}</p>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="알림 닫기"
            className="grid size-7 place-items-center rounded text-on-ink/60 hover:bg-on-ink/10 hover:text-on-ink"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
