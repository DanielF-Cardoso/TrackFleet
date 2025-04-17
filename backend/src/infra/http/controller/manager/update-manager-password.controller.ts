import {
  Body,
  Controller,
  Patch,
  Req,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UpdateManagerPasswordService } from '@/domain/manager/application/services/update-manager-password.service'
import { InvalidCredentialsError } from '@/domain/manager/application/services/errors/invalid-credentials.error'
import { Request } from 'express'
import { UpdateManagerPasswordDTO } from '../../dto/manager/update-manager-password.dto'

interface AuthenticatedRequest extends Request {
  user: {
    sub: string
  }
}

@Controller('managers/password')
export class UpdateManagerPasswordController {
  constructor(
    private updateManagerPasswordService: UpdateManagerPasswordService,
  ) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body() body: UpdateManagerPasswordDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const managerId = req.user.sub

    const result = await this.updateManagerPasswordService.execute({
      managerId,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new BadRequestException('Invalid password')
        default:
          throw new UnauthorizedException('Unexpected error')
      }
    }

    return {
      message: 'Password updated successfully',
    }
  }
}
