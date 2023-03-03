import { BanStatusEnum } from '../dto/request/sa-query-params.dto';

export function filterUserSelecting(status: BanStatusEnum) {
  console.log(status === BanStatusEnum.notBanned);
  return status === BanStatusEnum.banned
    ? 'banInfo.isBanned is not null'
    : status === BanStatusEnum.notBanned
    ? 'banInfo.isBanned is  null'
    : '';
}
