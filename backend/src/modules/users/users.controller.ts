import { Controller, Get, Post, Patch, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';
import { UpdateProfileDto, UpdateExtendedProfileDto, CompleteOnboardingDto } from './dto/update-profile.dto';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.users.findById(user.id);
  }

  @Patch('me')
  updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user.id, dto);
  }

  @Get('me/profile')
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.users.getProfile(user.id);
  }

  @Patch('me/profile')
  updateExtendedProfile(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Body() dto: UpdateExtendedProfileDto,
  ) {
    return this.users.updateExtendedProfile(user.id, orgId, dto);
  }

  @Post('me/onboarding/complete')
  completeOnboarding(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Body() dto: CompleteOnboardingDto,
  ) {
    return this.users.completeOnboarding(user.id, orgId, dto);
  }

  @Delete('me')
  softDeleteAccount(@CurrentUser() user: AuthenticatedUser) {
    return this.users.softDelete(user.id);
  }
}
