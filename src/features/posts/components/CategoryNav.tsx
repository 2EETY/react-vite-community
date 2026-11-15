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
    'flex min-h-10 shrink-0 items-baseline justify-between gap-2 rounded-md px-3 py-2 text-[15px] whitespace-nowrap transition-colors md:w-full md:gap-3',
    active ? 'font-bold text-ink' : 'text-ink-soft hover:bg-line-soft',
  )

const Count = ({ value }: { value: number }) => (
  // 숫자는 화면에만 보이고, 스크린리더는 버튼의 aria-label로 "전체, 글 7개"처럼 읽는다
  <span aria-hidden className="text-xs font-normal text-pencil tabular-nums">
    {value}
  </span>
)

export const CategoryNav = ({ active, saved, counts, savedCount, onSelect, onSelectSaved }: CategoryNavProps) => (
  <nav
    aria-label="게시판 분류"
    // 모바일: 가로 스크롤은 유지하되 스크롤바는 숨기고, 오른쪽 끝을 흐리게 해 더 있다는 걸 알린다
    className="-mx-4 overflow-x-auto px-4 [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 md:[mask-image:none] [&::-webkit-scrollbar]:hidden"
  >
    <ul className="flex items-center gap-1 pr-8 md:flex-col md:items-stretch md:pr-0">
      {ITEMS.map(({ key, label }) => {
        const isActive = !saved && active === key
        return (
          <li key={key}>
            <button
              type="button"
              onClick={() => onSelect(key)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${label}, 글 ${counts[key]}개`}
              className={itemClass(isActive)}
            >
              {/* '전체'는 기본 상태라 형광펜 없이 굵게만, 다른 분류를 고르면 형광펜 */}
              <span className={cn(isActive && key !== 'all' && 'marker')}>{label}</span>
              <Count value={counts[key]} />
            </button>
          </li>
        )
      })}
      {savedCount !== null && (
        // 모바일에선 세로 구분선, 데스크톱에선 가로 구분선으로 '내 북마크'를 분류와 떼어 놓는다
        <li className="ml-1 border-l border-line pl-1 md:mt-3 md:ml-0 md:border-t md:border-l-0 md:pt-3 md:pl-0">
          <button
            type="button"
            onClick={onSelectSaved}
            aria-current={saved ? 'page' : undefined}
            aria-label={`내 북마크, 글 ${savedCount}개`}
            className={itemClass(saved)}
          >
            <span className={cn(saved && 'marker')}>내 북마크</span>
            <Count value={savedCount} />
          </button>
        </li>
      )}
    </ul>
  </nav>
)
