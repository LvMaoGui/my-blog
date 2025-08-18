import { ArticleType } from 'types/model/article-data';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Badge } from '@/components/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar';
import { Eye, Clock, User, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { markdownToTxt } from 'markdown-to-txt';

interface ArticleListItemProps {
  article: ArticleType;
}

const ArticleListItem = function (props: ArticleListItemProps) {
  const { article } = props;
  const { user } = article;
  const contentPreview = markdownToTxt(article.content).slice(0, 200) + '...';

  return (
    <Card className="bg-card/30 border-border backdrop-blur-sm hover:bg-card/50 hover:border-border/80 transition-all duration-300 cursor-pointer group">
      <Link href={`/article/${article.id}`} className="block">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between space-x-4">
            <div className="flex-1 space-y-3">
              {/* Author Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar} alt={user.nickname} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {user.nickname?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span className="hover:text-primary transition-colors">{user.nickname}</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(article.update_time))}前</span>
                  </div>
                </div>
              </div>
              
              {/* Article Title */}
              <CardTitle className="text-xl lg:text-2xl text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {article.title}
              </CardTitle>
            </div>
            
            {/* Article Cover or Avatar */}
            <div className="hidden sm:block shrink-0">
              {article.cover ? (
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img 
                    src={article.cover} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-2xl lg:text-3xl font-bold text-primary">
                    {article.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Article Description */}
          <CardDescription className="text-base text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {article.description || contentPreview}
          </CardDescription>
          
          {/* Tags and Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300 text-xs"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {article.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{article.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {/* Stats and Read More */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{article.views}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ArticleListItem;
