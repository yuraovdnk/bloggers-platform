import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('BanList')
export class BanList {
  @PrimaryColumn()
  userId: string;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @Column({ type: 'varchar' })
  banReason: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  banDate: Date;

  @OneToOne(() => User, (user) => user.banInfo)
  @JoinColumn()
  user: User;
}
