import { inputClass } from '@/components/ui/styles'
import { cn } from '@/lib/utils'
import type { PostFilters, SortKey, StatusKey } from '../usePostFilters'

interface ListToolbarProps {
  filters: PostFilters
  onQueryChange: (q: string) => void
  onSortChange: (sort: SortKey) => void
  onStatusChange: (status: StatusKey) => void
  onClearTag: () => void
}

interface SegmentedProps<T extends string> {
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
}

const Segmented = <T extends string>({ label, value, options, onChange }: SegmentedProps<T>) => (
  <div role="group" aria-label={label} className="flex rounded-md border border-line bg-surface p-0.5">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        aria-pressed={value === o.value}
        onClick={() => onChange(o.value)}
        className={cn(
          'rounded px-2.5 py-1 text-sm transition-colors',
          value === o.value ? 'bg-ink font-semibold text-white' : 'text-ink-soft hover:text-ink',
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
)

export const ListToolbar = ({ filters, onQueryChange, onSortChange, onStatusChange, onClearTag }: ListToolbarProps) => (
  <div className="flex flex-col gap-3">
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        글 찾기
      </label>
      <input
        id="search"
        type="search"
        value={filters.q}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="제목, 본문, 작성자, 태그로 찾기"
        className={inputClass(false, 'h-11 pr-10')}
      />
      {filters.q && (
        <button
          type="button"
          onClick={() => onQueryChange('')}
          aria-label="검색어 지우기"
          className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded text-pencil hover:bg-line-soft hover:text-ink"
        >
          ✕
        </button>
      )}
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <Segmented
        label="정렬"
        value={filters.sort}
        onChange={onSortChange}
        options={[
          { value: 'latest', label: '최신순' },
          { value: 'likes', label: '공감순' },
          { value: 'comments', label: '답변순' },
        ]}
      />
      {filters.cat === 'question' && (
        <Segmented
          label="해결 여부"
          value={filters.status}
          onChange={onStatusChange}
          options={[
            { value: 'all', label: '전부' },
            { value: 'open', label: '미해결' },
            { value: 'solved', label: '해결' },
          ]}
        />
      )}
      {filters.tag && (
        <button
          type="button"
          onClick={onClearTag}
          className="flex items-center gap-1.5 rounded-full bg-ink py-1 pr-2 pl-3 text-sm text-white"
          aria-label={`태그 ${filters.tag} 필터 해제`}
        >
          #{filters.tag}
          <span aria-hidden className="text-white/70">
            ✕
          </span>
        </button>
      )}
    </div>
  </div>
)
