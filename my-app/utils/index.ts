import type { ISession } from 'pages/api';

interface CookieInfo {
  userId: number;
  avatar: string;
  nickname: string;
}

export function setCookie(
  cookies: any,
  { userId, avatar, nickname }: CookieInfo
) {
  // 登录失效时间 设置为24h
  const expiress = new Date(Date.now() + 24 * 60 * 60 * 1000);
  // 运行访问的路由
  const path = '/';

  cookies.set('userId', userId, {
    path,
    expiress,
  });
  cookies.set('avatar', avatar, {
    path,
    expiress,
  });
  cookies.set('nickname', nickname, {
    path,
    expiress,
  });
}

export function clearCookie(cookies: any) {
  // 登录失效时间 设置为24h
  const expiress = new Date(Date.now() + 24 * 60 * 60 * 1000);
  // 运行访问的路由
  const path = '/';
  cookies.set('userId', '', {
    path,
    expiress,
  });
  cookies.set('avatar', '', {
    path,
    expiress,
  });
  cookies.set('nickname', '', {
    path,
    expiress,
  });
}

export async function saveUserInfoToSessionAndCookie(cookies:any, session:ISession, userInfo:Record<string, any>) {
  for (const key in userInfo) {
    if (Object.prototype.hasOwnProperty.call(userInfo, key)) {
      session[key] = userInfo[key];
    }
  }

  // 保存数据到cookie
  setCookie(cookies, userInfo as any);

  await session.save();

  console.log('保存信息到cookie成功');
  
}
