import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useBlocker, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Field } from '@/components/ui/Field'
import { fieldIds, inputClass } from '@/components/ui/styles'
import { errorMessage } from '@/lib/utils'
import { BODY_MAX, postSchema, TITLE_MAX, type PostFormValues } from '../schema'
import { CategoryPicker } from './CategoryPicker'
import { TagInput } from './TagInput'

interface PostFormProps {
  defaultValues: PostFormValues
  submitLabel: string
  /** 저장에 성공하면 이동할 경로를 돌려준다 */
  onSubmit: (values: PostFormValues) => Promise<string>
}

const describedBy = (id: string, hasError: boolean) => (hasError ? fieldIds(id).error : undefined)

export const PostForm = ({ defaultValues, submitLabel, onSubmit }: PostFormProps) => {
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues,
    mode: 'onTouched', // 처음엔 칸을 벗어날 때 검사하고, 그 뒤로는 입력할 때마다 다시 검사
  })

  const [title, body] = useWatch({ control, name: ['title', 'body'] })

  // 작성 중에 다른 페이지로 나가려 하면 한 번 묻는다. 저장 후 이동(afterSave)은 통과
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty &&
      !(nextLocation.state as { afterSave?: boolean } | null)?.afterSave &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  const submit = handleSubmit(async (values) => {
    try {
      const to = await onSubmit(values)
      navigate(to, { replace: true, state: { afterSave: true } })
    } catch (e) {
      setError('root.server', { message: errorMessage(e) })
    }
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-7">
      <Controller
        control={control}
        name="category"
        render={({ field }) => <CategoryPicker value={field.value} onChange={field.onChange} />}
      />

      <Field label="제목" htmlFor="title" error={errors.title?.message} counter={{ current: title.length, max: TITLE_MAX }}>
        <input
          id="title"
          {...register('title')}
          placeholder="무엇이 궁금하거나, 무엇을 남기고 싶나요?"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={describedBy('title', !!errors.title)}
          className={inputClass(!!errors.title, 'h-11 text-base font-semibold')}
        />
      </Field>

      <Field label="본문" htmlFor="body" error={errors.body?.message} counter={{ current: body.length, max: BODY_MAX }}>
        <textarea
          id="body"
          {...register('body')}
          rows={12}
          placeholder="질문이라면 시도해 본 것과 에러 메시지를 함께 적어 주세요."
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={describedBy('body', !!errors.body)}
          className={inputClass(!!errors.body, 'ruled resize-y py-2')}
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tags" className="text-sm font-semibold text-ink">
          태그 <span className="font-normal text-pencil">(선택)</span>
        </label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput id="tags" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
          )}
        />
      </div>

      {errors.root?.server && (
        <p role="alert" className="rounded-md border border-margin/40 bg-margin/5 px-4 py-3 text-sm text-margin">
          {errors.root.server.message}
        </p>
      )}

      <div className="flex justify-end gap-2 border-t border-line pt-5">
        <Button variant="ghost" onClick={() => navigate(-1)} disabled={isSubmitting}>
          취소
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>

      <ConfirmDialog
        open={blocker.state === 'blocked'}
        title="작성 중인 내용이 있어요"
        description="지금 나가면 입력한 내용이 사라져요."
        confirmLabel="나가기"
        cancelLabel="계속 쓰기"
        tone="danger"
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </form>
  )
}
