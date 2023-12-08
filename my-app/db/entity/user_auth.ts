import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import {User} from './user'

@Entity({ name: 'user_auths' })
export class UserAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!:number;

  @ManyToOne(()=> User,{
    cascade:true
  })

  @JoinColumn({name:'user_id'})
  user!: User
  @Column('text')
  identity_type!: string;

  @Column('text')
  identifier!: string

  @Column('text')
  credential!: string
}