import { ApiProperty } from '@nestjs/swagger';

export class CreateTimestampModel {
  @ApiProperty({ example: 'Wrote first timestamp note' })
  note!: string;

  @ApiProperty({ format: 'date-time' })
  dateOccurredAt!: string;
}
