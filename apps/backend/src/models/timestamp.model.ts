import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TimestampModel {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'First nap started' })
  note!: string;

  @ApiProperty({ format: 'date-time', example: '2026-06-17T10:30:00.000Z' })
  dateOccurredAt!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;

  @ApiPropertyOptional({ type: 'string', format: 'date-time', nullable: true })
  deletedAt!: string | null;
}

export class CreateTimestampModel {
  @ApiProperty({ example: 'First nap started' })
  note!: string;

  @ApiProperty({ format: 'date-time', example: '2026-06-17T10:30:00.000Z' })
  dateOccurredAt!: string;
}

export class UpdateTimestampModel {
  @ApiPropertyOptional({ example: 'First nap ended' })
  note?: string;

  @ApiPropertyOptional({
    format: 'date-time',
    example: '2026-06-17T11:15:00.000Z',
  })
  dateOccurredAt?: string;
}
