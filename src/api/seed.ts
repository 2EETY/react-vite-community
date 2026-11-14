import type { Comment, Post, User } from '@/types'
import type { Database } from './db'

const HOUR = 3_600_000

const users: User[] = [
  { id: 'seed-dawn', nickname: '새벽코더', provider: 'github' },
  { id: 'seed-newbie', nickname: '리액트입문', provider: 'google' },
  { id: 'seed-hunter', nickname: '버그사냥꾼', provider: 'kakao' },
  { id: 'seed-type', nickname: '타입은안전하게', provider: 'github' },
]

const [dawn, newbie, hunter, typed] = users

type PostSeed = Omit<Post, 'id' | 'authorName' | 'createdAt' | 'updatedAt' | 'commentCount'> & {
  id: string
  hoursAgo: number
}

const postSeeds: PostSeed[] = [
  {
    id: 'p-effect-loop',
    authorId: newbie.id,
    category: 'question',
    title: 'useEffect 안에서 setState 했더니 무한 렌더링이 나요',
    body: '목록을 불러온 뒤 필터링한 결과를 state에 넣으려고 useEffect 안에서 setFiltered를 호출했어요.\n\n의존성 배열에 filtered를 넣었더니 화면이 계속 깜빡이고 콘솔에 Maximum update depth exceeded가 찍힙니다. 의존성 배열을 비우면 검색어가 바뀌어도 반영이 안 되고요.\n\n어떻게 고쳐야 할까요?',
    tags: ['react', 'useEffect'],
    likedBy: [dawn.id, hunter.id, typed.id],
    bookmarkedBy: [hunter.id],
    acceptedCommentId: 'c-effect-1',
    hoursAgo: 5,
  },
  {
    id: 'p-zustand-diary',
    authorId: dawn.id,
    category: 'diary',
    title: '전역 상태를 Zustand로 옮긴 첫날',
    body: 'Context 하나에 로그인 정보, 게시글, 모달 상태를 다 몰아넣었더니 모달 하나 열 때마다 목록 전체가 다시 그려지고 있었다.\n\n오늘은 스토어를 auth, posts, ui로 나누고 컴포넌트마다 필요한 값만 selector로 꺼내 쓰게 바꿨다. React DevTools Profiler로 보니 리렌더링이 눈에 띄게 줄었다.\n\n내일은 낙관적 업데이트를 붙여 볼 생각.',
    tags: ['zustand', '상태관리'],
    likedBy: [newbie.id, typed.id],
    bookmarkedBy: [],
    acceptedCommentId: null,
    hoursAgo: 9,
  },
  {
    id: 'p-zod-question',
    authorId: hunter.id,
    category: 'question',
    title: 'zod 스키마에서 비밀번호 확인 필드는 어떻게 비교하나요?',
    body: 'react-hook-form이랑 zod를 같이 쓰고 있는데, password와 passwordConfirm이 같은지 검사하는 방법을 모르겠어요.\n\n각 필드 검증은 잘 되는데 두 필드를 비교하는 규칙은 어디에 둬야 하나요? 에러 메시지는 passwordConfirm 아래에 보여주고 싶어요.',
    tags: ['zod', 'react-hook-form', '폼검증'],
    likedBy: [newbie.id],
    bookmarkedBy: [newbie.id],
    acceptedCommentId: null,
    hoursAgo: 20,
  },
  {
    id: 'p-chat-keyboard',
    authorId: typed.id,
    category: 'chat',
    title: '다들 코딩할 때 키보드 뭐 쓰세요?',
    body: '손목이 슬슬 아파서 키보드를 바꿔 보려고 합니다. 저소음 적축이랑 무접점 사이에서 고민 중인데 써 보신 분들 후기 궁금해요.',
    tags: ['장비'],
    likedBy: [],
    bookmarkedBy: [],
    acceptedCommentId: null,
    hoursAgo: 30,
  },
  {
    id: 'p-key-question',
    authorId: newbie.id,
    category: 'question',
    title: '리스트 key로 index를 쓰면 안 되는 이유가 궁금해요',
    body: '경고가 사라지길래 map의 두 번째 인자인 index를 key로 넣었는데, 항목을 중간에서 삭제하니 입력창 값이 엉뚱한 줄로 옮겨 가요. key가 정확히 어떤 역할을 하는 건가요?',
    tags: ['react', '렌더링'],
    likedBy: [dawn.id, hunter.id],
    bookmarkedBy: [dawn.id],
    acceptedCommentId: null,
    hoursAgo: 52,
  },
  {
    id: 'p-tailwind-diary',
    authorId: typed.id,
    category: 'diary',
    title: 'Tailwind v4로 넘어오면서 설정 파일이 사라졌다',
    body: 'tailwind.config.js 없이 CSS 파일 안의 @theme 블록에 색과 폰트를 정의하는 방식으로 바뀌었다. 처음엔 어색했는데 디자인 토큰이 CSS 변수로 바로 나오니까 오히려 편하다.\n\n아직 플러그인 쪽은 더 봐야 할 것 같다.',
    tags: ['tailwind', 'css'],
    likedBy: [newbie.id, dawn.id, hunter.id],
    bookmarkedBy: [newbie.id],
    acceptedCommentId: null,
    hoursAgo: 75,
  },
  {
    id: 'p-chat-study',
    authorId: hunter.id,
    category: 'chat',
    title: '주말에 같이 모각코 하실 분',
    body: '토요일 오후에 각자 할 거 하면서 두 시간 정도 같이 집중해 보실 분 있나요? 끝나고 오늘 한 것만 짧게 공유하는 방식이면 좋겠어요.',
    tags: ['모각코'],
    likedBy: [typed.id],
    bookmarkedBy: [],
    acceptedCommentId: null,
    hoursAgo: 120,
  },
]

const commentSeeds: Array<Omit<Comment, 'createdAt' | 'updatedAt' | 'authorName'> & { hoursAgo: number }> = [
  {
    id: 'c-effect-1',
    postId: 'p-effect-loop',
    authorId: dawn.id,
    body: '필터링 결과는 state로 따로 들고 있을 필요가 없어요. 원본 목록과 검색어만 state로 두고, 렌더링할 때 filter로 계산하면 됩니다. 계산이 무거우면 useMemo로 감싸세요.\n\nstate에서 계산할 수 있는 값을 또 state로 두면 이런 동기화 문제가 계속 생겨요.',
    hoursAgo: 4,
  },
  {
    id: 'c-effect-2',
    postId: 'p-effect-loop',
    authorId: hunter.id,
    body: '공식 문서의 "You Might Not Need an Effect" 글에 똑같은 예시가 있어요. 한번 읽어 보시길 추천해요.',
    hoursAgo: 3,
  },
  {
    id: 'c-zod-1',
    postId: 'p-zod-question',
    authorId: typed.id,
    body: 'object 스키마 뒤에 refine을 붙이고 path를 ["passwordConfirm"]로 지정하면 그 필드 아래에 에러가 붙어요.',
    hoursAgo: 18,
  },
  {
    id: 'c-zustand-1',
    postId: 'p-zustand-diary',
    authorId: newbie.id,
    body: 'Profiler로 확인까지 하신 게 멋지네요. 저도 따라 해 봐야겠어요.',
    hoursAgo: 8,
  },
  {
    id: 'c-key-1',
    postId: 'p-key-question',
    authorId: hunter.id,
    body: 'key는 React가 이전 렌더링의 항목과 지금 항목을 짝지을 때 쓰는 이름표예요. index는 삭제하면 뒤 항목들의 번호가 당겨지니까 다른 항목과 짝지어지는 거죠. 데이터의 고유 id를 쓰세요.',
    hoursAgo: 50,
  },
]

export const createSeed = (): Database => {
  const now = Date.now()
  const nameOf = (id: string) => users.find((u) => u.id === id)?.nickname ?? '알 수 없음'

  const comments: Comment[] = commentSeeds.map(({ hoursAgo, ...c }) => ({
    ...c,
    authorName: nameOf(c.authorId),
    createdAt: now - hoursAgo * HOUR,
    updatedAt: now - hoursAgo * HOUR,
  }))

  const posts: Post[] = postSeeds.map(({ hoursAgo, ...p }) => ({
    ...p,
    authorName: nameOf(p.authorId),
    createdAt: now - hoursAgo * HOUR,
    updatedAt: now - hoursAgo * HOUR,
    commentCount: comments.filter((c) => c.postId === p.id).length,
  }))

  return { users: [...users], posts, comments }
}
