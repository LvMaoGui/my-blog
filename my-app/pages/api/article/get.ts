import { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from 'db';
import { Article } from 'db/entity/index';

export default async function publish(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tagIds = [] } = req?.body || {};
  const db = await AppDataSource;
  const articleRepo = await db.getRepository(Article);
  let articles = [];

  if (tagIds.length > 0) {
    articles = await articleRepo.find({
      relations: ['user', 'tags'],
      where: {
        tags: tagIds?.map((tagId: string) => ({ id: tagId })),
      },
    });
    //  tagIds?.map((tagId: string) => ({ id: tagId }))
  } else {
    articles = await articleRepo.find({
      relations: ['user', 'tags'],
    });
  }

  res?.status(200).json({
    code: '0',
    msg: '',
    data: articles || [],
  });
}
