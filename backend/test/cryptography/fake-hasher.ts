import { HashGenerator } from '@/core/cryptography/hash-generator'

export class FakeHashGenerator implements HashGenerator {
  async generateHash(value: string): Promise<string> {
    return `hashed-${value}`
  }
}
