import { CreateManagerService } from '@/domain/manager/application/services/create-manager.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { EmailAlreadyExistsError } from '@/domain/manager/application/services/errors/email-already-exists.error'
import { ManagerPresenter } from '../../presenters/manager.presenter'
import { CreateManagerDTO } from '../../dto/manager/create-manager.dto'
import { I18nService } from 'nestjs-i18n'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PhoneAlreadyExistsError } from '@/domain/manager/application/services/errors/phone-already-exists.error'

@ApiTags('Gestores')
@Controller('managers')
export class CreateManagerController {
  constructor(
    private createManagerService: CreateManagerService,
    private i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Criar um novo gestor',
    description: 'Cria um novo gestor no sistema.',
  })
  @ApiBody({
    description: 'Dados necessários para criar um gestor.',
    type: CreateManagerDTO,
  })
  @ApiResponse({
    status: 201,
    description: 'Gestor criado com sucesso.',
    schema: {
      example: {
        manager: {
          id: '12345',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: '123456',
          phone: '1234567890',
          street: '123 Main St',
          number: 123,
          district: 'Downtown',
          zipCode: '12345',
          city: 'Anytown',
          state: 'CA',
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
    description: 'O gestor já existe.',
  })
  async create(@Body() body: CreateManagerDTO) {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      street,
      number,
      district,
      zipCode,
      city,
      state,
    } = body

    const result = await this.createManagerService.execute({
      firstName,
      lastName,
      email,
      password,
      phone,
      street,
      number,
      district,
      zipCode,
      city,
      state,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case EmailAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.manager.alreadyExists'),
          )
        case PhoneAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.manager.alreadyExistsByPhone'),
          )
        default:
          throw new InternalServerErrorException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      manager: ManagerPresenter.toHTTP(result.value.manager),
    }
  }
}
