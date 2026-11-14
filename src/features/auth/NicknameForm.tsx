import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { fieldIds, inputClass } from '@/components/ui/styles'
import { errorMessage } from '@/lib/utils'
import type { Provider, User } from '@/types'

const nicknameSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, '닉네임은 2자 이상이어야 해요.')
    .max(12, '닉네임은 12자까지 쓸 수 있어요.')
    .regex(/^[가-힣a-zA-Z0-9_]+$/, '한글, 영문, 숫자, 밑줄(_)만 쓸 수 있어요. 띄어쓰기도 빼 주세요.'),
})

type NicknameValues = z.infer<typeof nicknameSchema>

interface NicknameFormProps {
  provider: Provider
  onDone: (user: User) => void
  onBack: () => void
}

export const NicknameForm = ({ provider, onDone, onBack }: NicknameFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NicknameValues>({
    resolver: zodResolver(nicknameSchema),
    defaultValues: { nickname: '' },
    mode: 'onChange',
  })

  // 형식 검사는 브라우저에서, 중복 검사는 서버 응답으로 한다
  const submit = handleSubmit(async ({ nickname }) => {
    try {
      onDone(await authApi.signUp(provider, nickname))
    } catch (e) {
      setError('nickname', { message: errorMessage(e) }, { shouldFocus: true })
    }
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <Field label="닉네임" htmlFor="nickname" error={errors.nickname?.message} hint="2~12자, 한글·영문·숫자·밑줄">
        <input
          id="nickname"
          {...register('nickname')}
          autoFocus
          autoComplete="nickname"
          placeholder="예: 새벽코더"
          aria-invalid={errors.nickname ? true : undefined}
          aria-describedby={errors.nickname ? fieldIds('nickname').error : fieldIds('nickname').hint}
          className={inputClass(!!errors.nickname, 'h-11')}
        />
      </Field>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={onBack} disabled={isSubmitting}>
          다른 계정 고르기
        </Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">
          가입 마치기
        </Button>
      </div>
    </form>
  )
}
