import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { HashGenerator } from '@/core/cryptography/hash-generator'

@Injectable()
export class BcryptHasherGenerator implements HashGenerator {
  async generateHash(plain: string): Promise<string> {
    const saltRounds = 8
    return bcrypt.hash(plain, saltRounds)
  }
}
