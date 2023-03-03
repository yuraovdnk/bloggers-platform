import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../../common/utils/base.entity';
import { User } from '../../users/domain/entities/user.entity';

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

  @ManyToOne(() => User, (u) => u.id, { onDelete: 'CASCADE' })
  user: User;
}
