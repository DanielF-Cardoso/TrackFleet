import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { Event } from '../../enterprise/entities/event.entity'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

type ListEventsServiceResponse = Either<
  ResourceNotFoundError,
  {
    events: Event[]
  }
>

@Injectable()
export class ListEventsService {
  constructor(
    private eventRepository: EventRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<ListEventsServiceResponse> {
    this.logger.log('Fetching all events from repository', 'ListEventsService')

    const events = await this.eventRepository.findAll()

    if (!events.length) {
      const errorMessage = await this.i18n.translate('errors.event.notFound')
      this.logger.warn('No events found in the system', 'ListEventsService')
      return left(new ResourceNotFoundError(errorMessage))
    }

    this.logger.log(
      `Successfully retrieved ${events.length} events`,
      'ListEventsService',
    )

    return right({
      events,
    })
  }
}
