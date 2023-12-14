import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';

import { ironOption } from 'config';
import { AppDataSource } from 'db';
import type { ISession } from 'pages/api';
import { User } from 'db/entity';
import { EXCEPTION_USER } from '../config/codes';

export default async function update(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = await getIronSession(req, res, ironOption);
  const { userInfo } = req.body;
  const { nickname, job, introduce } = userInfo;
  const { userId } = session;

  const db = await AppDataSource;
  const userRepo = await db.getRepository(User);
  const user = await userRepo.findOne({
    where: {
      id: Number(userId),
    },
  });

  if (user) {
    user.nickname = nickname;
    user.job = job;
    user.introduce = introduce;
    const resUserInfo = await userRepo.save(user);
    res.status(200).json({
      code: '0',
      msg: '',
      data: { userInfo: resUserInfo },
    });
  } else {
    res.status(200).json({ ...EXCEPTION_USER.NOT_FOUNT });
  }
}
