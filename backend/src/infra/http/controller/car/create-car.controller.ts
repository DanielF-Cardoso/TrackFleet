import { CreateCarService } from '@/domain/cars/application/services/create-car.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateCarDto } from '../../dto/car/create-car.dto'
import { CarPresenter } from '../../presenters/car.presenter'
import { LicensePlateAlreadyExistsError } from '@/domain/cars/application/services/errors/license-plate-already-exists.error'
import { RenavamAlreadyExistsError } from '@/domain/cars/application/services/errors/renavam-already-exists.error'

@ApiTags('Veículos')
@Controller('cars')
export class CreateCarController {
  constructor(
    private createCarService: CreateCarService,
    private i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Criar um novo veículo',
    description: 'Cria um novo veículo no sistema.',
  })
  @ApiBody({
    description: 'Dados necessários para criar um veículo.',
    type: CreateCarDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Veículo criado com sucesso.',
    schema: {
      example: {
        car: {
          id: '12345',
          managerId: '67890',
          licensePlate: 'ABC1234',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2023,
          color: 'Black',
          odometer: 0,
          status: 'AVAILABLE',
          renavam: '12345678901',
          createdAt: '2024-03-20T10:00:00Z',
          updatedAt: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 409,
    description: 'O veículo já existe.',
  })
  async create(@Request() req, @Body() body: CreateCarDto) {
    const { licensePlate, brand, model, year, color, odometer, renavam } = body

    const result = await this.createCarService.execute({
      managerId: req.user.sub,
      licensePlate,
      brand,
      model,
      year,
      color,
      odometer,
      renavam,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case LicensePlateAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.car.licensePlateAlreadyExists'),
          )
        case RenavamAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.car.renavamAlreadyExists'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      car: CarPresenter.toHTTP(result.value.car),
    }
  }
}
