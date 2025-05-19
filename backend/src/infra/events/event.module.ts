import { Module } from '@nestjs/common'
import { OnPasswordResetTokenCreated } from '@/domain/manager/application/subscribers/on-password-reset-token-created'
import { MailerModule } from '@nestjs-modules/mailer'

@Module({
  imports: [MailerModule],
  providers: [OnPasswordResetTokenCreated],
})
export class EventsModule {}
