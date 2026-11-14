import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { NicknameForm } from '@/features/auth/NicknameForm'
import { ProviderButtons } from '@/features/auth/ProviderButtons'
import { errorMessage, PROVIDER_LABEL } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/stores/toastStore'
import type { Provider, User } from '@/types'

type Step = { name: 'choose' } | { name: 'connecting'; provider: Provider } | { name: 'nickname'; provider: Provider }

const LoginPage = () => {
  const user = useAuthStore((s) => s.user)
  const signIn = useAuthStore((s) => s.signIn)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [step, setStep] = useState<Step>({ name: 'choose' })
  const [failure, setFailure] = useState<string | null>(null)

  const finish = (signedIn: User, isNew: boolean) => {
    signIn(signedIn)
    toast(isNew ? `${signedIn.nickname}님, 가입을 마쳤어요.` : `${signedIn.nickname}님, 다시 오셨네요.`)
    navigate(from, { replace: true })
  }

  const connect = async (provider: Provider) => {
    setFailure(null)
    setStep({ name: 'connecting', provider })
    try {
      const { user: existing } = await authApi.signIn(provider)
      if (existing) finish(existing, false)
      else setStep({ name: 'nickname', provider })
    } catch (e) {
      setFailure(errorMessage(e))
      setStep({ name: 'choose' })
    }
  }

  // 이미 로그인한 상태로 들어오면 돌려보낸다 (가입 직후 이동 중일 때는 제외)
  if (user && step.name === 'choose') return <Navigate to={from} replace />

  return (
    <div className="mx-auto max-w-sm py-6 sm:py-12">
      {step.name === 'nickname' ? (
        <>
          <h1 className="text-2xl font-extrabold tracking-tight">게시판에서 쓸 이름을 정해 주세요</h1>
          <p className="mt-2 text-[15px] text-pencil">
            {PROVIDER_LABEL[step.provider]} 계정으로 처음 오셨네요. 글과 댓글에 이 이름이 표시돼요.
          </p>
          <div className="mt-7">
            <NicknameForm
              provider={step.provider}
              onDone={(created) => finish(created, true)}
              onBack={() => setStep({ name: 'choose' })}
            />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-extrabold tracking-tight">로그인</h1>
          <p className="mt-2 text-[15px] text-pencil">로그인하면 글과 댓글을 쓰고, 공감하고, 북마크할 수 있어요.</p>
          <div className="mt-7">
            <ProviderButtons
              connecting={step.name === 'connecting' ? step.provider : null}
              onSelect={(p) => void connect(p)}
            />
          </div>
          {failure && (
            <p role="alert" className="mt-4 border-l border-margin pl-2 text-sm text-margin">
              {failure}
            </p>
          )}
          <p className="mt-8 rounded-md bg-line-soft px-4 py-3 text-sm leading-relaxed text-ink-soft">
            포트폴리오용 데모라서 실제 계정에는 연결하지 않아요. 버튼을 누르면 가상의 계정으로 로그인돼요.
          </p>
        </>
      )}
    </div>
  )
}

export default LoginPage
