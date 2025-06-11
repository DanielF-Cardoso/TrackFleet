import { Either, left, right } from '@/core/errors/either'
import { DriverRepository } from '../repositories/driver-repository'
import { I18nService } from 'nestjs-i18n'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { EventRepository } from '@/domain/event/application/repositories/event-repository'
import { DriverHasActiveEventError } from './errors/driver-has-active-event.error'

export interface InactivateDriverServiceRequest {
  driverId: string
}

type InactivateDriverServiceResponse = Either<
  ResourceNotFoundError | DriverHasActiveEventError,
  null
>

@Injectable()
export class InactivateDriverService {
  constructor(
    private driverRepository: DriverRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
    private eventRepository: EventRepository,
  ) {}

  async execute({
    driverId,
  }: InactivateDriverServiceRequest): Promise<InactivateDriverServiceResponse> {
    this.logger.log(
      `Attempting to inactivate driver with ID: ${driverId}`,
      'InactivateDriverService',
    )

    const driver = await this.driverRepository.findById(driverId)

    if (!driver) {
      const errorMessage = await this.i18n.translate('errors.driver.notFound')
      this.logger.warn(
        `Driver not found for inactivation: ID ${driverId}`,
        'InactivateDriverService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    const events = await this.eventRepository.findManyByDriverId(driverId)
    const hasActiveEvent = events.some((event) => event.status === 'EXIT')
    if (hasActiveEvent) {
      const errorMessage = await this.i18n.translate(
        'errors.driver.hasActiveEvent',
      )
      this.logger.warn(
        `Driver has active event and cannot be inactivated: ID ${driverId}`,
        'InactivateDriverService',
      )
      return left(new DriverHasActiveEventError(errorMessage))
    }

    driver.inactivate()
    await this.driverRepository.save(driver)

    this.logger.log(
      `Driver inactivated successfully with ID: ${driverId}`,
      'InactivateDriverService',
    )

    return right(null)
  }
}
