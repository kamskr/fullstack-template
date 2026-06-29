import { ApiProperty } from '@nestjs/swagger';

export class TimestampModel {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Wrote first timestamp note' })
  note!: string;

  @ApiProperty({ format: 'date-time' })
  dateOccurredAt!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}
