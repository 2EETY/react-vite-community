import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { fieldIds } from './styles'

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  counter?: { current: number; max: number }
  children: ReactNode
}

export const Field = ({ label, htmlFor, error, hint, counter, children }: FieldProps) => {
  const ids = fieldIds(htmlFor)
  const over = counter && counter.current > counter.max

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {counter && (
          <span className={cn('text-xs tabular-nums', over ? 'font-semibold text-margin' : 'text-pencil')}>
            {counter.current.toLocaleString()} / {counter.max.toLocaleString()}
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p id={ids.error} role="alert" className="border-l-2 border-margin pl-2 text-sm text-margin">
          {error}
        </p>
      ) : (
        hint && (
          <p id={ids.hint} className="text-sm text-pencil">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
