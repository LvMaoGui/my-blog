import { AppDataSource } from 'db';
import { User, Article } from 'db/entity';
import Link from 'next/link';
import type { UserType } from 'types/common/user-data';
import type { ArticleType } from 'types/model/article-data';
import { Avatar, Button, Divider } from 'antd';
import {
  CodepenOutlined,
  FireOutlined,
  FundViewOutlined,
} from '@ant-design/icons';
import ArticleListItem from '@/components/ArticleListItem';
import styles from './index.module.scss';

export async function getServerSideProps({ params }: { params: any }) {
  const userId = params.id;

  const db = await AppDataSource;
  const user = await db.getRepository(User).findOne({
    where: {
      id: Number(userId),
    },
  });

  const articles = await db.getRepository(Article).find({
    where: {
      user: {
        id: Number(userId),
      },
    },
    relations: ['user', 'tags'],
  });

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
      articles: JSON.parse(JSON.stringify(articles)),
    },
  };
}

interface UserDetailProps {
  userInfo: UserType;
  articles: ArticleType[];
}

const UserDetail = function (props: UserDetailProps) {
  const { userInfo, articles = [] } = props;
  const viewsCount = articles.reduce((prev: number, next: ArticleType) => {
    return prev + next.views;
  }, 0);
  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar
            className={styles.avatar}
            src={'.' + userInfo.avatar}
            size={90}
          />
          <div>
            <div className={styles.nickname}>{userInfo.nickname}</div>
            <div className={styles.desc}>
              <CodepenOutlined />
              {userInfo.job}
            </div>
            <div className={styles.desc}>
              <FireOutlined />
              {userInfo.introduce}
            </div>
          </div>
          <Link href={'/user/profile'} className={styles.editProfile}>
            <Button>编辑个人资料</Button>
          </Link>
        </div>
        <Divider />
        <div className={styles.articles}>
          {articles.map((article) => (
            <div key={article.id}>
              <ArticleListItem article={article} />
              <Divider />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>个人成就</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>共创作 {articles.length} 篇文章</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>文章被阅读 {viewsCount} 次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
