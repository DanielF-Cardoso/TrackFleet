import { Controller, Get, UseGuards, NotFoundException } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ListManagersService } from '@/domain/manager/application/services/list-managers.service'
import { ManagerPresenter } from '../../presenters/manager.presenter'

@Controller('managers')
export class ListManagersController {
  constructor(private listManagersService: ListManagersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle() {
    const result = await this.listManagersService.execute()

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return {
      managers: result.value.managers.map(ManagerPresenter.toHTTP),
    }
  }
}
