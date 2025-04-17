import {
  Controller,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common'
import { GetManagerProfileService } from '@/domain/manager/application/services/get-manager-profile.service'
import { Request } from 'express'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ManagerPresenter } from '../../presenters/manager.presenter'

interface AuthenticatedRequest extends Request {
  user: {
    sub: string
  }
}

@Controller('managers')
export class GetManagerProfileController {
  constructor(private getManagerProfile: GetManagerProfileService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: AuthenticatedRequest) {
    const managerId = req.user.sub

    const result = await this.getManagerProfile.execute({ managerId })

    if (result.isLeft()) {
      throw new UnauthorizedException('Manager not found')
    }

    return {
      manager: ManagerPresenter.toHTTP(result.value.manager),
    }
  }
}
