import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { randomUUID } from 'node:crypto'
import { RequestContext } from './request-context'

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const requestId = randomUUID()
    RequestContext.set('requestId', requestId)

    context.switchToHttp().getResponse().setHeader('X-Request-Id', requestId)

    return next.handle()
  }
}
