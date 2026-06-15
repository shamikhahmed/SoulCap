import { IsNumber, IsArray, IsString, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitCheckInDto {
  @ApiProperty({ description: 'Emotional valence', minimum: -1, maximum: 1 })
  @IsNumber()
  @Min(-1)
  @Max(1)
  valence: number;

  @ApiProperty({ description: 'Arousal level (calm to activated)', minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  arousal: number;

  @ApiProperty({ description: 'Groundedness (dissociated to present)', minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  groundedness: number;

  @ApiPropertyOptional({ type: [String], description: 'Emotion labels selected by user' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emotions?: string[];

  @ApiPropertyOptional({ description: 'Where the user feels this in their body' })
  @IsOptional()
  @IsString()
  bodyAwareness?: string;

  @ApiPropertyOptional({ description: 'Energy level 0–1', minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  energyLevel?: number;

  @ApiPropertyOptional({ description: 'Free-text reflection' })
  @IsOptional()
  @IsString()
  freeText?: string;
}
