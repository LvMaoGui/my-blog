import type { NextApiRequest, NextApiResponse } from 'next';

export default async function config(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      code: '405',
      msg: 'Method not allowed' 
    });
  }

  try {
    const githubClientId = process.env.GITHUB_CLIENT_ID;
    
    if (!githubClientId) {
      return res.status(500).json({ 
        code: '500',
        msg: 'GitHub OAuth 配置未设置' 
      });
    }

    res.status(200).json({
      code: '0',
      msg: 'success',
      data: {
        githubClientId
      }
    });
  } catch (error) {
    console.error('OAuth config error:', error);
    res.status(500).json({ 
      code: '500',
      msg: '获取OAuth配置失败' 
    });
  }
}