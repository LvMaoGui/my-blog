import type { NextApiRequest, NextApiResponse } from 'next';

import { AppDataSource } from 'db';
import { Article } from 'db/entity';

import { EXCEPTION_ARTICLE } from 'pages/api/config/codes';

export default async function update(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title = '', content = '', articleId = '' } = req.body;

  // 连接数据库
  const db = await AppDataSource;
  const articleRepo = await db.getRepository(Article);

  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
    relations:['user']
  }) as Article;

  if(article){
    article.title = title;
    article.content = content;
    article.update_time = new Date();
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.NOT_FOUND });
  }

  const resArticle = await articleRepo.save(article);

  if (resArticle) {
    res.status(200).json({ code: '0', data: resArticle, msg: '更新文章成功' });
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.UPDATE_FAILES });
  }
}
