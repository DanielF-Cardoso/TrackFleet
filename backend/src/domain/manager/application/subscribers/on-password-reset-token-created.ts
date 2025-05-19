import { Injectable } from '@nestjs/common'
import { EventHandler } from '@/core/events/event-handler'
import { DomainEvents } from '@/core/events/domain-events'
import { PasswordResetTokenCreatedEvent } from '../../enterprise/events/password-reset-token-created.event'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class OnPasswordResetTokenCreated
  implements EventHandler<PasswordResetTokenCreatedEvent>
{
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this, PasswordResetTokenCreatedEvent.name)
  }

  async handle(event: PasswordResetTokenCreatedEvent): Promise<void> {
    const { managerData, token } = event
    const frontendUrl = this.configService.get<string>('FRONTEND_URL')

    await this.mailerService.sendMail({
      to: managerData.email.toValue(),
      subject: 'Recuperação de senha',
      template: 'forgot-password',
      context: {
        name: managerData.name.toValue(),
        resetLink: `${frontendUrl}/reset-password?token=${token}`,
        currentYear: new Date().getFullYear(),
      },
    })
  }
}
