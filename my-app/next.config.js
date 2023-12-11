/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@ant-design',
    'antd',
    'rc-util',
    'rc-pagination',
    'rc-picker',
  ],
  experimental: {
    forceSwcTransforms: true,
  },
  images: {
    //配置可以下载图片资源的域名
    domains: ['https://img1.baidu.com'],
  },
};
// next.config.js
const removeImports = require('next-remove-imports')();

module.exports = removeImports(nextConfig);
