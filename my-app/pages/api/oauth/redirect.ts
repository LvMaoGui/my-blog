import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';

import { AppDataSource } from 'db';
import { ironOption } from 'config';
import type { ISession } from 'pages/api';
import { User, UserAuth } from 'db/entity';
import { Cookie } from 'next-cookie';

import { saveUserInfoToSessionAndCookie } from 'utils';

export default async function redirect(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session: ISession = await getIronSession(req, res, ironOption);
    const { code, state, error: oauthError } = req.query;

    // 检查OAuth错误
    if (oauthError) {
      console.error('OAuth error:', oauthError);
      return res.status(400).send(`
        <script>
          window.opener?.postMessage({
            type: 'OAUTH_ERROR',
            error: 'GitHub授权被拒绝或取消'
          }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      `);
    }

    // 验证必需参数
    if (!code || !state) {
      console.error('Missing required parameters:', { code: !!code, state: !!state });
      return res.status(400).send(`
        <script>
          window.opener?.postMessage({
            type: 'OAUTH_ERROR',
            error: '缺少必需的授权参数'
          }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      `);
    }

    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!githubClientId || !githubClientSecret) {
      console.error('Missing GitHub OAuth configuration');
      return res.status(500).send(`
        <script>
          window.opener?.postMessage({
            type: 'OAUTH_ERROR',
            error: 'GitHub OAuth配置未设置'
          }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      `);
    }

    // 获取access_token
    const tokenParams = new URLSearchParams({
      client_id: githubClientId,
      client_secret: githubClientSecret,
      code: code as string,
    });

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error(`GitHub token request failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, error: tokenError } = tokenData;

    if (tokenError || !access_token) {
      console.error('Token exchange error:', tokenError);
      return res.status(400).send(`
        <script>
          window.opener?.postMessage({
            type: 'OAUTH_ERROR',
            error: '获取GitHub访问令牌失败'
          }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      `);
    }

    // 获取GitHub用户信息
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${access_token}`,
        'User-Agent': 'MyBlog-App',
      },
    });

    if (!userResponse.ok) {
      throw new Error(`GitHub user request failed: ${userResponse.status}`);
    }

    const githubUserInfo = await userResponse.json();


    const cookies = Cookie.fromApiRoute(req, res);
    const db = await AppDataSource;
    
    // 使用GitHub用户ID作为标识符，而不是客户端ID
    const { id: githubUserId, login = '', avatar_url = '', name } = githubUserInfo;
    
    if (!githubUserId) {
      console.error('GitHub user ID not found');
      return res.status(400).send(`
        <script>
          window.opener?.postMessage({
            type: 'OAUTH_ERROR',
            error: '无法获取GitHub用户信息'
          }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      `);
    }

    // 查找现有用户认证记录
    const userAuth = await db.getRepository(UserAuth).findOne({
      where: {
        identity_type: 'github',
        identifier: githubUserId.toString(),
      },
      relations: ['user'],
    });

    let user;
    let isNewUser = false;

    if (userAuth) {
      // 现有用户，更新访问令牌和用户信息
      user = userAuth.user;
      userAuth.credential = access_token;
      
      // 更新用户信息（GitHub信息可能已更改）
      user.nickname = name || login || user.nickname;
      user.avatar = avatar_url || user.avatar;
      
      await db.getRepository(UserAuth).save(userAuth);
      await db.getRepository(User).save(user);
    } else {
      // 新用户，创建用户和认证记录
      isNewUser = true;
      
      user = new User();
      user.nickname = name || login || `GitHub用户${githubUserId}`;
      user.avatar = avatar_url || '';
      user.job = '暂无';
      user.introduce = '暂无';

      const newUserAuth = new UserAuth();
      newUserAuth.identity_type = 'github';
      newUserAuth.identifier = githubUserId.toString();
      newUserAuth.credential = access_token;
      newUserAuth.user = user;

      const savedUserAuth = await db.getRepository(UserAuth).save(newUserAuth);
      user = savedUserAuth.user;
    }

    // 保存用户信息到session和cookie
    await saveUserInfoToSessionAndCookie(cookies, session, {
      userId: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
    });

    // 发送成功消息给前端并关闭弹窗
    const successMessage = isNewUser ? '注册成功！' : '登录成功！';
    
    res.status(200).send(`
      <script>
        window.opener?.postMessage({
          type: 'OAUTH_SUCCESS',
          user: {
            userId: ${user.id},
            nickname: '${user.nickname?.replace(/'/g, "\\'") || ''}',
            avatar: '${user.avatar?.replace(/'/g, "\\'") || ''}'
          },
          message: '${successMessage}'
        }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
        window.close();
      </script>
    `);
    
  } catch (error) {
    console.error('OAuth redirect error:', error);
    
    // 发送错误消息给前端
    const errorMessage = error instanceof Error ? error.message : '登录过程中发生未知错误';
    
    res.status(500).send(`
      <script>
        window.opener?.postMessage({
          type: 'OAUTH_ERROR',
          error: '${errorMessage.replace(/'/g, "\\'")}'  
        }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
        window.close();
      </script>
    `);
  }
}
