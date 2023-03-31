import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entity/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserDbDto } from '../../application/types/user.types';
import { UsersBanList } from '../../domain/entity/userBanList.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(UsersBanList) private banListEntity: Repository<UsersBanList>,
  ) {}

  async create(newUser: UserDbDto): Promise<User> {
    const user = new User();
    user.login = newUser.login;
    user.email = newUser.email;
    user.passwordHash = newUser.passwordHash;
    user.confirmCode = newUser.confirmationCode;
    user.expirationConfirmCode = newUser.expirationConfirmCode;
    user.isConfirmedEmail = newUser.isConfirmedEmail;

    await this.userEntity.save(user);
    return user;
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select('user')
      .leftJoinAndSelect('user.banInfo', 'banInfo')
      .where('user.email = :email', { email: loginOrEmail })
      .orWhere('user.login = :login', { login: loginOrEmail })
      .getOne();
    return user;
  }

  async remove(entity: User) {
    await this.userEntity.remove(entity);
  }
  async findById(userId: string): Promise<User> {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select('user')
      .where('user.id = :userId', { userId })
      .getOne();
    return user;
  }
  async findByLogin(login: string): Promise<User> {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select('user')
      .where('user.login = :login', { login })
      .getOne();
    return user;
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select('user')
      .where('user.email = :email', { email })
      .getOne();
    return user;
  }
  async findByConfirmCode(confirmCode: string): Promise<User> {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select('user')
      .where('user.confirmCode = :confirmCode', { confirmCode })
      .getOne();
    return user;
  }
  async findByRecoveryCode(code: string) {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .select('user')
      .where('user.passwordRecoveryCode = :code', { code })
      .getOne();
    return user;
  }

  async banUser(userId: string, banReason: string, isBanned: boolean) {
    const banUser = new UsersBanList();
    banUser.userId = userId;
    banUser.banReason = banReason;
    banUser.isBanned = isBanned;
    await this.banListEntity.save(banUser);
  }
  async unBanUser(userId: string) {
    const banUser = await this.banListEntity
      .createQueryBuilder('banList')
      .delete()
      .from(UsersBanList)
      .where('userId = :userId', { userId })
      .execute();
    return banUser;
  }

  async save(entity: User) {
    await this.userEntity.save(entity);
  }
}
