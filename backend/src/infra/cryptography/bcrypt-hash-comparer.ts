import { Injectable } from '@nestjs/common'
import { HashComparer } from '@/core/cryptography/hash-comparer'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class BcryptHashComparer implements HashComparer {
  async compareHash(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed)
  }
}
