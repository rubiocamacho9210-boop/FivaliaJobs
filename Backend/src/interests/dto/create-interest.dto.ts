import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInterestDto {
  @IsString()
  @IsNotEmpty()
  postId: string;
}
