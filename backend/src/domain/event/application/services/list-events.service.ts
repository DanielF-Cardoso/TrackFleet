import { Injectable } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { Event } from '../../enterprise/entities/event.entity'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

type ListEventsServiceResponse = Either<
  ResourceNotFoundError,
  { events: Event[] }
>

@Injectable()
export class ListEventsService {
  constructor(
    private eventRepository: EventRepository,
    private i18n: I18nService,
  ) {}

  async execute(): Promise<ListEventsServiceResponse> {
    const events = await this.eventRepository.findAll()

    if (events.length === 0) {
      const errorMessage = await this.i18n.translate('event.notFound')
      return left(new ResourceNotFoundError(errorMessage))
    }

    return right({ events })
  }
}
