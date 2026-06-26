import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: 'ok';

  @ApiProperty({ example: '2026-06-16T19:30:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 12.345 })
  uptimeSeconds!: number;

  @ApiProperty({ example: 'local' })
  appEnv!: string;

  @ApiProperty({ example: 'development' })
  nodeEnv!: string;
}
