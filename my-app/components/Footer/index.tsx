import type { NextPage } from 'next';
import styles from './index.module.scss';

const Footer: NextPage = () => {
  return (
    <div className={styles.footer}>
      <p>NextJS + React博客 by CodeFly</p>
    </div>
  );
};

export default Footer;
