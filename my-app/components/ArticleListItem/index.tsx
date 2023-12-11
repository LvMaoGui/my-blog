import { ArticleType } from 'types/model/article-data';

import Link from 'next/link';
import styles from './index.module.scss';
import { EyeOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { markdownToTxt } from 'markdown-to-txt';

interface ArticleListItemProps {
  article: ArticleType;
}

const ArticleListItem = function (props: ArticleListItemProps) {
  const { article } = props;
  const { user } = article;

  return (
    <Link href={`/article/${article.id}`}>
      <div className={styles.container}>
        <div className={styles.article}>
          <div className={styles.userInfo}>
            <span className={styles.name}>{user.nickname}</span>
            <span className={styles.date}>
              {formatDistanceToNow(new Date(article.update_time))}
            </span>
          </div>
          <h4 className={styles.title}>{article.title}</h4>
          <p className={styles.content}>{markdownToTxt(article.content)}</p>
          <div className={styles.statistics}>
            <EyeOutlined />
            <span>{article.views}</span>
          </div>
        </div>
        <Avatar src={user.avatar} size={48} />
      </div>
    </Link>
  );
};

export default ArticleListItem;
