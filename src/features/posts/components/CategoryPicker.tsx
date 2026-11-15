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

/**
 * 카드 타일 대신 노트에 동그라미를 치는 라디오 목록.
 * 모바일에선 줄 친 목록(세로), 넓은 화면에선 한 줄로 펼친다.
 */
export const CategoryPicker = ({ value, onChange }: CategoryPickerProps) => (
  <fieldset>
    <legend className="text-sm font-semibold text-ink">글 종류</legend>
    <div className="mt-1 divide-y divide-line-soft border-y border-line-soft sm:flex sm:gap-6 sm:divide-y-0 sm:border-y-0">
      {OPTIONS.map((o) => {
        const selected = value === o.value
        return (
          <label
            key={o.value}
            className="flex min-h-11 cursor-pointer items-start gap-2.5 py-2.5 sm:min-h-0 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
          >
            <input
              type="radio"
              name="category"
              value={o.value}
              checked={selected}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {/* 펜으로 친 동그라미: 고르면 안쪽이 잉크로 채워진다 */}
            <span
              aria-hidden
              className={cn(
                'mt-1 grid size-4 shrink-0 place-items-center rounded-full border-[1.5px] transition-colors',
                selected ? 'border-ink' : 'border-pencil',
              )}
            >
              {selected && <span className="size-2 rounded-full bg-ink" />}
            </span>
            <span className="flex flex-col">
              <span className={cn('text-[15px]', selected ? 'font-bold text-ink' : 'text-ink-soft')}>{o.label}</span>
              <span className="text-sm text-pencil">{o.description}</span>
            </span>
          </label>
        )
      })}
    </div>
  </fieldset>
)
