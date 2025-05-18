import { Injectable, Logger } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { EmailProvider } from '@/core/providers/email/email-provider'

@Injectable()
export class MailerEmailProvider implements EmailProvider {
  private readonly logger = new Logger(MailerEmailProvider.name)

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(params: {
    to: string
    subject: string
    template: string
    context: Record<string, any>
  }): Promise<void> {
    const { to, subject, template, context } = params

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: `${template}.hbs`,
        context: {
          ...context,
          currentYear: new Date().getFullYear(),
        },
      })
    } catch (error) {
      this.logger.error('Error sending email:', error)
      throw error
    }
  }
}
