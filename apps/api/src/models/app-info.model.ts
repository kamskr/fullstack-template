import { ApiProperty } from '@nestjs/swagger';

export class AppInfoModel {
  @ApiProperty({ example: '@template/api' })
  name!: string;

  @ApiProperty({ example: '0.0.1' })
  version!: string;

  @ApiProperty({ example: 'ok' })
  status!: 'ok';

  @ApiProperty({ example: 'local' })
  appEnv!: string;

  @ApiProperty({ example: 'development' })
  nodeEnv!: string;

  @ApiProperty({ format: 'date-time' })
  timestamp!: string;
}
