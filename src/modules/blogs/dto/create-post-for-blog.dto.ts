import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostForBlogDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  content: string;
}
