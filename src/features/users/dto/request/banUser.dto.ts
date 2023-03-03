import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class BanUserDto {
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean;
  @IsString()
  @IsNotEmpty()
  banReason: string;
}
