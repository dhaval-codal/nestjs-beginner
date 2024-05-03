import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'USER' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  role: string;
  @Column()
  address: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
