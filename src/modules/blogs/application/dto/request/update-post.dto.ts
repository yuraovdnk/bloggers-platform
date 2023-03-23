import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsExistBlog } from '../../../../../common/validators/isExistBlog';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdatePostDto {
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

  @Validate(IsExistBlog, { message: 'Blog is not exist' })
  @IsUUID()
  @IsOptional()
  blogId: string;
}
