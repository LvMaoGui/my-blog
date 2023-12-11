import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,OneToMany } from 'typeorm';
import { Comment } from './comment';
import { User } from './user'


@Entity({ name: 'articles' })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!:number;

  @Column('text')
  title!: string;

  @Column('text')
  content!: string;

  @Column('int')
  views!: number

  @Column('text')
  update_time!: Date

  @Column('text')
  create_time!: Date

  @Column('bit')
  is_delete!: number

  @ManyToOne(()=>User,{
    cascade:true
  })
  @JoinColumn({name:'user_id'})
  user!:User

  @OneToMany(()=>Comment,(comment)=>comment.article)
  comments!:Comment[]
}
