import {
  Body,
  Controller,
  Patch,
  Param,
  UseGuards,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UpdateOtherManagerProfileService } from '@/domain/manager/application/services/update-other-manager-profile.service'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { ManagerPresenter } from '../../presenters/manager.presenter'
import { UpdateManagerProfileDTO } from '../../dto/manager/update-manager-profile.dto'
import { I18nService } from 'nestjs-i18n'
import { ApiTags } from '@nestjs/swagger'
import { EmailAlreadyExistsError } from '@/core/errors/email-already-exists.error'
import { PhoneAlreadyExistsError } from '@/domain/manager/application/services/errors/phone-already-exists.error'
import { UpdateOtherManagerProfileDocs } from '@/infra/docs/manager/update-other-manager-profile.doc'

@ApiTags('Gestores')
@Controller('managers/:managerId')
export class UpdateOtherManagerProfileController {
  constructor(
    private updateOtherManagerProfileService: UpdateOtherManagerProfileService,
    private readonly i18n: I18nService,
  ) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UpdateOtherManagerProfileDocs()
  async handle(
    @Param('managerId') managerId: string,
    @Body() body: UpdateManagerProfileDTO,
  ) {
    const result = await this.updateOtherManagerProfileService.execute({
      managerId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      street: body.street,
      number: body.number,
      district: body.district,
      zipCode: body.zipCode,
      city: body.city,
      state: body.state,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            await this.i18n.translate('errors.manager.notFound'),
          )
        case EmailAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.manager.alreadyExists'),
          )
        case PhoneAlreadyExistsError:
          throw new ConflictException(
            await this.i18n.translate('errors.manager.alreadyExistsByPhone'),
          )
        default:
          throw new BadRequestException(
            await this.i18n.translate('errors.generic.unexpectedError'),
          )
      }
    }

    return {
      manager: ManagerPresenter.toHTTP(result.value.manager),
    }
  }
}
