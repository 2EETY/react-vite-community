import type { Comment, Post, User } from '@/types'
import { createSeed } from './seed'

/**
 * 가짜 백엔드. localStorage를 DB처럼 쓰고, 모든 요청에 지연을 줘서
 * 실제 네트워크처럼 로딩 상태가 드러나게 한다.
 * 화면과 스토어는 이 파일을 모르고 posts/comments/auth API만 호출하므로,
 * 나중에 실제 서버로 바꿀 때 api/ 폴더만 교체하면 된다.
 */
export interface Database {
  users: User[]
  posts: Post[]
  comments: Comment[]
}

const KEY = 'mureum:db:v1'

export class ApiError extends Error {}

export const saveDb = (db: Database) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    // 시크릿 모드 등 저장소를 못 쓰는 환경에서는 새로고침 전까지만 유지된다
  }
}

let memoryDb: Database | null = null

export const readDb = (): Database => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Database
  } catch {
    // 손상된 데이터는 무시하고 시드로 다시 시작
  }
  memoryDb ??= createSeed()
  saveDb(memoryDb)
  return memoryDb
}

export const resetDb = () => {
  memoryDb = createSeed()
  saveDb(memoryDb)
}

export const delay = (ms = 200 + Math.random() * 350) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const uid = () => crypto.randomUUID()

export const clone = <T,>(value: T): T => structuredClone(value)
