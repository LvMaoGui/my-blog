import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { ironOption } from 'config';
import type { ISession } from 'pages/api';
import { Cookie } from 'next-cookie';
import { clearCookie } from 'utils';

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = await getIronSession(req, res, ironOption);
  const cookies = Cookie.fromApiRoute(req, res);

  // 清除session
  await session.destroy();

  // 清除cookie
  clearCookie(cookies);
  res.status(200).json({
    code: '0',
    msg: '退出登录成功',
    data: {},
  });
}
