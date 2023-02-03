import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class CreateBlogDto {
  @MinLength(1)
  @MaxLength(500)
  @IsString()
  //@NotContains(' ')
  @IsNotEmpty()
  description: string;

  @MinLength(1)
  @MaxLength(15)
  @IsString()
  //@NotContains(' ')
  @IsNotEmpty()
  name: string;

  @MinLength(1)
  @MaxLength(100)
  @Matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
  @IsNotEmpty()
  websiteUrl: string;
}
