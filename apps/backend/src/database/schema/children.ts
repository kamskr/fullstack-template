import {
  date,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const childGender = pgEnum('child_gender', [
  'female',
  'male',
  'non_binary',
  'unspecified',
]);

export const children = pgTable('children', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  gender: childGender('gender').notNull(),
  dateOfBirth: date('date_of_birth', { mode: 'string' }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 2048 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
