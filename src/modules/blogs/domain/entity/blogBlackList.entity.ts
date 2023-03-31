import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../users/domain/entity/user.entity';
import { Blog } from './blog.entity';
import { BanUserForBlogDto } from '../../../users/application/dto/request/banUserForBlog.dto';

@Entity('Blogs_BlackList')
export class BlogBlackList {
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

  @ManyToOne(() => Blog, (blog) => blog.usersBlackList)
  @JoinColumn()
  blog: User;

  static create(userId: string, banUserForBlogDto: BanUserForBlogDto) {
    const bannedUser = new BlogBlackList();
    bannedUser.blogId = banUserForBlogDto.blogId;
    bannedUser.isBanned = banUserForBlogDto.isBanned;
    bannedUser.banReason = banUserForBlogDto.banReason;
    bannedUser.userId = userId;
    return bannedUser;
  }
}
