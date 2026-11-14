import { useState, type KeyboardEvent } from 'react'
import { XIcon } from '@/components/ui/Icon'
import { fieldIds } from '@/components/ui/styles'
import { cn } from '@/lib/utils'
import { TAG_MAX_COUNT, validateTag } from '../schema'

interface TagInputProps {
  id: string
  value: string[]
  onChange: (tags: string[]) => void
  onBlur: () => void
}

export const TagInput = ({ id, value, onChange, onBlur }: TagInputProps) => {
  const [draft, setDraft] = useState('')
  const [problem, setProblem] = useState<string | null>(null)

  const commit = () => {
    const tag = draft.trim().replace(/^#/, '')
    if (!tag) return
    const issue = validateTag(tag, value)
    if (issue) {
      setProblem(issue)
      return
    }
    onChange([...value, tag])
    setDraft('')
    setProblem(null)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중 Enter는 글자 확정용이라 무시해야 마지막 글자가 중복되지 않는다
    if (e.nativeEvent.isComposing) return
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const ids = fieldIds(id)
  const full = value.length >= TAG_MAX_COUNT

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          'flex min-h-11 flex-wrap items-center gap-1.5 rounded-md border bg-surface px-2 py-1.5 transition-colors focus-within:border-ink',
          problem ? 'border-margin' : 'border-line',
        )}
      >
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-full bg-line-soft py-0.5 pr-1 pl-2.5 text-sm text-ink">
            #{tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`태그 ${tag} 빼기`}
              className="grid size-5 place-items-center rounded-full text-xs text-pencil hover:bg-line hover:text-ink"
            >
              <XIcon size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            if (problem) setProblem(null)
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            commit()
            onBlur()
          }}
          disabled={full}
          placeholder={full ? '태그를 모두 달았어요' : '태그 입력 후 Enter'}
          aria-invalid={problem ? true : undefined}
          aria-describedby={problem ? ids.error : ids.hint}
          className="h-8 min-w-32 flex-1 bg-transparent px-1 text-[15px] outline-none placeholder:text-pencil disabled:cursor-not-allowed"
        />
      </div>
      {problem ? (
        <p id={ids.error} role="alert" className="border-l border-margin pl-2 text-sm text-margin">
          {problem}
        </p>
      ) : (
        <p id={ids.hint} className="text-sm text-pencil">
          검색과 필터에 쓰여요. {value.length}/{TAG_MAX_COUNT}개
        </p>
      )}
    </div>
  )
}
