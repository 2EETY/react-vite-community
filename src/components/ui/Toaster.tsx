import { useToastStore } from '@/stores/toastStore'
import { AlertIcon, XIcon } from './Icon'

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
          className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-center gap-2.5 rounded-md bg-note py-3 pr-2 pl-4 text-sm text-on-note shadow-[0_6px_20px_-6px_rgb(0_0_0/0.35)]"
        >
          {t.tone === 'error' && <AlertIcon size={18} className="shrink-0 text-margin" />}
          <p className="flex-1">{t.message}</p>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="알림 닫기"
            className="grid size-8 place-items-center rounded text-on-note/60 hover:bg-on-note/10 hover:text-on-note"
          >
            <XIcon />
          </button>
        </div>
      ))}
    </div>
  )
}
