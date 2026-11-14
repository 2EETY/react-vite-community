import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { fieldIds, inputClass } from '@/components/ui/styles'
import { cn, errorMessage } from '@/lib/utils'

const COMMENT_MAX = 1000

const commentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(2, '2자 이상 적어 주세요.')
    .max(COMMENT_MAX, `${COMMENT_MAX.toLocaleString()}자까지 쓸 수 있어요.`),
})

type CommentValues = z.infer<typeof commentSchema>

interface CommentFormProps {
  id: string
  label: string
  submitLabel: string
  placeholder?: string
  defaultValue?: string
  autoFocus?: boolean
  onSubmit: (body: string) => Promise<void>
  onCancel?: () => void
}

export const CommentForm = ({
  id,
  label,
  submitLabel,
  placeholder,
  defaultValue = '',
  autoFocus,
  onSubmit,
  onCancel,
}: CommentFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { body: defaultValue },
  })
  const body = useWatch({ control, name: 'body' })

  const submit = handleSubmit(async ({ body }) => {
    try {
      await onSubmit(body)
      reset({ body: '' })
    } catch (e) {
      setError('body', { message: errorMessage(e) })
    }
  })

  const ids = fieldIds(id)

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <textarea
        id={id}
        {...register('body')}
        rows={3}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-invalid={errors.body ? true : undefined}
        aria-describedby={errors.body ? ids.error : ids.hint}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void submit()
          if (e.key === 'Escape' && onCancel) onCancel()
        }}
        className={inputClass(!!errors.body, 'resize-y py-2.5 leading-relaxed')}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        {errors.body ? (
          <p id={ids.error} role="alert" className="border-l-2 border-margin pl-2 text-sm text-margin">
            {errors.body.message}
          </p>
        ) : (
          <p id={ids.hint} className="flex gap-3 text-xs text-pencil">
            <span className={cn('tabular-nums', body.length > COMMENT_MAX && 'text-margin')}>
              {body.length.toLocaleString()} / {COMMENT_MAX.toLocaleString()}
            </span>
            <span className="hidden sm:inline">Ctrl+Enter로 바로 등록</span>
          </p>
        )}
        <div className="ml-auto flex gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
              취소
            </Button>
          )}
          <Button type="submit" size="sm" loading={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}
