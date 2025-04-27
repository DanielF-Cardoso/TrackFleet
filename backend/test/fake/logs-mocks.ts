import { LoggerService } from '@nestjs/common'
import { vi } from 'vitest'

export class FakeLogger implements LoggerService {
  log = vi.fn()
  error = vi.fn()
  warn = vi.fn()
  debug = vi.fn()
  verbose = vi.fn()
}
