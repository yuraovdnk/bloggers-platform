import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../users/domain/entity/user.entity';

@Entity({ name: 'AuthSession' })
export class AuthSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'uuid' })
  deviceId: string;

  @Column({ default: 'fsdfsds' })
  title: string;

  @Column({ type: 'timestamp with time zone' })
  issuedAt: Date;

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @Column()
  ip: string;

  @ManyToOne(() => User, (u) => u.id, { onDelete: 'CASCADE' })
  user: User;

  refreshAuthSession(deviceId: string, time: { iat: Date; exp: Date }) {
    this.deviceId = deviceId;
    this.issuedAt = time.iat;
    this.expiresAt = time.exp;
  }
}
