import { HashComparer } from '@/core/cryptography/hash-comparer'

export class FakeHashComparer implements HashComparer {
  async compareHash(plain: string, hash: string): Promise<boolean> {
    return hash === `hashed-${plain}`
  }
}
