import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('Profile')
export class Profile {
  @PrimaryColumn()
  userId: string;

  @Column({ type: 'varchar', nullable: true })
  confirmCode: string;

  @Column({ type: 'timestamp', nullable: true })
  expirationConfirmCode: Date;

  @Column({ type: 'boolean' })
  isConfirmedEmail: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true })
  passwordRecoveryCode: string;

  @Column({ type: 'timestamp', default: null, nullable: true })
  expirationPasswordRecoveryCode: Date;

  // @OneToOne(() => User, (u) => u.profile)
  // @JoinColumn()
  // user: User;
}
