import { AppDataSource } from 'db';
import { Article, Tag } from 'db/entity';
import ArticleListItem from '@/components/ArticleListItem';
import { Divider,Spin } from 'antd';

import type { ArticleType } from 'types/model/article-data';
import type { TagType } from 'types/model/tag-data';
import { Fragment, useEffect, useState } from 'react';
import TagFilter from 'components/TagFilter';

interface HomeProps {
  articles: ArticleType[];
  tags: TagType[];
}

export async function getServerSideProps() {
  const db = await AppDataSource;
  const ArticleRepo = await db.getRepository(Article).find({
    relations: ['user'],
  });
  const Tags = await db.getRepository(Tag).find();

  return {
    props: {
      articles: JSON.parse(JSON.stringify(ArticleRepo)) || [],
      tags: JSON.parse(JSON.stringify(Tags)) || [],
    },
  };
}

const Home = (props: HomeProps) => {
  const { articles, tags } = props;
  const [articlesData, setArticlesData] = useState<ArticleType[] | null>(null);
  const [loading,setLoading] = useState(true);

  
  useEffect(()=>{
    setArticlesData(articles)
    setLoading(false)
  },[
    articles
  ])
  if(loading){
    return <div className='w-[1080px] max-w-full mx-auto bg-white p-5'>
      <Spin></Spin>
    </div>
  }

  return (
    <div className='w-[1080px] max-w-full mx-auto bg-white p-5'>
      <TagFilter tags={tags} setArticlesData={setArticlesData} />
      {articlesData?.map((art) => (
        <Fragment key={art.id}>
          <ArticleListItem article={art} key={'ArticleListItem' + art.id} />
          <Divider />
        </Fragment>
      ))}
    </div>
  );
};

export default Home;
