import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,OneToMany, ManyToMany } from 'typeorm';
import { Comment } from './comment';
import { User } from './user'
import { Tag } from './tag';


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

  // 新增字段：文章描述
  @Column({ type: 'text', nullable: false })  // description 可以为空
  description!: string;

  // 新增字段：封面图片 URL
  @Column({ type: 'varchar', length: 255, nullable: true })  // cover 可以为空
  cover!: string;

  // 新增字段：是否开启评论
  @Column({type:'bit'})// 默认为开启评论
  is_comment_enabled!: number

  @ManyToOne(()=>User,{
    cascade:true
  })
  @JoinColumn({name:'user_id'})
  user!:User

  @OneToMany(()=>Comment,(comment)=>comment.article)
  comments!:Comment[]

  @ManyToMany(()=>Tag,(tag)=>tag.articles,{
    cascade:true
  })
  tags!:Tag[]
}
