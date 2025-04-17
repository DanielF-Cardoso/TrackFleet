import { CreateManagerService } from '@/domain/manager/application/services/create-manager.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { CreateManagerBody } from '../dto/create-manager-body.dto'
import { ManagerAlreadyExistsError } from '@/domain/manager/application/services/errors/manager-already-exists.error'
import { ManagerPresenter } from '../presenters/manager.presenter'

@Controller('managers')
export class CreateManagerController {
  constructor(private createManagerService: CreateManagerService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateManagerBody) {
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
          throw new BadRequestException(error.message)
        default:
          throw new UnauthorizedException(error.message)
      }
    }

    return {
      manager: ManagerPresenter.toHTTP(result.value.manager),
    }
  }
}
