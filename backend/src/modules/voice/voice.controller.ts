import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service';
import { Request } from 'express';

@Controller('voice')
export class VoiceController {
  constructor(private readonly voice: VoiceService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('audio'))
  async upload(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Query('durationMs', ParseIntPipe) durationMs: number,
    @Query('threadId') threadId?: string,
    @Query('journalId') journalId?: string,
  ) {
    if (!file) throw new BadRequestException('No audio file provided');

    const { id: userId, organizationId } = (req as any).user;
    return this.voice.uploadAndTranscribe(
      userId,
      organizationId,
      file.buffer,
      file.mimetype,
      file.originalname,
      durationMs,
      { threadId, journalId },
    );
  }

  @Get()
  async list(@Req() req: Request) {
    const { id: userId, organizationId } = (req as any).user;
    return this.voice.listVoiceNotes(userId, organizationId);
  }

  @Get(':id')
  async getOne(@Req() req: Request, @Param('id') id: string) {
    const { id: userId } = (req as any).user;
    return this.voice.getVoiceNote(id, userId);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const { id: userId } = (req as any).user;
    return this.voice.softDelete(id, userId);
  }
}
