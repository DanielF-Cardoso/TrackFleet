import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { Driver } from '../../enterprise/entities/driver.entity'
import { DriverRepository } from '../repositories/driver-repository'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { I18nService } from 'nestjs-i18n'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

type ListDriversServiceResponse = Either<
  ResourceNotFoundError,
  { drivers: Driver[] }
>

@Injectable()
export class ListDriversService {
  constructor(
    private driverRepository: DriverRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<ListDriversServiceResponse> {
    this.logger.log('Listing all drivers', 'ListDriversService')

    const drivers = await this.driverRepository.findAll()

    if (drivers.length === 0) {
      const errorMessage = await this.i18n.translate(
        'errors.driver.notFoundAll',
      )
      this.logger.warn('No drivers found', 'ListDriversService')
      return left(new ResourceNotFoundError(errorMessage))
    }

    this.logger.log(`Found ${drivers.length} driver(s)`, 'ListDriversService')
    return right({ drivers })
  }
}
