import { z } from 'zod'

export const TITLE_MAX = 60
export const BODY_MAX = 5000
export const TAG_MAX_COUNT = 5
export const TAG_MAX_LENGTH = 15

/** 폼 검증 규칙을 한곳에 모은 스키마. 타입(PostFormValues)도 여기서 자동으로 만들어진다 */
export const postSchema = z.object({
  category: z.enum(['question', 'diary', 'chat'], { error: '글 종류를 골라 주세요.' }),
  title: z
    .string()
    .trim()
    .min(2, '제목은 2자 이상 적어 주세요.')
    .max(TITLE_MAX, `제목은 ${TITLE_MAX}자까지 쓸 수 있어요.`),
  body: z
    .string()
    .trim()
    .min(10, '본문은 10자 이상 적어 주세요. 상황을 자세히 쓸수록 좋은 답이 달려요.')
    .max(BODY_MAX, `본문은 ${BODY_MAX.toLocaleString()}자까지 쓸 수 있어요.`),
  tags: z.array(z.string()).max(TAG_MAX_COUNT, `태그는 ${TAG_MAX_COUNT}개까지 달 수 있어요.`),
})

export type PostFormValues = z.infer<typeof postSchema>

/** 태그 하나를 추가하기 전에 확인. 문제가 있으면 안내 문구, 없으면 null */
export const validateTag = (tag: string, current: string[]): string | null => {
  if (!tag) return null
  if (current.length >= TAG_MAX_COUNT) return `태그는 ${TAG_MAX_COUNT}개까지 달 수 있어요.`
  if (tag.length > TAG_MAX_LENGTH) return `태그 하나는 ${TAG_MAX_LENGTH}자까지 쓸 수 있어요.`
  if (!/^[\p{L}\p{N}_-]+$/u.test(tag)) return '태그에는 글자, 숫자, -, _만 쓸 수 있어요.'
  if (current.includes(tag)) return '이미 단 태그예요.'
  return null
}
