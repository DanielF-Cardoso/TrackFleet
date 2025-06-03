import {
  Body,
  Controller,
  Patch,
  UseGuards,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Param,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CarPresenter } from '../../presenters/car.presenter'
import { I18nService } from 'nestjs-i18n'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UpdateCarService } from '@/domain/cars/application/services/update-car.service'
import { UpdateCarDTO } from '../../dto/car/update-car.dto'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { LicensePlateAlreadyExistsError } from '@/domain/cars/application/services/errors/license-plate-already-exists.error'
import { RenavamAlreadyExistsError } from '@/domain/cars/application/services/errors/renavam-already-exists.error'

@ApiTags('Carros')
@Controller('cars')
export class UpdateCarController {
  constructor(
    private updateCarProfileService: UpdateCarService,
    private readonly i18n: I18nService,
  ) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualizar carro',
    description: 'Permite que um carro atualize.',
  })
  @ApiBody({
    description: 'Dados necessários para atualizar o carro.',
    type: UpdateCarDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Carro atualizado com sucesso.',
    schema: {
      example: {
        car: {
          id: '12345',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Carro não encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'O novo carro não pode ser igual ao atual.',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um carro com este e‑mai.',
  })
  async handle(@Body() body: UpdateCarDTO, @Param('id') id: string) {
    const result = await this.updateCarProfileService.execute({
      carId: id,
      brand: body.brand,
      model: body.model,
      year: body.year,
      color: body.color,
      licensePlate: body.licensePlate,
      odometer: body.odometer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.car.notFound'),
          )
        case LicensePlateAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.car.licensePlateAlreadyExists'),
          )
        case RenavamAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.car.renavamAlreadyExists'),
          )
        default:
          throw new BadRequestException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      car: CarPresenter.toHTTP(result.value.car),
    }
  }
}
