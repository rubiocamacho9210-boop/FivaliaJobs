import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ReviewType } from '@prisma/client';

export class CreateReviewDto {
  @IsString()
  postId: string;

  @IsString()
  toUserId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsEnum(ReviewType)
  type: ReviewType;
}
