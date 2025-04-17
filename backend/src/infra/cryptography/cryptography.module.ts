import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { BcryptHashComparer } from './bcrypt-hash-comparer'
import { JwtEncrypter } from './jwt-encrypter'
import { Encrypter } from '@/core/cryptography/encrypter'
import { HashComparer } from '@/core/cryptography/hash-comparer'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { BcryptHasherGenerator } from './bcrypt-hash-generator'

@Module({
  imports: [AuthModule],
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHashComparer },
    { provide: HashGenerator, useClass: BcryptHasherGenerator },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
