import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
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

  async findAll(userId: string): Promise<TimestampModel[]> {
    const rows = await this.databaseService.db
      .select()
      .from(timestamps)
      .where(eq(timestamps.userId, userId))
      .orderBy(desc(timestamps.dateOccurredAt), desc(timestamps.createdAt));

    return rows.map(mapTimestampRow);
  }

  async create(
    userId: string,
    input: CreateTimestampModel,
  ): Promise<TimestampModel> {
    const note = parseNote(input.note);
    const dateOccurredAt = parseDate(input.dateOccurredAt, 'dateOccurredAt');

    const [row] = await this.databaseService.db
      .insert(timestamps)
      .values({
        userId,
        note,
        dateOccurredAt,
      })
      .returning();

    return mapTimestampRow(row);
  }

  async findOne(userId: string, id: string): Promise<TimestampModel> {
    const row = await this.findOwnedRow(userId, id);

    return mapTimestampRow(row);
  }

  async update(
    userId: string,
    id: string,
    input: UpdateTimestampModel,
  ): Promise<TimestampModel> {
    const values: Partial<typeof timestamps.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (input.note !== undefined) {
      values.note = parseNote(input.note);
    }
    if (input.dateOccurredAt !== undefined) {
      values.dateOccurredAt = parseDate(input.dateOccurredAt, 'dateOccurredAt');
    }

    const [row] = await this.databaseService.db
      .update(timestamps)
      .set(values)
      .where(and(eq(timestamps.id, id), eq(timestamps.userId, userId)))
      .returning();

    if (!row) {
      throw new NotFoundException('Timestamp not found');
    }

    return mapTimestampRow(row);
  }

  async remove(userId: string, id: string): Promise<void> {
    const [row] = await this.databaseService.db
      .delete(timestamps)
      .where(and(eq(timestamps.id, id), eq(timestamps.userId, userId)))
      .returning({ id: timestamps.id });

    if (!row) {
      throw new NotFoundException('Timestamp not found');
    }
  }

  private async findOwnedRow(
    userId: string,
    id: string,
  ): Promise<TimestampRow> {
    const [row] = await this.databaseService.db
      .select()
      .from(timestamps)
      .where(and(eq(timestamps.id, id), eq(timestamps.userId, userId)))
      .limit(1);

    if (!row) {
      throw new NotFoundException('Timestamp not found');
    }

    return row;
  }
}

function parseNote(note: unknown): string {
  if (typeof note !== 'string') {
    throw new BadRequestException('note must be a string');
  }

  const trimmedNote = note.trim();
  if (!trimmedNote) {
    throw new BadRequestException('note cannot be empty');
  }

  return trimmedNote;
}

function parseDate(value: unknown, fieldName: string): Date {
  if (typeof value !== 'string') {
    throw new BadRequestException(`${fieldName} must be an ISO date string`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(
      `${fieldName} must be a valid ISO date string`,
    );
  }

  return date;
}

function mapTimestampRow(row: TimestampRow): TimestampModel {
  return {
    id: row.id,
    note: row.note,
    dateOccurredAt: row.dateOccurredAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
