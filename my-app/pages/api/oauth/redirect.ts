import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';

import { AppDataSource } from 'db';
import { ironOption } from 'config';
import type { ISession } from 'pages/api';
import { User, UserAuth } from 'db/entity';
import { Cookie } from 'next-cookie';
import request from 'service/fetch';

import { saveUserInfoToSessionAndCookie } from 'utils';

export default async function redirect(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = await getIronSession(req, res, ironOption);

  // http://localhost:3000/api/oauth/redirect

  const { code } = req.query;
  console.log('code😀',code);

  const githubClientId = '6fe217ae3fd9dea74c95';
  const githubClientSecret = 'c3ccc448d10eb60221771eb83f52d8e4739149de';

  // 获取令牌的url
  const getAssessTokenUrl = `https://github.com/login/oauth/access_token?client_id=${githubClientId}&client_secret=${githubClientSecret}&code=${code}`;

  // 发送请求获取access_token
  const result = await request.post(
    getAssessTokenUrl,
    {},
    { headers: { Accept: 'application/json' } }
  );

  console.log('result😀',result);

  const { access_token } = result as any;

  // 根据access_token获取用户信息
  console.log('access_token😀',access_token);


  // 获取用户信息的url
  const getUserInfoUrl = `https://api.github.com/user`

  // 发送请求获取githun用户信息
  const githubUserInfo = await request.get(getUserInfoUrl,{
    headers:{
      accept:'application/json',
      Authorization:`token ${access_token}`
    }
  })

  console.log('githubUserInfo',githubUserInfo);

  const cookies = Cookie.fromApiRoute(req, res);
  const db = await AppDataSource;
  const userAuth = await db.getRepository(UserAuth).findOne({
    where:{
      identity_type:'github',
      identifier: githubClientId
    },
    relations: ['user']
  })

  if(userAuth){
    // 之前登录过的用户，直接从user里面获取用户信息，并且更新credential
    const user = userAuth.user;
    const { id, nickname, avatar } = user;

    userAuth.credential = access_token; 

    // 重定向到根路径
    res.writeHead(302,{
      Location:'http://localhost:3000'
    })

    // 保存用户基本信息到cookie和session
    await saveUserInfoToSessionAndCookie(cookies,session,{userId:id,nickname,avatar})
  } else {
    // 用户不存在，从未使用github账号登录过。创建新用户
    const { login='',avatar_url='' } = githubUserInfo as any;
    const user = new User();
    user.nickname = login;
    user.avatar = avatar_url;
    user.job = '暂无';
    user.introduce = '暂无';

    const userAuth = new UserAuth();

    userAuth.identity_type = 'github';
    userAuth.identifier = githubClientId;
    userAuth.credential = access_token;
    userAuth.user = user

    const userAuthsRepo = await db.getRepository(UserAuth);

    const resUserAuth = await userAuthsRepo.save(userAuth);

    const {id,nickname,avatar} = resUserAuth.user

    // 重定向到根路径
    res.writeHead(302,{
      Location:'http://localhost:3000'
    })

    // 保存用户基本信息到cookie和session
    await saveUserInfoToSessionAndCookie(cookies,session,{userId:id,nickname,avatar})
  }
}
