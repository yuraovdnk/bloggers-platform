import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { PageDto } from '../../../../common/utils/PageDto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectRepository(User) private userEntity: Repository<User>) {}
  async findById(userId: string) {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select(['user.email', 'user.login', 'user.id', 'user.createdAt'])
      .where('user.id = :userId', { userId })
      .getOne();
    return user;
  }
  async findAll(queryParams: QueryParamsDto): Promise<PageDto<User>> {
    const users = await this.userEntity
      .createQueryBuilder('user')
      .select(['user.email', 'user.login', 'user.id', 'user.createdAt'])
      .where('user.login like :loginTerm and user.email like :emailTerm', {
        loginTerm: `%${queryParams.searchLoginTerm}%`,
        emailTerm: `%${queryParams.searchEmailTerm}%`,
      })
      .limit(queryParams.pageSize)
      .offset(queryParams.skip)
      .getMany();

    return new PageDto(users, queryParams);
  }
}
