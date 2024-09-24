import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';

import { AppDataSource } from 'db';
import { ironOption } from 'config';
import type { ISession } from 'pages/api';
import { Tag, User } from 'db/entity';
import { EXCEPTION_USER, EXCEPTION_TAG } from '../config/codes';

export default async function follow(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = await getIronSession(req, res, ironOption);

  const { tagId, type } = req.body;

  const { userId = 0 } = session || {};
  const db = await AppDataSource;

  const tagRepo = await db.getRepository(Tag);
  const userRepo = await db.getRepository(User);

  const user = await userRepo.findOne({
    where: {
      id: userId,
    },
  });

  const tag = await tagRepo.findOne({
    relations: ['users'],
    where: {
      id: tagId,
    },
  });

  if (!user) {
    res.status(200).json({ ...EXCEPTION_USER.NOT_LOGIN });
  }

  if (user && tag?.users) {
    if (type === 'follow') {
      tag.users = tag?.users?.concat([user]);
      tag.follow_count += 1;
    } else if (type === 'unfollow') {
      tag.users = tag?.users.filter((user) => user.id !== userId);
      tag.follow_count -= 1;
    }
  }

  if (tag) {
    const resTag = await tagRepo.save(tag);
    res.status(200).json({
      code: '0',
      msg: '',
      data: resTag,
    });
  } else {
    const errorObj =
      type === 'follow'
        ? { ...EXCEPTION_TAG.FOLLOW_FAILED }
        : { ...EXCEPTION_TAG.UNFOLLOW_FAILED };
    res.status(200).json(errorObj);
  }
}
