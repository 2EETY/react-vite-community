import { ApiError, clone, delay, readDb, saveDb } from './db'
import type { Provider, User } from '@/types'

/**
 * 가상 소셜 로그인. 실제 OAuth 대신 provider마다 계정 하나가 있다고 가정한다.
 * 처음 로그인하면 user가 null로 돌아오고, 화면에서 닉네임을 정해 가입을 마친다.
 */
const accountId = (provider: Provider) => `user-${provider}`

export const authApi = {
  async signIn(provider: Provider): Promise<{ user: User | null }> {
    await delay(700)
    const user = readDb().users.find((u) => u.id === accountId(provider))
    return { user: user ? clone(user) : null }
  },

  async signUp(provider: Provider, nickname: string): Promise<User> {
    await delay()
    const db = readDb()
    if (db.users.some((u) => u.nickname === nickname)) {
      throw new ApiError('이미 누가 쓰고 있는 닉네임이에요. 다른 이름을 골라 주세요.')
    }
    const user: User = { id: accountId(provider), provider, nickname }
    db.users.push(user)
    saveDb(db)
    return clone(user)
  },
}
