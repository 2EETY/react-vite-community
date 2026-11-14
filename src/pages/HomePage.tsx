import { useDeferredValue, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { CategoryNav } from '@/features/posts/components/CategoryNav'
import { ListToolbar } from '@/features/posts/components/ListToolbar'
import { PostRow } from '@/features/posts/components/PostRow'
import { countByCategory, filterPosts } from '@/features/posts/filterPosts'
import { usePostFilters } from '@/features/posts/usePostFilters'
import { notebookRow, notebookSheet } from '@/components/ui/styles'
import { CATEGORY_LABEL, cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { usePostStore } from '@/stores/postStore'

const HomePage = () => {
  const { filters, update, reset } = usePostFilters()
  const postMap = usePostStore((s) => s.posts)
  const status = usePostStore((s) => s.status)
  const error = usePostStore((s) => s.error)
  const fetchPosts = usePostStore((s) => s.fetchPosts)
  const userId = useAuthStore((s) => s.user?.id ?? null)

  // 입력은 바로 반영하고, 무거운 목록 계산은 한 박자 늦게 해서 타이핑이 끊기지 않게 한다
  const query = useDeferredValue(filters.q)
  const { cat, status: solved, tag, sort, saved } = filters

  const allPosts = useMemo(() => Object.values(postMap), [postMap])
  const counts = useMemo(() => countByCategory(allPosts), [allPosts])
  const savedCount = userId ? allPosts.filter((p) => p.bookmarkedBy.includes(userId)).length : null
  const visible = useMemo(
    () => filterPosts(allPosts, { q: query, cat, status: solved, tag, sort, saved }, userId),
    [allPosts, query, cat, solved, tag, sort, saved, userId],
  )

  const heading = saved ? '내 북마크' : cat === 'all' ? '모든 글' : CATEGORY_LABEL[cat]
  const isFiltered = Boolean(filters.q || tag || solved !== 'all')

  return (
    <div className="md:grid md:grid-cols-[168px_minmax(0,1fr)] md:gap-10">
      <aside className="md:pt-1">
        <CategoryNav
          active={cat}
          saved={saved}
          counts={counts}
          savedCount={savedCount}
          onSelect={(next) => update({ cat: next === 'all' ? null : next, view: null, status: null })}
          onSelectSaved={() => update({ view: 'saved', cat: null, status: null })}
        />
      </aside>

      <section aria-labelledby="list-heading" className="mt-4 min-w-0 md:mt-0">
        <h1 id="list-heading" className="mb-4 text-2xl font-extrabold tracking-tight">
          {heading}
        </h1>

        <ListToolbar
          filters={filters}
          onQueryChange={(q) => update({ q })}
          onSortChange={(s) => update({ sort: s === 'latest' ? null : s })}
          onStatusChange={(s) => update({ status: s === 'all' ? null : s })}
          onClearTag={() => update({ tag: null })}
        />

        <p className="mt-5 mb-2 px-1 text-sm text-pencil" aria-live="polite">
          {status === 'ready' && (isFiltered ? `조건에 맞는 글 ${visible.length}개` : `글 ${visible.length}개`)}
        </p>

        <div className={cn('-mx-4 sm:mx-0', notebookSheet)}>
          {status === 'error' ? (
            <div className={cn('flex flex-col items-start gap-3 py-10', notebookRow)}>
              <p className="text-[15px] text-ink">글 목록을 불러오지 못했어요. {error}</p>
              <Button variant="secondary" size="sm" onClick={() => void fetchPosts()}>
                다시 불러오기
              </Button>
            </div>
          ) : status !== 'ready' ? (
            <ListSkeleton />
          ) : visible.length === 0 ? (
            <EmptyList saved={saved} filtered={isFiltered} onReset={reset} />
          ) : (
            <div className="divide-y divide-line">
              {visible.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  query={query}
                  activeTag={tag}
                  userId={userId}
                  onTagClick={(t) => update({ tag: t === tag ? null : t })}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

const ListSkeleton = () => (
  <div aria-label="글 목록을 불러오는 중" role="status" className="divide-y divide-line">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className={cn('animate-pulse py-5', notebookRow)}>
        <div className="h-3 w-20 rounded bg-line-soft" />
        <div className="mt-3 h-4 w-3/4 rounded bg-line-soft" />
        <div className="mt-2 h-3 w-full rounded bg-line-soft" />
      </div>
    ))}
  </div>
)

const EmptyList = ({ saved, filtered, onReset }: { saved: boolean; filtered: boolean; onReset: () => void }) => (
  <div className={cn('flex flex-col items-start gap-3 py-12', notebookRow)}>
    <p className="text-[15px] text-ink">
      {saved && !filtered
        ? '아직 북마크한 글이 없어요. 글을 읽다가 다시 보고 싶으면 북마크를 눌러 두세요.'
        : '조건에 맞는 글이 없어요. 검색어를 줄이거나 필터를 풀어 보세요.'}
    </p>
    <Button variant="secondary" size="sm" onClick={onReset}>
      모든 글 보기
    </Button>
  </div>
)

export default HomePage
