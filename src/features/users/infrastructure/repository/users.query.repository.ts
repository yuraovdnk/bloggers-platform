import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { SortFieldUserModel } from '../../typing/user.types';
import { SaQueryParamsDto } from '../../dto/request/sa-query-params.dto';
import { filterUserSelecting } from '../../helpers/filter.users';
import { PageDto } from '../../../../common/utils/PageDto';
import { UserViewModel } from '../../dto/response/user-view.model';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectRepository(User) private userEntity: Repository<User>) {
    console.log('UsersQueryRepository init');
  }

  async findById(userId: string) {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select(['user.email', 'user.login', 'user.id', 'user.createdAt', 'banInfo'])
      .leftJoin('user.banInfo', 'banInfo')
      .where('user.id = :userId', { userId })
      .getOne();
    return new UserViewModel(user);
  }

  async findAll(queryParams: SaQueryParamsDto) {
    const [users, totalCount] = await this.userEntity
      .createQueryBuilder('user')
      .select(['user.email', 'user.login', 'user.id', 'user.createdAt', 'banInfo'])
      .where(`${filterUserSelecting(queryParams.banStatus)}`)
      .andWhere(`user.login ~~* :loginTerm and user.email ~~* :emailTerm`, {
        loginTerm: `%${queryParams.searchLoginTerm}%`,
        emailTerm: `%${queryParams.searchEmailTerm}%`,
      })
      .leftJoin('user.banInfo', 'banInfo')
      .orderBy(`user.${queryParams.sortByField(SortFieldUserModel)}`, queryParams.order)
      .limit(queryParams.pageSize)
      .offset(queryParams.skip)
      .getManyAndCount();

    const mapped = users.map((i) => new UserViewModel(i));
    return new PageDto(mapped, queryParams, totalCount);
  }
  async getInfoByUserId(userId: string) {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select(['user.email as "email"', 'user.login as "login"', 'user.id as "userId"'])
      .where('user.id = :userId', { userId })
      .getRawOne();
    return user;
  }
}
