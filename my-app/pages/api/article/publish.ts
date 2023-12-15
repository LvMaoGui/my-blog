import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';

import { ironOption } from 'config';
import type { ISession } from 'pages/api';
import { AppDataSource } from 'db';
import { User, Article, Tag } from 'db/entity';

import { EXCEPTION_ARTICLE } from 'pages/api/config/codes';

export default async function publish(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = await getIronSession(req, res, ironOption);
  const { title = '', content = '', tagIds = [] } = req.body;

  // 连接数据库
  const db = await AppDataSource;
  const userRepo = await db.getRepository(User);
  const articleRepo = await db.getRepository(Article);
  const tagRepo = await db.getRepository(Tag);

  const user = await userRepo.findOne({
    where: {
      id: session.userId,
    },
  });

  const tags = await tagRepo.find({
    where: tagIds.map((tagId: number) => ({ id: tagId })),
  });

  const article = new Article();
  article.title = title;
  article.content = content;
  article.update_time = new Date();
  article.create_time = new Date();
  article.is_delete = 0;
  article.views = 0;

  if (user) {
    article.user = user;
  }

  if (tags) {
    const newTags = tags.map((tag) => {
      tag.article_count += 1;
      return tag;
    });
    article.tags = newTags;
  }

  const resArticle = await articleRepo.save(article);

  if (resArticle) {
    res.status(200).json({ code: '0', data: resArticle, msg: '发布文章成功' });
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.PUBLISH_FAILED });
  }
}
