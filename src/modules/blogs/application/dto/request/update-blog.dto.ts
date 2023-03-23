import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateBlogDto {
  @MinLength(1)
  @MaxLength(500)
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @IsNotEmpty()
  description: string;

  @MinLength(1)
  @MaxLength(15)
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @IsNotEmpty()
  name: string;

  @MinLength(1)
  @MaxLength(100)
  @Matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
  @IsNotEmpty()
  websiteUrl: string;
}
