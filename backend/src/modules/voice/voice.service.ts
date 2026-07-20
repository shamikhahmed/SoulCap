import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../../database/prisma/prisma.service';
import { S3Service } from '../../storage/s3/s3.service';
import { FileType } from '@prisma/client';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);
  private readonly openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
    private readonly config: ConfigService,
  ) {
    this.openai = new OpenAI({ apiKey: this.config.getOrThrow<string>('openai.apiKey') });
  }

  async uploadAndTranscribe(
    userId: string,
    organizationId: string,
    audioBuffer: Buffer,
    mimeType: string,
    originalName: string,
    durationMs: number,
    opts?: { threadId?: string; journalId?: string },
  ) {
    const { key } = await this.s3.upload(audioBuffer, {
      folder: 'voice',
      filename: `${Date.now()}`,
      contentType: mimeType,
      userId,
      organizationId,
    });

    const file = await this.prisma.file.create({
      data: {
        userId,
        organizationId,
        type: FileType.VOICE_NOTE,
        originalName,
        storageKey: key,
        bucket: this.config.getOrThrow<string>('s3.bucket'),
        mimeType,
        sizeBytes: audioBuffer.length,
        isEncrypted: false,
      },
    });

    const voiceNote = await this.prisma.voiceNote.create({
      data: {
        userId,
        organizationId,
        fileId: file.id,
        durationMs,
        threadId: opts?.threadId ?? null,
        journalId: opts?.journalId ?? null,
      },
    });

    void this.transcribe(voiceNote.id, audioBuffer, mimeType, originalName);

    return { voiceNoteId: voiceNote.id, fileId: file.id, status: 'transcribing' };
  }

  private async transcribe(voiceNoteId: string, audioBuffer: Buffer, mimeType: string, filename: string) {
    try {
      const ext = mimeType.split('/')[1] ?? 'm4a';
      const file = new File([new Uint8Array(audioBuffer)], `audio.${ext}`, { type: mimeType });

      const response = await this.openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        response_format: 'json',
      });

      await this.prisma.voiceNote.update({
        where: { id: voiceNoteId },
        data: {
          transcript: response.text,
          transcribedAt: new Date(),
          transcribeModel: 'whisper-1',
        },
      });

      this.logger.debug(`Transcribed voice note ${voiceNoteId}`);
    } catch (err) {
      this.logger.error(`Transcription failed for ${voiceNoteId}`, err);
    }
  }

  async getVoiceNote(voiceNoteId: string, userId: string) {
    return this.prisma.voiceNote.findFirst({
      where: { id: voiceNoteId, userId, deletedAt: null },
    });
  }

  async listVoiceNotes(userId: string, organizationId: string, limit = 20) {
    return this.prisma.voiceNote.findMany({
      where: { userId, organizationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async softDelete(voiceNoteId: string, userId: string) {
    return this.prisma.voiceNote.update({
      where: { id: voiceNoteId },
      data: { deletedAt: new Date() },
    });
  }
}
