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
  // 모바일 터치 영역을 40px 이상으로 확보하고, 넓은 화면에선 조금 줄인다
  sm: 'h-10 px-3 text-sm sm:h-9',
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

/** 줄 쳐진 노트 한 장: 위아래 괘선 + 왼쪽 빨간 여백선 */
export const notebookSheet = 'margin-rule border-y border-line [--margin-x:1.75rem] sm:[--margin-x:2.5rem]'

/** 노트 한 줄의 안쪽 여백. 글은 여백선 오른쪽에서 시작한다 */
export const notebookRow = 'pr-4 pl-11 sm:pr-6 sm:pl-16'
