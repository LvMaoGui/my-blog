import type { NextPage } from 'next';
import { useState } from 'react';
import { navs } from './config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button, Avatar, Dropdown, message } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import Login from 'components/Login';
import { useStore } from 'store';
import request from 'service/fetch';

import styles from './index.module.scss';
import logo from 'public/Logo/logo.png';

const Navbar: NextPage = () => {
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;

  const [isShowLogin, setIsShowLogin] = useState(false);
  const { pathname, push } = useRouter();

  // 跳转到个人页
  const handleGotoPersoalPage = function () {
    push(`/user/${userId}`);
  };

  // 退出登录
  const handleLogout = function () {
    request.post('/api/user/logout').then((res: any) => {
      if (res.code === '0') {
        store.user.setUserInfo({});
        message.success(res?.msg);
      } else {
        message.error(res?.msg || '未知错误');
      }
    });
  };

  const handleGotoEditorPage = function () {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录');
    }
  };
  const handleLogin = function () {
    setIsShowLogin(true);
  };
  const handleClose = function () {
    setIsShowLogin(false);
  };

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={handleGotoPersoalPage}>
          <HomeOutlined />
          &nbsp;个人主页
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={handleLogout}>
          <LoginOutlined />
          &nbsp;退出系统
        </div>
      ),
    },
  ];

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>
        <Image src={logo.src} alt="logo" width={120} height={60} />
      </section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link
            className={pathname === nav.value ? styles.active : ''}
            key={nav?.label}
            href={{ pathname: nav.value }}
          >
            {nav.label}
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {userId ? (
          <>
            <Dropdown placement="bottomLeft" menu={{ items: menuItems }}>
              <Avatar src={avatar} size={32} />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(Navbar);
