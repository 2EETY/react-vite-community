import { useEffect, useRef } from 'react'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel: string
  cancelLabel?: string
  tone?: 'danger' | 'default'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * 브라우저 기본 <dialog>를 사용한 확인창.
 * showModal()이 포커스 가두기와 Esc 닫기를 알아서 처리해 준다.
 */
export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  tone = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null)

  // open prop과 실제 DOM 상태를 맞추는 동기화라서 effect가 필요하다
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault()
        if (!loading) onCancel()
      }}
      onClick={(e) => {
        if (e.target === ref.current && !loading) onCancel()
      }}
      className="m-auto w-[min(400px,calc(100%-32px))] rounded-lg border border-line bg-surface p-0 text-ink shadow-xl backdrop:bg-black/45"
    >
      <div className="p-6">
        <h2 id="confirm-title" className="text-lg font-bold">
          {title}
        </h2>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-pencil">{description}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
