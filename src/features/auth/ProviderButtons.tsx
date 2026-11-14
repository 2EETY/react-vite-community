import { cn, PROVIDER_LABEL } from '@/lib/utils'
import type { Provider } from '@/types'

interface ProviderButtonsProps {
  connecting: Provider | null
  onSelect: (provider: Provider) => void
}

const STYLES: Record<Provider, { button: string; mark: string; glyph: string }> = {
  google: { button: 'border border-line bg-surface text-ink hover:border-ink', mark: 'bg-line-soft text-ink', glyph: 'G' },
  github: { button: 'bg-ink text-on-ink hover:bg-ink-soft', mark: 'bg-on-ink/15 text-on-ink', glyph: 'GH' },
  kakao: { button: 'bg-[#FEE500] text-[#191600] hover:brightness-95', mark: 'bg-black/10 text-[#191600]', glyph: 'K' },
}

const ORDER: Provider[] = ['google', 'github', 'kakao']

export const ProviderButtons = ({ connecting, onSelect }: ProviderButtonsProps) => (
  <ul className="flex flex-col gap-2.5">
    {ORDER.map((provider) => {
      const s = STYLES[provider]
      const isConnecting = connecting === provider
      return (
        <li key={provider}>
          <button
            type="button"
            onClick={() => onSelect(provider)}
            disabled={connecting !== null}
            aria-busy={isConnecting || undefined}
            className={cn(
              'flex h-12 w-full items-center gap-3 rounded-md px-3 text-[15px] font-semibold transition disabled:cursor-wait',
              s.button,
              connecting !== null && !isConnecting && 'opacity-50',
            )}
          >
            <span aria-hidden className={cn('grid size-7 place-items-center rounded text-xs font-black', s.mark)}>
              {s.glyph}
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
