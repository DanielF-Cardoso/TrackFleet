import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { BcryptHashComparer } from './bcrypt-hash-comparer'
import { JwtEncrypter } from './jwt-encrypter'
import { Encrypter } from '@/core/cryptography/encrypter'
import { HashComparer } from '@/core/cryptography/hash-comparer'

@Module({
  imports: [AuthModule],
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHashComparer },
  ],
  exports: [Encrypter, HashComparer],
})
export class CryptographyModule {}
