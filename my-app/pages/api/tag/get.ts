import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';

import { AppDataSource } from 'db';
import { ironOption } from 'config';
import type { ISession } from 'pages/api';
import { Tag } from 'db/entity';

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = await getIronSession(req, res, ironOption);

  const { userId = 0 } = session || {};
  const db = await AppDataSource;

  const tagRepo = await db.getRepository(Tag);

  const followTags = await tagRepo.find({
    where: {
      users: {
        id: Number(userId),
      },
    },
    relations: ['users'],
  });

  const allTags = await tagRepo.find({
    relations: ['users'],
  });

  res.status(200).json({
    code: '0',
    msg: '',
    data: {
      followTags,
      allTags,
    },
  });
}
