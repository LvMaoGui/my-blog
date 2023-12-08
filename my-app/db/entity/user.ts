import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!:number;

  @Column('text')
  nickname!: string;

  @Column('text')
  job!: string;

  @Column('text')
  avatar!: string

  @Column('text')
  introduce!: string
}
