import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';

import { ironOption } from 'config';
import type { ISession } from 'pages/api';
import { AppDataSource } from 'db';
import { User, UserAuth } from 'db/entity';
import { Cookie } from 'next-cookie';
import { setCookie } from 'utils';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  // 从请求体中拿到手机号和验证码
  const { phone, verify, identity_type } = req.body;
  const session: ISession = await getIronSession(req, res, ironOption);
  const cookies = Cookie.fromApiRoute(req,res)

  async function saveUserInfoToSession(userInfo: Record<string, any>) {
    for (const key in userInfo) {
      if (Object.prototype.hasOwnProperty.call(userInfo, key)) {
        session[key] = userInfo[key];
      }
    }

    // 保存数据到cookie
    setCookie(cookies, userInfo as any);

    await session.save();
  }

  const db = await AppDataSource;
  const userAuthsRepo = await db.getRepository(UserAuth);

  if (session.verifyCode === +verify) {
    // 验证码校验通过，在user_ouths表中查找identity_type是否有记录
    const userAuth = await userAuthsRepo.findOne({
      where: {
        identity_type,
        identifier: phone,
      },
      relations: ['user'],
    });

    console.log(userAuth);

    if (userAuth) {
      // 已存在用户
      const user = userAuth.user;
      const { id, nickname, avatar } = user;

      await saveUserInfoToSession({
        userId: id,
        nickname,
        avatar,
      });

      res.status(200).json({
        code: '0',
        msg: '登陆成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    } else {
      // 不存在，注册新用户
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`;
      user.avatar = './images/avatar.jpg';
      user.job = '收银员';
      user.introduce = '暂无';

      const userAuth = new UserAuth();
      userAuth.identity_type = 'phone';
      userAuth.identifier = phone;
      userAuth.credential = session.verifyCode;
      userAuth.user = user;

      // 在user_auth中设置过级联 会自动保存关联数据 此处无需再保存

      // const resUser = await usersRepo.save(user);

      const resUserAuth = await userAuthsRepo.save(userAuth);

      await saveUserInfoToSession({
        userId: resUserAuth.user.id,
        nickname: resUserAuth.user.nickname,
        avatar: resUserAuth.user.avatar,
      });

      res.status(200).json({
        code: '0',
        msg: '登陆成功',
        data: {
          userId: resUserAuth.user.id,
          nickname: resUserAuth.user.nickname,
          avatar: resUserAuth.user.avatar,
        },
      });
    }
  } else {
    // 验证码校验不通过
    res.status(200).json({
      code: '-1',
      msg: '验证码错误',
    });
  }
}
