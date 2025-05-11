import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { DriverRepository } from '../repositories/driver-repository'
import { Driver } from '../../enterprise/entities/driver.entity'
import { Either, left, right } from '@/core/errors/either'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { DriverNotFoundError } from './errors/driver-not-found'

interface GetDriverProfileRequest {
  driverId: string
}

type GetDriverProfileResponse = Either<
  DriverNotFoundError,
  {
    driver: Driver
  }
>

@Injectable()
export class GetDriverProfileService {
  constructor(
    private driverRepository: DriverRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    driverId,
  }: GetDriverProfileRequest): Promise<GetDriverProfileResponse> {
    this.logger.log(
      `Fetching profile for driverId: ${driverId}`,
      'GetDriverProfileService',
    )

    const driver = await this.driverRepository.findById(driverId)

    if (!driver) {
      const errorMessage = await this.i18n.translate('errors.driver.notFound')
      this.logger.warn(
        `Driver profile not found for driverId: ${driverId}`,
        'GetDriverProfileService',
      )
      return left(new DriverNotFoundError(errorMessage))
    }

    this.logger.log(
      `Driver profile found for driverId: ${driverId}`,
      'GetDriverProfileService',
    )
    return right({ driver })
  }
}
