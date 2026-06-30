import { z } from 'zod';

export const timestampNoteSchema = z.string().trim().min(1, 'Note is required');

export const createTimestampFormSchema = z.object({
  note: timestampNoteSchema,
});

export const updateTimestampFormSchema = createTimestampFormSchema;

export type TimestampFormValues = z.infer<typeof createTimestampFormSchema>;
