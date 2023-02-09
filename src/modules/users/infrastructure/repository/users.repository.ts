import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserDbDto } from '../../typing/user.types';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private userEntity: Repository<User>) {
    console.log('UsersRepository');
  }

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
  async save(entity: User) {
    await this.userEntity.save(entity);
  }
}
