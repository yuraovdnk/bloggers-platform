import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  readonly createdAt: Date;
}
