import type { NextApiRequest, NextApiResponse } from 'next';

import { AppDataSource } from 'db';
import { User, Article, Comment } from 'db/entity';

import { EXCEPTION_COMMENT } from 'pages/api/config/codes';

export default async function publish(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content = '', articleId = 0, userId = 0 } = req.body;

  // 连接数据库
  const db = await AppDataSource;
  const userRepo = await db.getRepository(User);
  const articleRepo = await db.getRepository(Article);
  const commentRepo = await db.getRepository(Comment);

  const user = await userRepo.findOne({
    where: {
      id: userId,
    },
  });

  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
  });

  const comment = new Comment();
  comment.content = content;
  comment.update_time = new Date();
  comment.create_time = new Date();
  comment.is_delete = 0;

  if (user && article) {
    comment.user = user;
    comment.article = article;
  } else {
    res.status(200).json({ ...EXCEPTION_COMMENT.PUBLISH_ASSOCFAILED });
  }

  const resComment = await commentRepo.save(comment);
  console.log('user', user, article);

  if (resComment) {
    res.status(200).json({ code: '0', data: resComment, msg: '发表评论成功' });
  } else {
    res.status(200).json({ ...EXCEPTION_COMMENT.PUBLISH_FAILED });
  }
}
