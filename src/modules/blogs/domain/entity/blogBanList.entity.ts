import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../users/domain/entity/user.entity';
import { Blog } from './blog.entity';

@Entity('Blogs_BanList')
export class BlogBanList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  blogId: string;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  banDate: Date;

  @Column({ type: 'varchar' })
  banReason: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.usersBanList)
  @JoinColumn()
  blog: User;
}
