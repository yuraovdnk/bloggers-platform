import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/domain/entities/user.entity';

@Entity({ name: 'AuthSession' })
export class AuthSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'uuid' })
  deviceId: string;

  @Column()
  title: string;

  @Column({ type: 'timestamp with time zone' })
  issuedAt: Date;

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @Column()
  ip: string;

  @ManyToOne(() => User, (u) => u.id, { onDelete: 'CASCADE' })
  user: User;
}
