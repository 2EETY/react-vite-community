import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RichTextProps {
  text: string
  className?: string
}

/*
 * 글·댓글 본문용 최소 서식. 개발 Q&A라서 꼭 필요한 세 가지만 지원한다.
 *  - ```로 감싼 코드 블록
 *  - `백틱`으로 감싼 인라인 코드
 *  - http(s) 주소 자동 링크
 * HTML 문자열을 끼워 넣지 않고 React 요소로 만들기 때문에, 본문에 <script>가 있어도 글자로만 보인다.
 */
const FENCE = /```[^\n]*\n?([\s\S]*?)```/g
const INLINE = /(`[^`\n]+`)|(https?:\/\/[^\s<]*[^\s<.,:;"'!?)\]])/g

const renderInline = (text: string, keyPrefix: string): ReactNode[] => {
  const nodes: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0
    if (index > last) nodes.push(text.slice(last, index))
    const [token, code, url] = match
    const key = `${keyPrefix}-${index}`
    if (code) {
      nodes.push(
        <code key={key} className="rounded bg-line-soft px-1.5 py-0.5 font-mono text-[0.88em] text-ink">
          {code.slice(1, -1)}
        </code>,
      )
    } else if (url) {
      nodes.push(
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-ink underline decoration-pencil underline-offset-4 hover:decoration-ink"
        >
          {url}
        </a>,
      )
    } else {
      nodes.push(token)
    }
    last = index + token.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export const RichText = ({ text, className }: RichTextProps) => {
  const blocks: ReactNode[] = []
  let last = 0

  for (const match of text.matchAll(FENCE)) {
    const index = match.index ?? 0
    // 코드 블록 앞뒤의 빈 줄은 블록 여백(my-3)과 겹치니 떼어 낸다
    const before = text.slice(last, index).replace(/\n{1,2}$/, '')
    if (before) blocks.push(<span key={`t-${last}`}>{renderInline(before, `t-${last}`)}</span>)
    blocks.push(
      <pre
        key={`c-${index}`}
        className="my-3 overflow-x-auto rounded-md border border-line bg-line-soft/60 px-4 py-3 font-mono text-[13.5px] leading-relaxed whitespace-pre text-ink"
      >
        <code>{match[1].replace(/\n$/, '')}</code>
      </pre>,
    )
    last = index + match[0].length
    if (text[last] === '\n') last += 1
    if (text[last] === '\n') last += 1
  }
  const rest = text.slice(last)
  if (rest) blocks.push(<span key={`t-${last}`}>{renderInline(rest, `t-${last}`)}</span>)

  return <div className={cn('whitespace-pre-wrap', className)}>{blocks}</div>
}

/** 입력칸 아래에 보여 줄 서식 안내 */
export const FORMAT_HINT = '```로 감싸면 코드 블록, `백틱`은 인라인 코드, 주소는 자동으로 링크가 돼요.'
