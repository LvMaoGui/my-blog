import { AppDataSource } from 'db';
import { Article } from 'db/entity';
import ArticleListItem from '@/components/ArticleListItem';
import { Divider } from 'antd';

import type { ArticleType } from 'types/model/article-data';
import { Fragment } from 'react';

interface HomeProps {
  articles: ArticleType[];
}

export async function getServerSideProps() {
  const db = await AppDataSource;
  const ArticleRepo = await db.getRepository(Article).find({
    relations: ['user'],
  });
  console.log(ArticleRepo);

  return {
    props: {
      articles: JSON.parse(JSON.stringify(ArticleRepo)) || [],
    },
  };
}

const Home = (props: HomeProps) => {
  const { articles } = props;
  return (
    <div className="content-layout">
      {articles.map((art) => (
        <Fragment key={art.id}>
          <ArticleListItem article={art} key={'ArticleListItem' + art.id} />
          <Divider />
        </Fragment>
      ))}
    </div>
  );
};

export default Home;
