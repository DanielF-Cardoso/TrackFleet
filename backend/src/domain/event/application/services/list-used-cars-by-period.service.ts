import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EventRepository } from '@/domain/event/application/repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { Event } from '@/domain/event/enterprise/entities/event.entity'

interface ListUsedCarsByPeriodServiceRequest {
  startDate: Date
  endDate: Date
}

type ListUsedCarsByPeriodServiceResponse = Either<
  ResourceNotFoundError,
  { events: Event[] }
>

@Injectable()
export class ListUsedCarsByPeriodService {
  constructor(
    private eventRepository: EventRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    startDate,
    endDate,
  }: ListUsedCarsByPeriodServiceRequest): Promise<ListUsedCarsByPeriodServiceResponse> {
    this.logger.log(
      `Fetching car events between ${startDate} and ${endDate}`,
      'ListUsedCarsByPeriodService',
    )

    const events = await this.eventRepository.findManyByPeriod(
      startDate,
      endDate,
    )

    if (!events.length) {
      const errorMessage = await this.i18n.translate('errors.event.notFound')
      this.logger.warn(
        'No events found in the given period',
        'ListUsedCarsByPeriodService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    this.logger.log(
      `Successfully retrieved ${events.length} events`,
      'ListUsedCarsByPeriodService',
    )

    return right({ events })
  }
}
