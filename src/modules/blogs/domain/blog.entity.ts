import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../../../common/utils/base.entity';

@Entity('Blogs')
export class Blog extends CommonEntity {
  @Column({ length: 15 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ length: 100 })
  websiteUrl: string;
}
