import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { StatusLike } from '../../../common/types/commonEnums';
import { User } from '../../users/domain/entity/user.entity';

@Entity('Likes')
@Unique('uniqueLike', ['parentId', 'userId', 'parentType'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column('uuid')
  parentId: string;

  @Column({ type: 'varchar' })
  parentType: string;

  @Column({ type: 'enum', enum: StatusLike })
  likeStatus: StatusLike;

  @Column('uuid')
  userId: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  protected addedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  set changeStatusLike(status: StatusLike) {
    this.likeStatus = status;
    this.addedAt = new Date();
  }
}
