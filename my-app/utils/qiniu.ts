import * as qiniu from 'qiniu-js';
import request from 'service/fetch';

const qiniuUploader = async (domain: any, getUptoken: any, file: any, filePath: any, complete: any, param?: Record<string, any>) => {
  const { isSaveName, next, error } = param || {};
  // console.log('file name', file.name);

  // 文件资源名
  const point = file.name.lastIndexOf('.');
  const file_Extension = file.name.substr(point);
  const name = isSaveName ? file.name.substr(0, point) : '';
  const timestamp = new Date().getTime();
  // const key = filePath + name + file_Extension;
  const key = filePath + name + timestamp + Math.round(Math.random() * 10000) + file_Extension;
  // console.log('key', key);

  // 获取七牛云上传凭证
  const tokenRes = await getUptoken();
  const token = tokenRes.uptoken;
  // console.log('tokenRes', tokenRes);

  // 七牛云相关配置
  const putExtra = undefined;
  const config = undefined;
  // 七牛云上传
  const observable = qiniu.upload(file, key, token, putExtra, config);

  // 上传开始
  const subscription = observable.subscribe({
    next(res) {
      // ...
      if (typeof next === 'function') {
        next(res);
      }
    },
    error(err) {
      // ...
      // console.log('err', err);
      if (typeof error === 'function') {
        next(err);
      }
    },
    complete(res) {
      // ...
      // console.log('complete', res);
      if (complete != null) {
        complete(domain, res.key);
      }
    },
  });

  return subscription;
};

const getQiniuPublicToken = () => {
  return request.get('/api/qiniu/getUploadToken', {
    params: {category:'public'},
  })
    .then((res) => ({
      uptoken: res.data,
    }))
    .catch((error) => {
      throw error;
    });
};

const getQiniuPrivateToken = () => {
  return request.get('/api/qiniu/getUploadToken', {
    params: {category:'private'},
  })
    .then((res) => ({
      uptoken: res.data,
    }))
    .catch((error) => {
      throw error;
    });
};

export const uploader = (file: any, filePath: any, complete: any) => {
  // qiniuUploader('https://public.codefly.com/', getQiniuPublicToken, file, filePath, complete, {
  //   isSaveName: true,
  // });
  qiniuUploader('http://sl31ed3wk.hn-bkt.clouddn.com/', getQiniuPublicToken, file, filePath, complete);
};

export const uploaderPrivate = async (
  file: any,
  filePath: any,
  complete: any,
  param = { isSaveName: false, next: (res: any) => {}, error: (err: any) => {} },
) => {
  return await qiniuUploader(
    'http://sl31ed3wk.hn-bkt.clouddn.com/',
    getQiniuPrivateToken,
    file,
    filePath,
    complete,
    param,
  );
};
