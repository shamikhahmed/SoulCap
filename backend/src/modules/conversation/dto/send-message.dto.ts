import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(4000)
  message: string;

  @IsOptional()
  @IsUUID()
  threadId?: string;
}
