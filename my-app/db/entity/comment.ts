import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user'
import { Article } from './article'

@Entity({ name: 'comments' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!:number;

  @Column('text')
  content!: string;


  @Column('text')
  update_time!: Date

  @Column('text')
  create_time!: Date

  @Column('bit')
  is_delete!: number

  @ManyToOne(()=>User)
  @JoinColumn({name:'user_id'})
  user!:User

  @ManyToOne(()=>Article)
  @JoinColumn({name:'article_id'})
  article!:Article
}
