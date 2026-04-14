import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportType, ReportReason } from '@prisma/client';

export class CreateReportDto {
  @IsEnum(ReportType)
  targetType: ReportType;

  @IsString()
  targetId: string;

  @IsEnum(ReportReason)
  reason: ReportReason;

  @IsOptional()
  @IsString()
  details?: string;
}
