import { Column, Entity } from 'typeorm';

@Entity('Profile')
export class Profile {
  @Column({ type: 'varchar', nullable: true })
  passwordRecoveryCode: string;

  @Column({ type: 'timestamp', default: null, nullable: true })
  expirationPasswordRecoveryCode: Date;

  @Column({ type: 'varchar', nullable: true })
  confirmCode: string;

  @Column({ type: 'timestamp', nullable: true })
  expirationConfirmCode: Date;

  @Column({ type: 'boolean' })
  isConfirmedEmail: boolean;
}
