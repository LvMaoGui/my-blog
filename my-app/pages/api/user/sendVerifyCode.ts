import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';

import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';

import request from 'service/fetch';
import { ironOption } from 'config';
import type { ISession } from 'pages/api';

export default async function sendVerifyCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = await getIronSession(req, res, ironOption);
  
  const { to = '', templateId = 1 } = req.body;
  const AccountId = '2c94811c8b1e335b018c3d49cea94187';
  const AccountToken = '6e194ab776bf4b6991e2e604819ba29f';
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${AccountId}${AccountToken}${NowDate}`);
  const Authorization = encode(`${AccountId}:${NowDate}`);
  const AppId = '2c94811c8b1e335b018c3d49d035418e';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;

  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireMinute = '5';
  const response = await request.post(
    url,
    {
      to,
      appId: AppId,
      templateId,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization,
      },
    }
  );
  
  const { statusCode, statusMsg, templateSMS } = response as Record<string,any>;
  if (statusCode === '000000') {
    session.verifyCode = verifyCode;

    
    await session.save();

    res.status(200).json({
      code: 0,
      msg:statusMsg,
      data: {
        templateSMS
      },
    });
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg,
    });
  }
}
