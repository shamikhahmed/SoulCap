import { Injectable } from '@nestjs/common';

export type ConsentRecord = {
  userId: string;
  lmmProfiling: boolean;
  dataRetention: boolean;
  research: boolean;
  clinicalCompanion: boolean;
  givenAt: string | null;
};

export type ClinicalNote = {
  id: string;
  userId: string;
  clinicianId: string;
  body: string;
  createdAt: string;
};

export type ClinicalAuditEvent = {
  id: string;
  userId: string;
  action: string;
  resource: string;
  metadata?: Record<string, unknown>;
  at: string;
};

/** In-memory clinical store for local / demo until Prisma wiring lands. */
@Injectable()
export class ClinicalService {
  private consent = new Map<string, ConsentRecord>();
  private notes = new Map<string, ClinicalNote[]>();
  private audit: ClinicalAuditEvent[] = [];

  getConsent(userId: string): ConsentRecord {
    return (
      this.consent.get(userId) || {
        userId,
        lmmProfiling: false,
        dataRetention: false,
        research: false,
        clinicalCompanion: false,
        givenAt: null,
      }
    );
  }

  setConsent(
    userId: string,
    patch: Partial<Omit<ConsentRecord, 'userId' | 'givenAt'>>,
  ): ConsentRecord {
    const next: ConsentRecord = {
      ...this.getConsent(userId),
      ...patch,
      userId,
      givenAt: new Date().toISOString(),
    };
    this.consent.set(userId, next);
    this.recordAudit(userId, 'consent.update', 'consent', patch as Record<string, unknown>);
    return next;
  }

  addNote(userId: string, clinicianId: string, body: string): ClinicalNote {
    const note: ClinicalNote = {
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      clinicianId,
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };
    const list = this.notes.get(userId) || [];
    list.unshift(note);
    this.notes.set(userId, list);
    this.recordAudit(userId, 'note.create', 'clinical_note', { noteId: note.id, clinicianId });
    return note;
  }

  listNotes(userId: string): ClinicalNote[] {
    return this.notes.get(userId) || [];
  }

  listAudit(userId: string, limit = 50): ClinicalAuditEvent[] {
    return this.audit.filter((e) => e.userId === userId).slice(0, limit);
  }

  recordAudit(
    userId: string,
    action: string,
    resource: string,
    metadata: Record<string, unknown> = {},
  ): ClinicalAuditEvent {
    const ev: ClinicalAuditEvent = {
      id: `a_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      action,
      resource,
      metadata,
      at: new Date().toISOString(),
    };
    this.audit.unshift(ev);
    if (this.audit.length > 500) this.audit.length = 500;
    return ev;
  }
}
