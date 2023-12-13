import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user'
import { Article } from './article';


@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!:number;

  @Column('text')
  title!: string;

  @Column('text')
  icon!: string;

  @Column('int')
  follow_count!: number

  @Column('int')
  article_count!: number

  @ManyToMany(()=>User,{
    cascade:true
  })
  @JoinTable({
    name:'tags_user',
    joinColumn:{
      name:'tag_id'
    },
    inverseJoinColumn:{
      name:'user_id'
    }
  })
  users!: User[]

  @ManyToMany(()=>Article,(article)=>article.tags)
  @JoinTable({
    name:'tags_article',
    joinColumn:{
      name:'tag_id'
    },
    inverseJoinColumn:{
      name:'article_id'
    }
  })
  articles!: Article[]

}
