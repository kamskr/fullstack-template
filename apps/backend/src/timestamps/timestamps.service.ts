import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, gte, isNull } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { timestamps } from '../database/schema';
import {
  CreateTimestampModel,
  TimestampModel,
  UpdateTimestampModel,
} from '../models';

type TimestampRow = typeof timestamps.$inferSelect;

@Injectable()
export class TimestampsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: CreateTimestampModel): Promise<TimestampModel> {
    const row = await this.databaseService.db
      .insert(timestamps)
      .values({
        note: this.parseNote(input.note),
        dateOccurredAt: this.parseDateTime(input.dateOccurredAt),
      })
      .returning()
      .then(([created]) => created);

    return this.toModel(row);
  }

  async findAll(updatedAfter?: string): Promise<TimestampModel[]> {
    const since = updatedAfter ? this.parseUpdatedAfter(updatedAfter) : undefined;

    const rows = await this.databaseService.db
      .select()
      .from(timestamps)
      .where(since ? gte(timestamps.updatedAt, since) : undefined)
      .orderBy(desc(timestamps.dateOccurredAt), desc(timestamps.createdAt));

    return rows.map((row) => this.toModel(row));
  }

  async findOne(id: string): Promise<TimestampModel> {
    const row = await this.findRow(id);

    return this.toModel(row);
  }

  async update(
    id: string,
    input: UpdateTimestampModel,
  ): Promise<TimestampModel> {
    const changes: Partial<typeof timestamps.$inferInsert> = {};

    if (input.note !== undefined) {
      changes.note = this.parseNote(input.note);
    }

    if (input.dateOccurredAt !== undefined) {
      changes.dateOccurredAt = this.parseDateTime(input.dateOccurredAt);
    }

    if (Object.keys(changes).length === 0) {
      throw new BadRequestException(
        'At least one timestamp field is required.',
      );
    }

    const row = await this.databaseService.db
      .update(timestamps)
      .set(changes)
      .where(eq(timestamps.id, id))
      .returning()
      .then(([updated]) => updated);

    if (!row) {
      throw new NotFoundException('Timestamp not found.');
    }

    return this.toModel(row);
  }

  async remove(id: string): Promise<void> {
    const now = new Date();
    const row = await this.databaseService.db
      .update(timestamps)
      .set({ deletedAt: now, updatedAt: now })
      .where(and(eq(timestamps.id, id), isNull(timestamps.deletedAt)))
      .returning({ id: timestamps.id })
      .then(([updated]) => updated);

    if (!row) {
      throw new NotFoundException('Timestamp not found.');
    }
  }

  async removeAll(): Promise<void> {
    const now = new Date();
    await this.databaseService.db
      .update(timestamps)
      .set({ deletedAt: now, updatedAt: now })
      .where(isNull(timestamps.deletedAt));
  }

  private async findRow(id: string): Promise<TimestampRow> {
    const row = await this.databaseService.db.query.timestamps.findFirst({
      where: and(eq(timestamps.id, id), isNull(timestamps.deletedAt)),
    });

    if (!row) {
      throw new NotFoundException('Timestamp not found.');
    }

    return row;
  }

  private parseUpdatedAfter(value: string): Date {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(
        'updatedAfter must be an ISO date-time string.',
      );
    }

    return parsed;
  }

  private parseNote(note: unknown): string {
    if (typeof note !== 'string' || note.trim().length === 0) {
      throw new BadRequestException('note must be a non-empty string.');
    }

    return note.trim();
  }

  private parseDateTime(dateTime: unknown): Date {
    if (typeof dateTime !== 'string') {
      throw new BadRequestException(
        'dateOccurredAt must be an ISO date-time string.',
      );
    }

    const parsed = new Date(dateTime);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(
        'dateOccurredAt must be an ISO date-time string.',
      );
    }

    return parsed;
  }

  private toModel(row: TimestampRow): TimestampModel {
    return {
      id: row.id,
      note: row.note,
      dateOccurredAt: row.dateOccurredAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      deletedAt: row.deletedAt ? row.deletedAt.toISOString() : null,
    };
  }
}
