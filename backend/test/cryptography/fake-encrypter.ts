import { Encrypter } from '@/core/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return `token-${payload.sub}`
  }
}
