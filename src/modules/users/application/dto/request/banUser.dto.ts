import { IsBoolean, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class BanUserDto {
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean;
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  banReason: string;
}
