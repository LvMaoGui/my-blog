import axios, { AxiosResponse } from 'axios';

// 定义API响应的通用类型
interface ApiResponse<T = any> {
  code: string;
  msg: string;
  data: T;
}

const requestInstance = axios.create({ baseURL: '/' });

requestInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

requestInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response?.status === 200) {
      return response?.data;
    } else {
      return {
        code: '-1',
        msg: '未知错误',
        data: null,
      };
    }
  },
  (error) => Promise.reject(error)
);

// 创建类型安全的请求方法
const request = {
  get: <T = any>(url: string, config?: any): Promise<ApiResponse<T>> => {
    return requestInstance.get(url, config);
  },
  post: <T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
    return requestInstance.post(url, data, config);
  },
  put: <T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
    return requestInstance.put(url, data, config);
  },
  delete: <T = any>(url: string, config?: any): Promise<ApiResponse<T>> => {
    return requestInstance.delete(url, config);
  },
};

export default request;
