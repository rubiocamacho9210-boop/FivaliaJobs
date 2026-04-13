import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { PostType } from '@prisma/client';

export class CreatePostDto {
  @IsEnum(PostType)
  type: PostType;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  category: string;
}
