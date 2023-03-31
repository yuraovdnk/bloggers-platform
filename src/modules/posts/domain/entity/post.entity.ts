import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '../../../../common/utils/base.entity';
import { Blog } from '../../../blogs/domain/entity/blog.entity';
import { Comment } from '../../../comments/domain/entity/comment.entity';

@Entity('Posts')
export class Post extends CommonEntity {
  @Column({ type: 'varchar', length: 30 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  shortDescription: string;

  @Column({ type: 'varchar', length: 1000 })
  content: string;

  @Column({ type: 'uuid' })
  blogId: string;

  @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
  blog: Blog;

  @OneToMany(() => Comment, (c) => c.post)
  comments: Comment[];
}
