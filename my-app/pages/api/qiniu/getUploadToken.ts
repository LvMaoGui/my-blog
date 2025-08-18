import * as qiniu from 'qiniu';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ironOption } from 'config';
import { getSessionUserId, isUserAuthenticated } from '../auth/isLogin';
import { EXCEPTION_USER } from '../config/codes';

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getSessionUserId(req, res, ironOption); // 获取用户ID
  const isAuth = await isUserAuthenticated(userId); // 验证用户是否存在

  if (!isAuth) res.status(200).json({ ...EXCEPTION_USER.NOT_LOGIN });
  // 获取分类
  const {category = ''} = req.query

  if(!['public','private'].includes(category as string || '')){
    res.status(200).json({
      code: '-1',
      msg: '类别有误',
    });
  }

  // 创建qiniu鉴权对象
  const mac = new qiniu.auth.digest.Mac(
    process.env.QINIU_ACCESSKEY,
    process.env.QINIU_SECRETKEY
  );
  const options = {
    scope: category === 'private' ? process.env.QINIU_PRIVATE_BUCKET : process.env.QINIU_PUBLIC_BUCKET,
    expires: 7200,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  res.status(200).json({
    code: '0',
    msg: '',
    data: uploadToken,
  });
}
