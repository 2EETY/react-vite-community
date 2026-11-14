import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-on-ink hover:bg-ink-soft',
  secondary: 'border border-line bg-surface text-ink hover:border-ink',
  ghost: 'text-pencil hover:bg-line-soft hover:text-ink',
  danger: 'bg-margin text-on-ink hover:bg-margin/90',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-[15px]',
}

/** <button>과 <Link>가 같은 모양을 쓰도록 클래스만 따로 뺐다 */
export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra?: string) =>
  cn(
    'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    extra,
  )

/** 입력창 공통 스타일. 에러가 있으면 노트 여백선 색으로 테두리를 바꾼다 */
export const inputClass = (invalid: boolean, extra?: string) =>
  cn(
    'w-full rounded-md border bg-surface px-3 text-[15px] text-ink outline-none transition-colors placeholder:text-pencil focus:border-ink',
    invalid ? 'border-margin' : 'border-line',
    extra,
  )

/** Field의 에러·힌트 문구 id. 입력창의 aria-describedby에 연결한다 */
export const fieldIds = (id: string) => ({ error: `${id}-error`, hint: `${id}-hint` })
