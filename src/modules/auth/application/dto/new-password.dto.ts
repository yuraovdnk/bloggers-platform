import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class NewPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Transform(({ value }) => value?.trim())
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  recoveryCode: string;
}
