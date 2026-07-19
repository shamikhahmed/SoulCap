import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ClinicalService } from './clinical.service';

/**
 * Clinician MVP stubs. Production must enforce Clerk + MembershipRole THERAPIST|ADMIN.
 * Demo header `x-clinical-demo: 1` unlocks local development without Clerk (@Public).
 */
@Public()
@Controller({ path: 'clinical', version: '1' })
export class ClinicalController {
  constructor(private readonly clinical: ClinicalService) {}

  private assertDemoOrAuth(demo?: string) {
    if (demo === '1') return;
    throw new UnauthorizedException(
      'Clinical routes require x-clinical-demo: 1 (lab) or Clerk THERAPIST role (prod)',
    );
  }

  @Get('consent/:userId')
  getConsent(
    @Param('userId') userId: string,
    @Headers('x-clinical-demo') demo?: string,
  ) {
    this.assertDemoOrAuth(demo);
    return this.clinical.getConsent(userId);
  }

  @Post('consent/:userId')
  setConsent(
    @Param('userId') userId: string,
    @Body()
    body: {
      lmmProfiling?: boolean;
      dataRetention?: boolean;
      research?: boolean;
      clinicalCompanion?: boolean;
    },
    @Headers('x-clinical-demo') demo?: string,
  ) {
    this.assertDemoOrAuth(demo);
    return this.clinical.setConsent(userId, body);
  }

  @Get('notes/:userId')
  listNotes(
    @Param('userId') userId: string,
    @Headers('x-clinical-demo') demo?: string,
  ) {
    this.assertDemoOrAuth(demo);
    return this.clinical.listNotes(userId);
  }

  @Post('notes')
  addNote(
    @Body() body: { userId: string; clinicianId: string; body: string },
    @Headers('x-clinical-demo') demo?: string,
  ) {
    this.assertDemoOrAuth(demo);
    if (!body?.userId || !body?.clinicianId || !body?.body?.trim()) {
      throw new BadRequestException('userId, clinicianId, and body required');
    }
    return this.clinical.addNote(body.userId, body.clinicianId, body.body);
  }

  @Get('audit/:userId')
  listAudit(
    @Param('userId') userId: string,
    @Headers('x-clinical-demo') demo?: string,
  ) {
    this.assertDemoOrAuth(demo);
    return this.clinical.listAudit(userId);
  }

  @Post('audit')
  record(
    @Body() body: { userId: string; action: string; resource: string; metadata?: Record<string, unknown> },
    @Headers('x-clinical-demo') demo?: string,
  ) {
    this.assertDemoOrAuth(demo);
    return this.clinical.recordAudit(body.userId, body.action, body.resource, body.metadata || {});
  }
}
