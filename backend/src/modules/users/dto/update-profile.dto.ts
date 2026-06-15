import { IsOptional, IsString, IsTimeZone, MaxLength, IsBoolean, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(100) firstName?: string;
  @IsOptional() @IsString() @MaxLength(100) lastName?: string;
  @IsOptional() @IsString() @MaxLength(100) displayName?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsTimeZone() timezone?: string;
  @IsOptional() @IsString() locale?: string;
  @IsOptional() @IsString() @MaxLength(500) bio?: string;
}

export class UpdateExtendedProfileDto {
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() pronouns?: string;
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() @MaxLength(500) bio?: string;
  @IsOptional() @IsBoolean() hasTherapist?: boolean;
  @IsOptional() @IsBoolean() hasMedication?: boolean;
  @IsOptional() @IsBoolean() hasDiagnosis?: boolean;
  @IsOptional() @IsString() referralSource?: string;
}

export class CompleteOnboardingDto {
  @IsOptional() @IsBoolean() consentLmmProfiling?: boolean;
  @IsOptional() @IsBoolean() consentDataRetention?: boolean;
  @IsOptional() @IsBoolean() consentResearch?: boolean;
}
