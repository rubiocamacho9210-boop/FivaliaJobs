import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PostStatus, PostType } from '@prisma/client';

export class UpdatePostStatusDto {
  @IsEnum(PostStatus)
  status: PostStatus;
}

export class UpdatePostDto {
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}
