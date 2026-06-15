import { MemoryType } from '@prisma/client';

export interface StoreMemoryInput {
  type: MemoryType;
  content: string;
  domain?: string;
  subdomain?: string;
  confidence?: number;
  relevance?: number;
  topics?: string[];
  threadId?: string;
}

export interface RetrievedMemory {
  id: string;
  content: string;
  type: MemoryType;
  relevance: number;
  emotionalValence: number;
  topics: string[];
  daysAgo: number;
}
