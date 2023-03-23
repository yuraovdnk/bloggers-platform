import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '../../../../common/utils/base.entity';
import { User } from '../../../users/domain/entity/user.entity';
import { BlogBanList } from './blogBanList.entity';
import { Post } from '../../../posts/domain/entity/post.entity';

@Entity('Blogs')
export class Blog extends CommonEntity {
  @Column({ length: 15, collation: 'C' })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ length: 100 })
  websiteUrl: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @ManyToOne(() => User, (u) => u.id, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => BlogBanList, (b) => b.blog, { onDelete: 'CASCADE' })
  usersBanList: BlogBanList[];

  @OneToMany(() => Post, (p) => p.blog)
  posts: Post[];
}
