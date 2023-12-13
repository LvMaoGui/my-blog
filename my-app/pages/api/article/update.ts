import type { NextApiRequest, NextApiResponse } from 'next';

import { AppDataSource } from 'db';
import { Article, Tag } from 'db/entity';

import { EXCEPTION_ARTICLE } from 'pages/api/config/codes';

export default async function update(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title = '', content = '', articleId = '', tagIds=[] } = req.body;
  console.log('tagIds😀',tagIds);
  
  // 连接数据库
  const db = await AppDataSource;
  const articleRepo = await db.getRepository(Article);
  const tagRepo = await db.getRepository(Tag)

  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
    relations:['user','tags']
  }) as Article;

  const tags = await tagRepo.find({
    where: tagIds.map((tagId: number) => ({ id: tagId })),
  });

  if(article){
    article.title = title;
    article.content = content;
    article.update_time = new Date();
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.NOT_FOUND });
  }

  if (tags) {
    console.log('tags😀',tags);
    
    const articleRelTags = article.tags

    const newTags = tags.map((tag) => {
      // 原本未关联的
      if(articleRelTags.findIndex((relTag)=>relTag.id === tag.id) === -1 || articleRelTags.length === 0){
        tag.article_count += 1;
      } 

      return tag;
    });
    article.tags = newTags;

    // 原本关联的标签 更新后取消关联了
    articleRelTags.forEach(async (tag)=>{
      if(newTags.findIndex((newTag)=>newTag.id === tag.id) === -1){
        tag.article_count -= 1;
        await tagRepo.save(tag)
      }
    })
  }

  // 用户未关联任何标签
  if(tagIds.length === 0){
    const articleRelTags = article.tags
    articleRelTags.forEach(async (tag)=>{
      tag.article_count -= 1;
      await tagRepo.save(tag)
    })

    article.tags = [];
  }

  const resArticle = await articleRepo.save(article);

  if (resArticle) {
    res.status(200).json({ code: '0', data: resArticle, msg: '更新文章成功' });
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.UPDATE_FAILES });
  }
}
