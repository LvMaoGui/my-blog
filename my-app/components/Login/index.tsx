import styles from './index.module.scss';
import { ChangeEvent, useState } from 'react';
import { message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import CountDown from 'components/CountDown';
import request from 'service/fetch';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
interface LoginProps {
  isShow: boolean;
  onClose: Function;
}

const Login = function (props: LoginProps) {
  const { isShow = false, onClose } = props;

  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });

  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  const store = useStore();
  /**
   * 关闭Login模态
   */
  const handleClose = function () {
    typeof onClose === 'function' && onClose();
    setIsShowVerifyCode(false);
  };

  /**
   * 获取验证码
   */
  const handleGetVerifyCode = function () {
    if (!form?.phone) {
      message.warning('请输入手机号');
      return;
    }
    // 获取手机号
    request
      .post('/api/user/sendVerifyCode', {
        to: form.phone,
        templateId: 1,
      })
      .then((res: { [code: string]: any }) => {
        if (res?.code === 0) {
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || '未知错误');
        }
        console.log(res);
      });
  };

  /**
   * 登录
   */
  const handleLogin = function () {
    request
      .post('/api/user/login', {
        ...form,
        identity_type: 'phone',
      })
      .then((res: Record<string, any>) => {
        if (res?.code === '0') {
          // 登陆成功
          store.user.setUserInfo(res.data);
          // TODO
          message.success('登录成功');
          // 关闭登录模态
          handleClose();
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };

  /**
   * 使用github账号登录
   */
  const handleOAuthGithub = function () {};

  const handleFormChange = function (e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /**
   * 倒计时结束
   */
  const handleCountDownEnd = function () {
    setIsShowVerifyCode(false);
  };

  return (
    <>
      {isShow && (
        <div className={styles.loginArea}>
          <div className={styles.loginBox}>
            <div className={styles.loginTitle}>
              <div>手机号登陆</div>
              <div className={styles.close} onClick={handleClose}>
                <CloseOutlined />
              </div>
            </div>
            <input
              type="text"
              name="phone"
              placeholder="请输入手机号"
              value={form.phone}
              onChange={handleFormChange}
            />
            <div className={styles.verifyCodeArea}>
              <input
                name="verify"
                type="text"
                placeholder="请输入验证码"
                value={form.verify}
                onChange={handleFormChange}
              />
              <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
                {isShowVerifyCode ? (
                  <CountDown time={10} onEnd={handleCountDownEnd} />
                ) : (
                  '获取验证码'
                )}
              </span>
            </div>
            <div className={styles.loginBtn} onClick={handleLogin}>
              登录
            </div>
            <div className={styles.otherLogin} onClick={handleOAuthGithub}>
              使用 Github 账号登录
            </div>
            <div className={styles.loginPrivacy}>
              注册登录即表示同意<a href="">隐私政策</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default observer(Login);
