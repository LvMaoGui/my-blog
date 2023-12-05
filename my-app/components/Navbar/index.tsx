import type { NextPage } from 'next';
import { useState } from 'react';
import { navs } from './config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button } from 'antd';

import { Login } from 'components/Login';

import styles from './index.module.scss';
import logo from 'public/Logo/logo.png';

const Navbar: NextPage = () => {
  const [isShowLogin, setIsShowLogin] = useState(false);
  console.log(styles);
  const { pathname } = useRouter();
  console.log(pathname);

  const handleGotoEditorPage = function () {};
  const handleLogin = function () {
    setIsShowLogin(true);
  };
  const handleClose = function () {
    setIsShowLogin(false);
  };
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
        <Button type="primary" onClick={handleLogin}>
          登录
        </Button>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default Navbar;
