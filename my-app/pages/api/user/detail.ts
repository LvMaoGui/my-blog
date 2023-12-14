import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';

import { ironOption } from 'config';
import { AppDataSource } from 'db';
import type { ISession } from 'pages/api';
import { User } from 'db/entity';
import { EXCEPTION_USER } from '../config/codes';

export default async function detail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = await getIronSession(req, res, ironOption);
  const { userId } = session;

  const db = await AppDataSource;
  const userRepo = await db.getRepository(User);
  const user = await userRepo.findOne({
    where: {
      id: Number(userId),
    },
  });

  if (user) {
    res.status(200).json({
      code: '0',
      msg: '',
      data: { userInfo: user },
    });
  } else {
    res.status(200).json({ ...EXCEPTION_USER.NOT_FOUNT });
  }
}
