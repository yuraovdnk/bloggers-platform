import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from '../../../../common/utils/base.entity';
import { User } from '../../../users/domain/entity/user.entity';
import { BlogBlackList } from './blogBlackList.entity';
import { Post } from '../../../posts/domain/entity/post.entity';
import { BlogBanList } from './blogBanList';
import { BlogInputDbType } from '../../application/types/blogs.types';
import { BanUserForBlogDto } from '../../../users/application/dto/request/banUserForBlog.dto';

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

  @ManyToOne(() => User, (u) => u.id)
  user: User;

  @OneToMany(() => BlogBlackList, (b) => b.blog)
  usersBlackList: BlogBlackList[];

  @OneToMany(() => Post, (p) => p.blog)
  posts: Post[];

  @OneToOne(() => BlogBanList, (b) => b.blog, { cascade: ['insert', 'update'], eager: true })
  banInfo: BlogBanList;

  static create(newBlog: BlogInputDbType) {
    const blog = new Blog();
    blog.name = newBlog.name;
    blog.description = newBlog.description;
    blog.websiteUrl = newBlog.websiteUrl;
    blog.userId = newBlog.userId;
    return blog;
  }
  ban() {
    this.banInfo = new BlogBanList(this.id, true);
  }
}
