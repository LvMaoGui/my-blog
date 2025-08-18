import { AppDataSource } from 'db';
import { User } from 'db/entity';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from '..';
import { getIronSession } from 'iron-session';

// 通用的会话解析方法（独立于 req 和 res）
export async function getSessionUserId(
  req: NextApiRequest, 
  res: NextApiResponse, 
  ironOption: any
): Promise<number> {
  const session: ISession = await getIronSession(req, res, ironOption);
  return session?.userId || 0;
}

// 通用的用户验证方法
export async function isUserAuthenticated(userId: number): Promise<boolean> {
  if (!userId) {
    return false;
  }

  const db = await AppDataSource;
  const userRepo = await db.getRepository(User);

  const user = await userRepo.findOne({
    where: {
      id: userId,
    },
  });

  return !!user; // 返回布尔值，表示是否存在用户
}