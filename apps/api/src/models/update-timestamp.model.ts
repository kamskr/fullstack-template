import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTimestampModel {
  @ApiPropertyOptional({ example: 'Updated timestamp note' })
  note?: string;

  @ApiPropertyOptional({ format: 'date-time' })
  dateOccurredAt?: string;
}
