import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { JournalService } from './journal.service';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';

@Controller({ path: 'journal', version: '1' })
export class JournalController {
  constructor(private readonly journal: JournalService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Body() body: { title?: string; content: string; mood?: string; tags?: string[] },
  ) {
    return this.journal.create(user.id, orgId, body);
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string, @Query('cursor') cursor?: string) {
    return this.journal.list(user.id, orgId, 20, cursor);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.journal.findById(id, user.id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { title?: string; content?: string; mood?: string; tags?: string[] },
  ) {
    return this.journal.update(id, user.id, body);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.journal.softDelete(id, user.id);
  }
}
