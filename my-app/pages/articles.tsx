import { AppDataSource } from 'db';
import { Article, Tag } from 'db/entity';
import ArticleListItem from '@/components/ArticleListItem';
import { Spin } from 'antd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Badge } from '@/components/components/ui/badge';
import { Button } from '@/components/components/ui/button';
import { Sparkles, BookOpen, Clock, Eye } from 'lucide-react';

import type { ArticleType } from 'types/model/article-data';
import type { TagType } from 'types/model/tag-data';
import { Fragment, useEffect, useState } from 'react';
import TagFilter from 'components/TagFilter';

interface ArticlesProps {
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

const Articles = (props: ArticlesProps) => {
  const { articles, tags } = props;
  const [articlesData, setArticlesData] = useState<ArticleType[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setArticlesData(articles);
    setLoading(false);
  }, [articles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spin size="large" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Header */}
      <section className="relative py-8 lg:py-12 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  文章列表
                </h1>
                <p className="text-sm text-muted-foreground">
                  共 {articlesData?.length || 0} 篇文章
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>持续更新</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          {/* Tag Filter */}
          <div className="mb-8">
            <TagFilter tags={tags} setArticlesData={setArticlesData} />
          </div>

          {/* Articles Grid */}
          <div className="space-y-8">
            {articlesData?.map((art) => (
              <ArticleListItem article={art} key={'ArticleListItem' + art.id} />
            ))}
          </div>

          {/* Empty State */}
          {(!articlesData || articlesData.length === 0) && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">暂无文章</h3>
              <p className="text-muted-foreground">还没有发布任何文章，敬请期待</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Articles;