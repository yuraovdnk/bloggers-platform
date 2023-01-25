import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../domain/like.entity';

@Injectable()
export class LikesRepository {
  constructor(@InjectRepository(Like) private likeEntity: Repository<Like>) {}

  async create(parentId: string, userId: string, parentType: string): Promise<Like> {
    const like = new Like();
    like.parentId = parentId;
    like.userId = userId;
    like.parentType = parentType;
    await this.likeEntity.save(like);
    return like;
  }

  async save(entity: Like): Promise<void> {
    await this.likeEntity.save(entity);
  }

  async remove(entity: Like): Promise<void> {
    await this.likeEntity.remove(entity);
  }

  async findByParentAndUserId(userId: string, parentId: string): Promise<Like> {
    const like = await this.likeEntity
      .createQueryBuilder('l')
      .select('l')
      .where('l.parentId = :parentId', { parentId })
      .andWhere('l.userId = :userId', { userId })
      .getOne();
    return like;
  }
}
