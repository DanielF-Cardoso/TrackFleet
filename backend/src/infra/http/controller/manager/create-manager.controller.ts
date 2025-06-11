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
import { EmailAlreadyExistsError } from '@/core/errors/email-already-exists.error'
import { ManagerPresenter } from '../../presenters/manager.presenter'
import { CreateManagerDTO } from '../../dto/manager/create-manager.dto'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { PhoneAlreadyExistsError } from '@/domain/manager/application/services/errors/phone-already-exists.error'
import { CreateManagerDocs } from '@/infra/docs/manager/create-manager.doc'

@ApiTags('Gestores')
@Controller('managers')
export class CreateManagerController {
  constructor(
    private createManagerService: CreateManagerService,
    private i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @CreateManagerDocs()
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
