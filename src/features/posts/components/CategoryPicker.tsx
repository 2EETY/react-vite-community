import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryPickerProps {
  value: Category
  onChange: (value: Category) => void
}

const OPTIONS: Array<{ value: Category; label: string; description: string }> = [
  { value: 'question', label: '질문', description: '답을 받고 싶은 것. 좋은 답변을 채택할 수 있어요' },
  { value: 'diary', label: '일기', description: '오늘 배운 것, 겪은 것' },
  { value: 'chat', label: '잡담', description: '그 밖의 이야기' },
]

export const CategoryPicker = ({ value, onChange }: CategoryPickerProps) => (
  <fieldset>
    <legend className="text-sm font-semibold text-ink">글 종류</legend>
    <div className="mt-2 grid gap-2 sm:grid-cols-3">
      {OPTIONS.map((o) => (
        <label
          key={o.value}
          className={cn(
            'flex cursor-pointer flex-col gap-0.5 rounded-md border bg-surface px-3.5 py-3 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink',
            value === o.value ? 'border-ink' : 'border-line hover:border-pencil',
          )}
        >
          <input
            type="radio"
            name="category"
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="sr-only"
          />
          <span className={cn('w-fit text-[15px] font-bold', value === o.value && 'marker')}>{o.label}</span>
          <span className="text-sm text-pencil">{o.description}</span>
        </label>
      ))}
    </div>
  </fieldset>
)
