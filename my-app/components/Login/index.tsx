import styles from './index.module.scss';
import { ChangeEvent, useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import CountDown from 'components/CountDown';
interface LoginProps {
  isShow: boolean;
  onClose: Function;
}

export const Login = function (props: LoginProps) {
  const { isShow = false, onClose } = props;
  console.log(onClose);

  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });

  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);

  /**
   * 关闭Login模态
   */
  const handleClose = function () {
    onClose();
  };

  /**
   * 获取验证码
   */
  const handleGetVerifyCode = function () {
    setIsShowVerifyCode(true);
  };

  /**
   * 登录
   */
  const handleLogin = function () {};

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

  useEffect(() => {
    console.log('login');
  }, []);

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
