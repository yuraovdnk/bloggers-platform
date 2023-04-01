import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Blog } from './blog.entity';

@Entity('Blogs_BanList')
export class BlogBanList {
  constructor(blogId: string, banStatus: boolean) {
    this.blogId = blogId;
    this.isBanned = banStatus;
  }
  @PrimaryColumn()
  blogId: string;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  banDate: Date;

  @OneToOne(() => Blog, (b) => b.banInfo, { onDelete: 'CASCADE' })
  @JoinColumn()
  blog: Blog;
}
