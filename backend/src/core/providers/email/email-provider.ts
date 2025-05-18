export interface EmailProvider {
  sendEmail(params: {
    to: string
    subject: string
    template: string
    context: Record<string, any>
  }): Promise<void>
}

export const EMAIL_PROVIDER = 'EMAIL_PROVIDER'
