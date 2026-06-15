import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateThreadDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;
}
