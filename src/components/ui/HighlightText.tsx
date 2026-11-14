interface HighlightTextProps {
  text: string
  query: string
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** 검색어와 일치하는 부분에 형광펜을 긋는다 */
export const HighlightText = ({ text, query }: HighlightTextProps) => {
  const q = query.trim()
  if (!q) return <>{text}</>

  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="marker bg-transparent text-inherit">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}
