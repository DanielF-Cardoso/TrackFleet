import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { DriverRepository } from '../repositories/driver-repository'
import { Either, left, right } from '@/core/errors/either'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { DriverNotFoundError } from './errors/driver-not-found'

interface DeleteDriverServiceRequest {
  driverId: string
}

type DeleteDriverServiceResponse = Either<DriverNotFoundError, null>

@Injectable()
export class DeleteDriverService {
  constructor(
    private driverRepository: DriverRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    driverId,
  }: DeleteDriverServiceRequest): Promise<DeleteDriverServiceResponse> {
    this.logger.log(
      `Fetching driver for delete: ${driverId}`,
      'DeleteDriverServiceService',
    )

    const driver = await this.driverRepository.findById(driverId)

    if (!driver) {
      const errorMessage = await this.i18n.translate('errors.driver.notFound')
      this.logger.warn(
        `Driver not found for driverId: ${driverId}`,
        'DeleteDriverServiceService',
      )
      return left(new DriverNotFoundError(errorMessage))
    }

    await this.driverRepository.delete(driverId)

    this.logger.log(
      `Driver with ID ${driverId} deleted successfully`,
      'DeleteDriverServiceService',
    )
    return right(null)
  }
}
