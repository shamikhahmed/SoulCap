import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { MemoryService } from './memory.service';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';

@Controller({ path: 'memories', version: '1' })
export class MemoryController {
  constructor(private readonly memory: MemoryService) {}

  @Get()
  retrieve(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Query('q') query: string,
  ) {
    return this.memory.retrieveForContext(user.id, orgId, query ?? '', 10);
  }

  @Post(':id/validate')
  validate(@Param('id') id: string, @Body() body: { accepted: boolean }) {
    return this.memory.userValidate(id, body.accepted);
  }
}
