import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/styles'

interface NotFoundMessageProps {
  title: string
  description: string
}

export const NotFoundMessage = ({ title, description }: NotFoundMessageProps) => (
  <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-20 text-center">
    <p aria-hidden className="marker px-2 text-6xl font-black text-ink">
      ?
    </p>
    <h1 className="mt-2 text-xl font-bold">{title}</h1>
    <p className="text-[15px] text-pencil">{description}</p>
    <Link to="/" className={buttonClass('secondary', 'md', 'mt-3')}>
      글 목록으로 가기
    </Link>
  </div>
)

const NotFoundPage = () => (
  <NotFoundMessage title="없는 페이지예요" description="주소를 다시 확인하거나 글 목록에서 찾아보세요." />
)

export default NotFoundPage
