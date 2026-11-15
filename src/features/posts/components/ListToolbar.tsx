import { XIcon } from '@/components/ui/Icon'
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
  /** 아무것도 바꾸지 않았을 때의 값. 이 값일 때는 형광펜 없이 굵은 글씨만 */
  defaultValue: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
}

/**
 * 선택 상태 규칙: 형광펜은 사용자가 직접 바꾼 값에만 긋는다(실제 형광펜처럼 '내가 칠한' 표시).
 * 기본값은 굵게만 표시하고, 남색 채움은 주요 동작 버튼에만 쓴다.
 */
const Segmented = <T extends string>({ label, value, defaultValue, options, onChange }: SegmentedProps<T>) => (
  <div role="group" aria-label={label} className="flex items-center">
    <span aria-hidden className="mr-1 text-sm text-pencil">
      {label}
    </span>
    {options.map((o) => {
      const selected = value === o.value
      return (
        <button
          key={o.value}
          type="button"
          aria-pressed={selected}
          onClick={() => onChange(o.value)}
          className={cn(
            'h-10 rounded-md px-2.5 text-[15px] transition-colors sm:h-9',
            selected ? 'font-semibold text-ink' : 'text-ink-soft hover:bg-line-soft hover:text-ink',
          )}
        >
          <span className={cn(selected && value !== defaultValue && 'marker')}>{o.label}</span>
        </button>
      )
    })}
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
        // 브라우저 기본 지우기(✕) 버튼을 숨겨 직접 만든 버튼과 겹치지 않게 한다
        className={inputClass(false, 'h-11 pr-11 [&::-webkit-search-cancel-button]:appearance-none')}
      />
      {filters.q && (
        <button
          type="button"
          onClick={() => onQueryChange('')}
          aria-label="검색어 지우기"
          className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded text-pencil hover:bg-line-soft hover:text-ink"
        >
          <XIcon />
        </button>
      )}
    </div>

    <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
      <Segmented
        label="정렬"
        value={filters.sort}
        defaultValue="latest"
        onChange={onSortChange}
        options={[
          { value: 'latest', label: '최신순' },
          { value: 'likes', label: '공감순' },
          // 질문이 아닌 글에는 '답변'이 아니라 '댓글'이 달린다
          { value: 'comments', label: filters.cat === 'question' ? '답변순' : '댓글순' },
        ]}
      />
      {filters.cat === 'question' && (
        <Segmented
          label="해결 여부"
          value={filters.status}
          defaultValue="all"
          onChange={onStatusChange}
          options={[
            { value: 'all', label: '전체' },
            { value: 'open', label: '미해결' },
            { value: 'solved', label: '해결됨' },
          ]}
        />
      )}
      {filters.tag && (
        <button
          type="button"
          onClick={onClearTag}
          className="group flex h-10 items-center gap-1.5 rounded-md px-2 text-[15px] font-semibold text-ink hover:bg-line-soft sm:h-9"
          aria-label={`태그 ${filters.tag} 필터 해제`}
        >
          <span className="marker">#{filters.tag}</span>
          <XIcon size={14} className="text-pencil group-hover:text-ink" />
        </button>
      )}
    </div>
  </div>
)
