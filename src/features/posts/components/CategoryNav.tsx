import { cn } from '@/lib/utils'
import type { CategoryKey } from '../usePostFilters'

interface CategoryNavProps {
  active: CategoryKey
  saved: boolean
  counts: Record<CategoryKey, number>
  savedCount: number | null
  onSelect: (cat: CategoryKey) => void
  onSelectSaved: () => void
}

const ITEMS: Array<{ key: CategoryKey; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'question', label: '질문' },
  { key: 'diary', label: '일기' },
  { key: 'chat', label: '잡담' },
]

const itemClass = (active: boolean) =>
  cn(
    'flex shrink-0 items-baseline justify-between gap-2 rounded-md px-3 py-2 text-[15px] whitespace-nowrap transition-colors md:w-full md:gap-3',
    active ? 'font-bold text-ink' : 'text-ink-soft hover:bg-line-soft',
  )

export const CategoryNav = ({ active, saved, counts, savedCount, onSelect, onSelectSaved }: CategoryNavProps) => (
  <nav aria-label="게시판 분류" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
    <ul className="flex gap-1 md:flex-col">
      {ITEMS.map(({ key, label }) => {
        const isActive = !saved && active === key
        return (
          <li key={key}>
            <button
              type="button"
              onClick={() => onSelect(key)}
              aria-current={isActive ? 'page' : undefined}
              className={itemClass(isActive)}
            >
              <span className={cn(isActive && 'marker')}>{label}</span>
              <span className="text-xs font-normal text-pencil tabular-nums">{counts[key]}</span>
            </button>
          </li>
        )
      })}
      {savedCount !== null && (
        <li className="md:mt-3 md:border-t md:border-line md:pt-3">
          <button
            type="button"
            onClick={onSelectSaved}
            aria-current={saved ? 'page' : undefined}
            className={itemClass(saved)}
          >
            <span className={cn(saved && 'marker')}>내 북마크</span>
            <span className="text-xs font-normal text-pencil tabular-nums">{savedCount}</span>
          </button>
        </li>
      )}
    </ul>
  </nav>
)
