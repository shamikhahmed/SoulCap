import { Controller, Get, Patch, Body } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';

@Controller({ path: 'organizations', version: '1' })
export class OrganizationsController {
  constructor(private readonly orgs: OrganizationsService) {}

  @Get('current')
  getCurrent(@OrgId() orgId: string) {
    return this.orgs.findById(orgId);
  }

  @Get('current/members')
  getMembers(@OrgId() orgId: string) {
    return this.orgs.getMembers(orgId);
  }

  @Patch('current')
  updateSettings(@OrgId() orgId: string, @Body() body: { name?: string; logoUrl?: string }) {
    return this.orgs.updateSettings(orgId, body);
  }
}
