import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../../../common/utils/base.entity';
import { User } from '../../../users/domain/entity/user.entity';
import { Post } from '../../../posts/domain/entity/post.entity';

@Entity('Comments')
export class Comment extends CommonEntity {
  @Column('uuid')
  userId: string;

  @Column('uuid')
  postId: string;

  @Column({ type: 'varchar', length: 300 })
  content: string;

  @ManyToOne(() => User, (u) => u.id, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (p) => p.id, { onDelete: 'CASCADE' })
  post: Post;

  //TODO can create static method "create entity" or constructor
}
