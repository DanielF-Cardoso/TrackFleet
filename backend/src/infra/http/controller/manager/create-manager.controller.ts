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
import { ManagerAlreadyExistsError } from '@/domain/manager/application/services/errors/manager-already-exists.error'
import { ManagerPresenter } from '../../presenters/manager.presenter'
import { CreateManagerDTO } from '../../dto/manager/create-manager.dto'
import { I18nService } from 'nestjs-i18n'

@Controller('managers')
export class CreateManagerController {
  constructor(
    private createManagerService: CreateManagerService,
    private i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateManagerDTO) {
    const { firstName, lastName, email, password } = body

    const result = await this.createManagerService.execute({
      firstName,
      lastName,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ManagerAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.manager.alreadyExists'),
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
