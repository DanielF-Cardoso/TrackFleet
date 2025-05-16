import {
  Controller,
  Delete,
  Param,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

import { I18nService } from 'nestjs-i18n'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DeleteCarService } from '@/domain/cars/application/services/delete-car.service'
import { CarNotFoundError } from '@/domain/cars/application/services/errors/car-not-found'

@ApiTags('Carros')
@Controller('cars')
export class DeleteCarController {
  constructor(
    private deleteCarService: DeleteCarService,
    private i18n: I18nService,
  ) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Deletar Carro',
    description: 'Remove um carro do sistema.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do carro a ser deletado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Carro deletado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível deletar o último Carro ou sua própria conta.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Carro não encontrado.',
  })
  async handle(@Param('id') id: string) {
    const result = await this.deleteCarService.execute({
      carId: id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CarNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.car.notFound'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {}
  }
}
