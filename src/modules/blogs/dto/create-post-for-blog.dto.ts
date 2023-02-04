import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreatePostForBlogDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  @Transform(({ value }: TransformFnParams) => value.trim())
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @Transform(({ value }: TransformFnParams) => value.trim())
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }: TransformFnParams) => value.trim())
  content: string;
}
