import { Injectable } from '@nestjs/common';
import { desc } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { children } from '../database/schema';
import { ChildModel } from '../models';

@Injectable()
export class ChildrenService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<ChildModel[]> {
    const rows = await this.databaseService.db
      .select()
      .from(children)
      .orderBy(desc(children.createdAt));

    return rows.map((child) => ({
      id: child.id,
      firstName: child.firstName,
      middleName: child.middleName,
      lastName: child.lastName,
      gender: child.gender,
      dateOfBirth: child.dateOfBirth,
      avatarUrl: child.avatarUrl,
      createdAt: child.createdAt.toISOString(),
      updatedAt: child.updatedAt.toISOString(),
    }));
  }
}
