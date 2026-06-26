import { ApiProperty } from '@nestjs/swagger';

export const ChildGender = {
  Female: 'female',
  Male: 'male',
  NonBinary: 'non_binary',
  Unspecified: 'unspecified',
} as const;

export type ChildGender = (typeof ChildGender)[keyof typeof ChildGender];

export class ChildModel {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Mila' })
  firstName!: string;

  @ApiProperty({ example: 'Rose', nullable: true })
  middleName!: string | null;

  @ApiProperty({ example: 'Sikora' })
  lastName!: string;

  @ApiProperty({ enum: ChildGender, example: ChildGender.Female })
  gender!: ChildGender;

  @ApiProperty({ format: 'date', example: '2025-06-16' })
  dateOfBirth!: string;

  @ApiProperty({ format: 'uri', nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}
