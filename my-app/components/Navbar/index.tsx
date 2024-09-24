import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import { navs } from './config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button, Avatar, Dropdown, message, Menu, Space } from 'antd';
import {
  LoginOutlined,
  HomeOutlined,
  TagsOutlined,
  MessageOutlined,
} from '@ant-design/icons';
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
  const { push, asPath } = useRouter();
  const defaultSelectedKeys = useMemo(() => {
    const curItem = navs.find((i: any) => i.value === asPath);    
    if (curItem) {
      return [curItem.key];
    }
    return [];
  }, [asPath]);

  const [isShowLogin, setIsShowLogin] = useState(false);

  // 跳转到个人页
  const handleGotoPersoalPage = function () {
    push(`/user/${userId}`);
  };

  const switchMenuIcon = function (labelName: string) {
    switch (labelName) {
      case '首页':
        return <HomeOutlined />;
      case '咨询':
        return <MessageOutlined />;
      case '标签':
        return <TagsOutlined />;
    }
  };

  const MenuItems: MenuProps['items'] = navs.map(
    ({ label, value, key }, index) => {
      return {
        label: (
          <Space>
            {switchMenuIcon(label)}
            <Link key={label} href={{ pathname: value }}>
              {label}
            </Link>
          </Space>
        ),
        key,
      };
    }
  );

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
        <Image
          className={styles.logo}
          width={120}
          height={60}
          src={logo.src}
          alt="logo"
        />
      </section>
      <section className={styles.linkArea}>
        {/* {navs?.map((nav) => (
          <Link
            className={pathname === nav.value ? styles.active : ''}
            key={nav?.label}
            href={{ pathname: nav.value }}
          >
            {nav.label}
          </Link>
        ))} */}
        <Menu
          style={{ flex: 'auto', minWidth: '0' }}
          items={MenuItems}
          mode="horizontal"
          defaultSelectedKeys={[defaultSelectedKeys]}
        ></Menu>
      </section>
      <section className={styles.operationArea}>
        <Space>
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
        </Space>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(Navbar);
