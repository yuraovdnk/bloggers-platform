import { QueryParamsDto } from './query-params.dto';
import { IsEnum } from 'class-validator';

export enum BanStatusEnum {
  all = 'all',
  notBanned = 'notBanned',
  banned = 'banned',
}
export class SaQueryParamsDto extends QueryParamsDto {
  readonly searchLoginTerm = '';
  readonly searchEmailTerm = '';

  @IsEnum(BanStatusEnum, { each: true })
  banStatus: BanStatusEnum = BanStatusEnum.all;
}
