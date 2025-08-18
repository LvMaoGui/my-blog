import type { NextPage } from 'next';
import { Divider, Space, Typography } from 'antd';

const Footer: NextPage = () => {
  return (
    <div className="flex flex-col justify-center h-16 bg-white border-b-4 border-b-cyan-300 border-t border-t-slate-200 border-solid items-center  text-slate-400">
      <Space split={<Divider type="vertical" />}>
        <Typography.Text type='secondary'>© 2024 codeFly. All rights reserved.</Typography.Text>
        <Typography.Link type='secondary' href="https://beian.miit.gov.cn/" target="_blank" >
          粤ICP备2024319376号-1
        </Typography.Link>
      </Space>
    </div>
  );
};

export default Footer;
