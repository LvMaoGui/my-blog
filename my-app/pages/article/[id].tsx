import { AppDataSource } from 'db';
import { Article } from 'db/entity';
import type { ArticleType } from 'types/model/article-data';
import { Input, Button, message } from 'antd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Badge } from '@/components/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar';
import { Separator } from '@/components/components/ui/separator';
import { Button as UIButton } from '@/components/components/ui/button';
import { 
  Eye, 
  Clock, 
  User, 
  Edit, 
  MessageCircle, 
  Send,
  Calendar,
  Tag as TagIcon,
  ArrowLeft
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { ChangeEvent, useState } from 'react';
import request from 'service/fetch';

export async function getServerSideProps({
  params,
}: {
  params: Record<string, any>,
}) {
  const articleId = params.id;

  const db = await AppDataSource;
  const ArticleRepo = await db.getRepository(Article);
  const article = await ArticleRepo.findOne({
    where: {
      id: articleId,
    },
    relations: ['user', 'comments', 'comments.user'],
  });
  if (article) {
    // 阅读次数+1
    article.views = article.views + 1;
    await ArticleRepo.save(article);
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || [],
      articleId,
    },
  };
}

interface ArticleDetailProps {
  article: ArticleType;
  articleId: string;
}

const ArticleDetail = function (props: ArticleDetailProps) {
  const { article, articleId } = props;
  const {
    user: { nickname, avatar, id },
    comments,
  } = article;
  const store = useStore();
  const loginUserInfo = store.user.userInfo;
  const [inputVal, setInputVal] = useState('');
  const [commentsView, setCommentsView] = useState(comments);

  const handleInputValChange = function (e: ChangeEvent<HTMLTextAreaElement>) {
    setInputVal(e.target.value);
  };

  const handleComment = function () {
    request
      .post('/api/comment/publish', {
        content: inputVal,
        articleId,
        userId: id,
      })
      .then((res: any) => {
        if (res.code === '0') {
          message.success(res.msg || '发表成功');

          // 追加评论
          const newComment = [res.data];
          setCommentsView([...commentsView, ...newComment]);
          setInputVal('');
        } else {
          message.error(res.msg || '发表失败');
        }
      });
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/articles" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>返回文章列表</span>
        </Link>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Article Header */}
          <Card className="bg-card/30 border-border backdrop-blur-sm">
            <CardHeader className="pb-6">
              {/* Article Title */}
              <CardTitle className="text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-6">
                {article.title}
              </CardTitle>
              
              {/* Author Info and Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={avatar} alt={nickname} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                      {nickname?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{nickname}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(article.update_time), 'yyyy年MM月dd日 HH:mm')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{article.views} 次阅读</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Edit Button */}
                {Number(loginUserInfo.userId) === Number(id) && (
                  <UIButton
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link href={`/editor/${articleId}`}>
                      <Edit className="w-4 h-4 mr-2" />
                      编辑文章
                    </Link>
                  </UIButton>
                )}
              </div>
              
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center space-x-2 pt-4">
                  <TagIcon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Article Content */}
          <Card className="bg-card/30 border-border backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <Markdown 
                  options={{
                    overrides: {
                      img: {
                        props: {
                          className: 'w-full rounded-lg shadow-md my-6'
                        }
                      },
                      h1: {
                        props: {
                          className: 'text-3xl font-bold text-foreground mt-8 mb-4'
                        }
                      },
                      h2: {
                        props: {
                          className: 'text-2xl font-semibold text-foreground mt-6 mb-3'
                        }
                      },
                      h3: {
                        props: {
                          className: 'text-xl font-medium text-foreground mt-4 mb-2'
                        }
                      },
                      p: {
                        props: {
                          className: 'text-muted-foreground leading-relaxed mb-4'
                        }
                      },
                      code: {
                        props: {
                          className: 'bg-muted px-2 py-1 rounded text-sm font-mono'
                        }
                      },
                      pre: {
                        props: {
                          className: 'bg-muted p-4 rounded-lg overflow-x-auto my-4'
                        }
                      }
                    }
                  }}
                >
                  {article.content}
                </Markdown>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="bg-card/30 border-border backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl">评论 ({commentsView.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Comment Input */}
              {loginUserInfo.userId && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={loginUserInfo.avatar} alt={loginUserInfo.nickname} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                        {loginUserInfo.nickname?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Input.TextArea
                        placeholder="写下你的想法..."
                        rows={4}
                        value={inputVal}
                        onChange={handleInputValChange}
                        className="resize-none"
                      />
                      <div className="flex justify-end">
                        <UIButton
                          onClick={handleComment}
                          disabled={!inputVal.trim()}
                          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          发表评论
                        </UIButton>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {commentsView.length > 0 ? (
                  commentsView.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.user.avatar} alt={comment.user.nickname} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                          {comment.user.nickname?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-foreground">{comment.user.nickname}</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(comment.update_time), 'yyyy-MM-dd HH:mm:ss')}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">还没有评论，来发表第一个评论吧！</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default observer(ArticleDetail);
