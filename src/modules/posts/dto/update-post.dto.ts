import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDto {
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

  @IsNotEmpty()
  @IsUUID()
  blogId: string;
}
