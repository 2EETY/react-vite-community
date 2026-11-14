import { cn, PROVIDER_LABEL } from '@/lib/utils'
import type { Provider } from '@/types'

interface ProviderButtonsProps {
  connecting: Provider | null
  onSelect: (provider: Provider) => void
}

/**
 * 세 버튼을 같은 무게의 흰 버튼으로 맞추고, 서비스 색은 왼쪽 작은 표시에만 남긴다.
 * 카카오 노란색이 화면에서 가장 큰 색 면이 되어 형광펜 포인트와 다투지 않게 하려는 것.
 */
const MARKS: Record<Provider, { className: string; glyph: string }> = {
  google: { className: 'border border-line bg-surface text-ink', glyph: 'G' },
  github: { className: 'bg-[#24292f] text-white ring-1 ring-white/15', glyph: 'GH' },
  kakao: { className: 'bg-[#FEE500] text-[#191600]', glyph: 'K' },
}

const ORDER: Provider[] = ['google', 'github', 'kakao']

export const ProviderButtons = ({ connecting, onSelect }: ProviderButtonsProps) => (
  <ul className="flex flex-col gap-2.5">
    {ORDER.map((provider) => {
      const mark = MARKS[provider]
      const isConnecting = connecting === provider
      return (
        <li key={provider}>
          <button
            type="button"
            onClick={() => onSelect(provider)}
            disabled={connecting !== null}
            aria-busy={isConnecting || undefined}
            className={cn(
              'flex h-12 w-full items-center gap-3 rounded-md border border-line bg-surface px-3 text-[15px] font-semibold text-ink transition-colors hover:border-ink disabled:cursor-wait',
              connecting !== null && !isConnecting && 'opacity-50',
            )}
          >
            <span aria-hidden className={cn('grid size-7 place-items-center rounded text-xs font-black', mark.className)}>
              {mark.glyph}
            </span>
            <span className="flex-1 text-left">
              {isConnecting ? `${PROVIDER_LABEL[provider]}에 연결하는 중…` : `${PROVIDER_LABEL[provider]}로 계속하기`}
            </span>
            {isConnecting && (
              <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            )}
          </button>
        </li>
      )
    })}
  </ul>
)
